require("dotenv").config();
require('./jobs/userDeletion.job');


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const promClient = require('prom-client');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const routes = require('./src/routes');
const { errorHandler } = require('./src/middlewares/errorHandler');
const ApiError = require('./src/utils/ApiError')
const { metricsMiddleware } = require('./src/middlewares/metrics');
const ensureAdmin = require('./src/bootstrap/ensureAdmin');

const app = express();
promClient.collectDefaultMetrics();

app.use(helmet());
const allowedOrigins = [
  'http://localhost:3001',
  'http://csgroup31.cpkku.com',
  'https://csgroup31.cpkku.com'
];



const corsOptions = {
  origin: function (origin, callback) {
    // อนุญาต Postman / curl (ไม่มี origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // เปิดรับ preflight สำหรับทุก route

app.use(express.json());

//Rate Limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100,
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use(limiter);

//Metrics Middleware
app.use(metricsMiddleware);

// --- Routes ---
// Health Check Route
app.get('/health', async (req, res) => {
    try {
        const prisma = require('./src/utils/prisma');
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        res.status(503).json({ status: 'error', detail: err.message });
    }
});

// Prometheus Metrics Route
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

// Swagger Documentation Route
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Main API Routes
app.use('/api', routes);

app.use((req, res, next) => {
    next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
});

// --- Error Handling Middleware ---
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 3000;
(async () => {
    try {
        await ensureAdmin();
    } catch (e) {
        console.error('Admin bootstrap failed:', e);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
})();
// Graceful Shutdown
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);

});
