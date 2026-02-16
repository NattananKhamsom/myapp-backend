const cron = require('node-cron');
const prisma = require('../src/utils/prisma');



// รันทุกวันตอนตี 3
cron.schedule('0 3 * * *', async () => {
    console.log('Running user deletion cleanup job...');

    try {
        const usersToDelete = await prisma.user.findMany({
            where: {
                isDeleted: true,
                deletedAt: {
                    lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                }
            }
        });

        for (const user of usersToDelete) {
            await prisma.user.delete({
                where: { id: user.id }
            });
        }

        console.log(`Deleted ${usersToDelete.length} users permanently.`);
    } catch (error) {
        console.error('User deletion job failed:', error);
    }
});
