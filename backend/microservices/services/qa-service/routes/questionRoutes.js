const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');
const { auth, authorize } = require('../middleware/auth');

// 需要认证的路由
router.post('/', auth, QuestionController.submitQuestion);
router.get('/history', auth, QuestionController.getUserQuestions);
router.get('/:id', auth, QuestionController.getQuestionById);
router.put('/:id/resolve', auth, QuestionController.resolveQuestion);

// 客服/管理员路由
router.get('/pending/list', auth, authorize('admin', 'customer_service'), QuestionController.getPendingQuestions);
router.post('/:id/answer', auth, authorize('admin', 'customer_service'), QuestionController.humanAnswer);
router.put('/:id/transfer', auth, authorize('admin', 'customer_service'), QuestionController.transferToHuman);

module.exports = router;
