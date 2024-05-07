const router = require('express').Router();
const statController = require('../../controllers/v1/stats_controller');

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});

router.get('/compressed-data/individual', statController.individualCompressedDataStat);
router.get('/compressed-data/overall', statController.overallCompressedDataStat);

module.exports = router;