const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/routeGuard');

// Public routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Protected routes - Client
router.get('/events', protectRoute(['client', 'employee', 'admin']), eventController.getEvents);
router.post('/events', protectRoute(['client', 'employee', 'admin']), eventController.createEvent);

// Protected routes - Employee
router.get('/dashboard', protectRoute(['employee', 'admin']), dashboardController.getData);
router.put('/events/:id', protectRoute(['employee', 'admin']), eventController.updateEvent);

// Protected routes - Admin
router.get('/admin/*', protectRoute(['admin']), adminController.handleAdminRoutes);
router.post('/users', protectRoute(['admin']), adminController.createUser);
router.get('/logs', protectRoute(['admin']), adminController.getLogs);

// Add this new route for admin dashboard data
router.get('/admin/dashboard', protectRoute(['admin']), async (req, res) => {
    try {
        const [totalUsers, activeEvents, monthlyRevenue, recentActivities] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments({ status: 'active' }),
            Event.aggregate([
                { $match: { 
                    createdAt: { 
                        $gte: new Date(new Date().setDate(1)) 
                    },
                    status: 'completed'
                }},
                { $group: { 
                    _id: null, 
                    total: { $sum: '$totalPrice' } 
                }}
            ]),
            ActivityLog.find()
                .sort('-timestamp')
                .limit(10)
                .populate('user', 'name')
        ]);

        res.json({
            totalUsers,
            activeEvents,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            recentActivities: recentActivities.map(activity => ({
                user: activity.user.name,
                action: activity.action,
                timestamp: activity.timestamp,
                status: activity.status
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

module.exports = router;