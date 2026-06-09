/**
 * 模拟数据模块
 * 当MySQL不可用时使用内存存储
 */

// 模拟用户数据
let mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$wIMLZGVwOfgpHDGEZd6ZOOEYlr/d6RGWiqf.tvb2ghKXwmoqYM16u', // admin123
    nickname: '管理员',
    role: 'admin',
    created_at: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'student001',
    password: '$2a$10$wIMLZGVwOfgpHDGEZd6ZOOEYlr/d6RGWiqf.tvb2ghKXwmoqYM16u', // admin123
    nickname: '学生小明',
    role: 'student',
    created_at: '2024-01-02 00:00:00'
  }
];

// 模拟知识库数据
let mockKnowledge = [
  { id: 1, title: '入学指南', content: '新生入学需携带身份证、录取通知书、一寸照片8张。报到时间为9月1日-9月3日，地点为大学生活动中心。', category: 'admission', keywords: '入学,报到,新生,录取', created_at: '2024-01-01 00:00:00' },
  { id: 2, title: '图书馆开放时间', content: '图书馆周一至周五开放时间为8:00-22:00，周末为9:00-20:00。寒暑假期间开放时间调整为10:00-18:00。', category: 'campus', keywords: '图书馆,开放时间', created_at: '2024-01-01 00:00:00' },
  { id: 3, title: '奖学金申请', content: '国家奖学金申请条件：成绩排名专业前10%，无违纪记录，有突出的综合素质表现。申请时间为每年10月。', category: 'academic', keywords: '奖学金,申请,国家奖学金', created_at: '2024-01-01 00:00:00' },
  { id: 4, title: '就业指导中心', content: '就业指导中心位于大学生活动中心3楼，提供简历指导、模拟面试、招聘会信息等服务。开放时间：周一至周五9:00-17:00。', category: 'career', keywords: '就业,指导,简历', created_at: '2024-01-01 00:00:00' },
  { id: 5, title: '宿舍管理规定', content: '宿舍门禁时间为23:00-6:00，禁止使用大功率电器，每周二、周五进行卫生检查。', category: 'life', keywords: '宿舍,门禁,卫生', created_at: '2024-01-01 00:00:00' },
  { id: 6, title: '选课系统', content: '选课系统于每学期开学前两周开放，学生需登录教务系统进行选课。每人每学期最多可选25学分。', category: 'academic', keywords: '选课,学分,教务系统', created_at: '2024-01-01 00:00:00' },
  { id: 7, title: '食堂分布', content: '学校共有3个食堂：第一食堂位于教学区，第二食堂位于宿舍区，第三食堂位于体育馆附近。', category: 'life', keywords: '食堂,就餐', created_at: '2024-01-01 00:00:00' },
  { id: 8, title: '校园卡充值', content: '校园卡可在食堂充值机、自助服务终端或通过校园APP进行充值。充值最低金额为10元。', category: 'campus', keywords: '校园卡,充值', created_at: '2024-01-01 00:00:00' },
  { id: 9, title: '转专业政策', content: '转专业申请时间为大一下学期和大二上学期，要求成绩绩点达到3.0以上，无挂科记录。', category: 'academic', keywords: '转专业,绩点', created_at: '2024-01-01 00:00:00' },
  { id: 10, title: '毕业要求', content: '本科生需修满150学分，通过毕业论文答辩，英语达到四级水平，计算机达到二级水平。', category: 'academic', keywords: '毕业,学分,论文', created_at: '2024-01-01 00:00:00' }
];

// 模拟问题数据
let mockQuestions = [];

// 模拟回答数据
let mockAnswers = [];

// 模拟消息数据
let mockMessages = [];

// 模拟登录历史记录数据
let mockLoginHistory = [];

let nextUserId = 3;
let nextQuestionId = 1;
let nextAnswerId = 1;
let nextMessageId = 1;
let nextLoginHistoryId = 1;

module.exports = {
  mockUsers,
  mockKnowledge,
  mockQuestions,
  mockAnswers,
  mockMessages,
  mockLoginHistory,
  getNextUserId: () => nextUserId++,
  getNextQuestionId: () => nextQuestionId++,
  getNextAnswerId: () => nextAnswerId++,
  getNextMessageId: () => nextMessageId++,
  getNextLoginHistoryId: () => nextLoginHistoryId++
};
