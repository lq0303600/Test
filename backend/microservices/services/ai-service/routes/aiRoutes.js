const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');

// 内部服务调用
router.post('/ask', AIController.ask);

// 搜索融合接口 - AI问答与校园搜索融合
router.post('/search-ask', AIController.searchAsk);

// 天气预报接口
router.get('/weather', AIController.getWeather);
router.get('/weather/forecast', AIController.getWeatherForecast);

// 公开接口（可用于测试）
router.post('/intent', AIController.recognizeIntent);
router.post('/classify', AIController.classify);
router.get('/retrieve', AIController.retrieve);

module.exports = router;
