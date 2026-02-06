const express = require('express');
const router = express.Router();

const DashboardService = require('./../services/dashboard.service');
const service = new DashboardService();

router.get('/stats', async (req, res, next) => {
    try {
        const stats = await service.getDashboardStats(req.query);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

module.exports = router;