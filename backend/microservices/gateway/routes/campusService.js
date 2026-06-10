/**
 * 校园服务API路由 - 内存存储版本
 * 处理通知、课表、成绩、图书、活动等请求
 */

const express = require('express');
const router = express.Router();

// 模拟数据存储
const mockData = {
    notices: [
        { id: 1, title: '关于2026春季学期课程安排的通知', content: '2026春季学期课程将于2月25日正式开始，请各位老师做好教学准备。', type: 'academic', status: 'published', is_top: 1, views: 156, created_at: '2026-02-20 10:00:00', publisher: '教务处' },
        { id: 2, title: '教师培训通知', content: '定于3月1日下午2点在学术报告厅举行教师信息化培训，请各位老师准时参加。', type: 'training', status: 'published', is_top: 1, views: 89, created_at: '2026-02-18 14:30:00', publisher: '人事处' },
        { id: 3, title: '校园安全提醒', content: '近期校园内发现可疑人员，请各位师生注意安全，夜间尽量结伴出行。', type: 'safety', status: 'published', is_top: 0, views: 234, created_at: '2026-02-15 09:00:00', publisher: '保卫处' },
        { id: 4, title: '图书馆新书到馆通知', content: '本周新增图书500册，涵盖计算机、文学、历史等多个领域，欢迎借阅。', type: 'library', status: 'published', is_top: 0, views: 67, created_at: '2026-02-14 11:00:00', publisher: '图书馆' },
        { id: 5, title: '食堂菜品更新', content: '新学期食堂将推出多款新菜品，欢迎师生品尝并提出宝贵意见。', type: 'life', status: 'published', is_top: 0, views: 123, created_at: '2026-02-12 16:00:00', publisher: '后勤处' }
    ],
    schedules: [
        { id: 1, user_id: 2, course_name: '高等数学', course_code: 'MATH101', teacher_name: '李老师', classroom: '教学楼A-301', day_of_week: 1, start_section: 1, end_section: 2, semester: '2026春季' },
        { id: 2, user_id: 2, course_name: '线性代数', course_code: 'MATH102', teacher_name: '李老师', classroom: '教学楼B-205', day_of_week: 2, start_section: 3, end_section: 4, semester: '2026春季' },
        { id: 3, user_id: 2, course_name: '概率论与数理统计', course_code: 'MATH103', teacher_name: '李老师', classroom: '教学楼A-401', day_of_week: 3, start_section: 1, end_section: 2, semester: '2026春季' },
        { id: 4, user_id: 2, course_name: '数学建模', course_code: 'MATH201', teacher_name: '李老师', classroom: '实验楼C-101', day_of_week: 4, start_section: 5, end_section: 6, semester: '2026春季' },
        { id: 5, user_id: 2, course_name: '高等数学', course_code: 'MATH101', teacher_name: '李老师', classroom: '教学楼A-301', day_of_week: 5, start_section: 1, end_section: 2, semester: '2026春季' },
        // 历史学期数据
        { id: 6, user_id: 2, course_name: '微积分', course_code: 'MATH001', teacher_name: '李老师', classroom: '教学楼A-201', day_of_week: 1, start_section: 3, end_section: 4, semester: '2025秋季' },
        { id: 7, user_id: 2, course_name: '离散数学', course_code: 'MATH002', teacher_name: '李老师', classroom: '教学楼B-105', day_of_week: 2, start_section: 1, end_section: 2, semester: '2025秋季' },
        { id: 8, user_id: 2, course_name: '高等数学', course_code: 'MATH101', teacher_name: '李老师', classroom: '教学楼A-301', day_of_week: 1, start_section: 1, end_section: 2, semester: '2025春季' }
    ],
    grades: [
        { id: 1, user_id: 2, course_name: '高等数学', semester: '2026春季', grade: 92, grade_point: 4.0, credit: 4 },
        { id: 2, user_id: 2, course_name: '线性代数', semester: '2026春季', grade: 88, grade_point: 3.7, credit: 3 },
        { id: 3, user_id: 2, course_name: '概率论与数理统计', semester: '2025秋季', grade: 95, grade_point: 4.0, credit: 3 },
        { id: 4, user_id: 2, course_name: '数学建模', semester: '2025秋季', grade: 85, grade_point: 3.5, credit: 2 },
        { id: 5, user_id: 2, course_name: '微积分', semester: '2025春季', grade: 90, grade_point: 4.0, credit: 4 }
    ],
    books: [
        { id: 1, title: '深入理解计算机系统', author: 'Randal E. Bryant', category: '计算机', isbn: '978-7-111-54493-7', publisher: '机械工业出版社', publish_year: 2016, stock: 5, location: '图书馆A区-3排' },
        { id: 2, title: '算法导论', author: 'Thomas H. Cormen', category: '计算机', isbn: '978-7-111-40701-0', publisher: '机械工业出版社', publish_year: 2012, stock: 3, location: '图书馆A区-5排' },
        { id: 3, title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', category: '计算机', isbn: '978-7-115-36339-9', publisher: '人民邮电出版社', publish_year: 2019, stock: 4, location: '图书馆A区-8排' },
        { id: 4, title: '围城', author: '钱钟书', category: '文学', isbn: '978-7-02-002475-9', publisher: '人民文学出版社', publish_year: 1991, stock: 10, location: '图书馆B区-2排' },
        { id: 5, title: '活着', author: '余华', category: '文学', isbn: '978-7-5063-3462-6', publisher: '作家出版社', publish_year: 2004, stock: 8, location: '图书馆B区-3排' },
        { id: 6, title: '明朝那些事儿', author: '当年明月', category: '历史', isbn: '978-7-5063-4634-0', publisher: '浙江人民出版社', publish_year: 2009, stock: 6, location: '图书馆C区-1排' },
        { id: 7, title: '万历十五年', author: '黄仁宇', category: '历史', isbn: '978-7-5086-1134-5', publisher: '中华书局', publish_year: 2006, stock: 4, location: '图书馆C区-2排' },
        { id: 8, title: '三体', author: '刘慈欣', category: '科幻', isbn: '978-7-5366-9293-0', publisher: '重庆出版社', publish_year: 2008, stock: 7, location: '图书馆D区-1排' }
    ],
    borrow_records: [
        { id: 1, user_id: 2, book_id: 1, borrow_date: '2026-02-10', due_date: '2026-03-10', return_date: null, status: 'borrowed' },
        { id: 2, user_id: 2, book_id: 4, borrow_date: '2026-01-15', due_date: '2026-02-15', return_date: '2026-02-12', status: 'returned' },
        { id: 3, user_id: 2, book_id: 8, borrow_date: '2026-02-01', due_date: '2026-03-01', return_date: null, status: 'borrowed' }
    ],
    campus_cards: [
        { id: 1, user_id: 2, card_number: 'CARD20240002', balance: 580.50, status: 'active', created_at: '2024-09-01' }
    ],
    card_transactions: [
        { id: 1, card_id: 1, type: 'recharge', amount: 200.00, description: '用户充值', created_at: '2026-02-01 10:30:00' },
        { id: 2, card_id: 1, type: 'consume', amount: -15.00, description: '食堂就餐', created_at: '2026-02-10 12:00:00' },
        { id: 3, card_id: 1, type: 'consume', amount: -8.50, description: '超市购物', created_at: '2026-02-11 16:30:00' },
        { id: 4, card_id: 1, type: 'recharge', amount: 500.00, description: '用户充值', created_at: '2026-02-15 09:00:00' },
        { id: 5, card_id: 1, type: 'consume', amount: -122.00, description: '图书押金', created_at: '2026-02-18 14:00:00' }
    ],
    activities: [
        { id: 1, title: '春季运动会', description: '一年一度的春季运动会将于3月15日举行，欢迎各位老师参与。', type: 'sports', status: 'upcoming', start_time: '2026-03-15 08:00:00', end_time: '2026-03-15 18:00:00', location: '体育场', max_participants: 500, current_participants: 320 },
        { id: 2, title: '学术讲座：人工智能前沿', description: '邀请知名专家讲解人工智能最新发展趋势。', type: 'academic', status: 'upcoming', start_time: '2026-02-25 14:00:00', end_time: '2026-02-25 16:00:00', location: '学术报告厅', max_participants: 200, current_participants: 185 },
        { id: 3, title: '教师团建活动', description: '组织教师户外拓展活动，增进团队凝聚力。', type: 'social', status: 'upcoming', start_time: '2026-03-08 09:00:00', end_time: '2026-03-08 17:00:00', location: '郊外拓展基地', max_participants: 80, current_participants: 65 },
        { id: 4, title: '新年晚会', description: '2026年新年晚会圆满结束，感谢各位参与。', type: 'cultural', status: 'completed', start_time: '2026-01-01 19:00:00', end_time: '2026-01-01 22:00:00', location: '大礼堂', max_participants: 1000, current_participants: 950 }
    ],
    activity_signups: [
        { id: 1, activity_id: 1, user_id: 2, created_at: '2026-02-20' },
        { id: 2, activity_id: 2, user_id: 2, created_at: '2026-02-18' }
    ],
    messages: [
        { id: 1, user_id: 2, title: '课程安排更新', content: '您的高等数学课程时间调整为周一上午1-2节。', type: 'system', is_read: 0, is_top: 1, created_at: '2026-02-20 09:00:00' },
        { id: 2, user_id: 2, title: '学生请假通知', content: '张三同学因生病需要请假一周，请知悉。', type: 'academic', is_read: 0, is_top: 0, created_at: '2026-02-19 14:30:00' },
        { id: 3, user_id: 2, title: '教学评估提醒', content: '请在本周内完成上学期教学评估。', type: 'system', is_read: 1, is_top: 0, created_at: '2026-02-18 10:00:00' },
        { id: 4, user_id: 2, title: '教材更新通知', content: '下学期将使用新版教材，请提前做好准备。', type: 'academic', is_read: 1, is_top: 0, created_at: '2026-02-15 16:00:00' }
    ],
    lost_found: [
        { id: 1, title: '寻物启事：黑色钱包', description: '在图书馆三楼遗失黑色钱包一个，内有身份证和银行卡若干。', type: 'lost', location: '图书馆三楼', contact: '13800138002', user_id: 2, status: 'open', created_at: '2026-02-19 11:00:00' },
        { id: 2, title: '招领启事：学生证', description: '在食堂捡到学生证一张，姓名：李四，学号：2024002001', type: 'found', location: '食堂一楼', contact: '13800138003', user_id: 3, status: 'open', created_at: '2026-02-18 12:30:00' },
        { id: 3, title: '寻物启事：U盘', description: '在教学楼A-301教室遗失U盘一个，里面有重要教学资料。', type: 'lost', location: '教学楼A-301', contact: '13800138004', user_id: 4, status: 'closed', created_at: '2026-02-10 10:00:00' }
    ],
    repairs: [
        { id: 1, user_id: 2, title: '教室投影仪故障', description: '教学楼A-301教室投影仪无法正常显示，请尽快维修。', location: '教学楼A-301', category: 'electronics', status: 'pending', repairman: '王师傅', repair_time: null, created_at: '2026-02-20 08:30:00' },
        { id: 2, user_id: 2, title: '办公室空调不制冷', description: '教师办公室302室空调不制冷，需要维修。', location: '办公楼302室', category: 'facilities', status: 'processing', repairman: '李师傅', repair_time: '2026-02-19 14:00:00', created_at: '2026-02-18 10:00:00' },
        { id: 3, user_id: 2, title: '实验设备损坏', description: '实验楼C-101室电脑主机无法启动。', location: '实验楼C-101', category: 'equipment', status: 'completed', repairman: '张师傅', repair_time: '2026-02-15 16:00:00', created_at: '2026-02-14 09:00:00' }
    ],
    canteen_menus: [
        { id: 1, canteen_name: '第一食堂', meal_type: 'breakfast', date: new Date().toISOString().split('T')[0], dishes: JSON.stringify([{ name: '豆浆', price: 2.0, portion: '中杯', sold_at: '一楼窗口1' }, { name: '油条', price: 1.5, portion: '一根', sold_at: '一楼窗口1' }, { name: '包子', price: 1.0, portion: '一个', sold_at: '一楼窗口2' }, { name: '鸡蛋', price: 1.5, portion: '一个', sold_at: '一楼窗口1' }, { name: '粥', price: 2.0, portion: '一碗', sold_at: '一楼窗口3' }]) },
        { id: 2, canteen_name: '第一食堂', meal_type: 'lunch', date: new Date().toISOString().split('T')[0], dishes: JSON.stringify([{ name: '红烧肉', price: 12.0, portion: '一份', sold_at: '二楼窗口1' }, { name: '番茄炒蛋', price: 8.0, portion: '一份', sold_at: '二楼窗口2' }, { name: '清炒时蔬', price: 6.0, portion: '一份', sold_at: '二楼窗口2' }, { name: '米饭', price: 2.0, portion: '一碗', sold_at: '二楼窗口5' }, { name: '酸辣土豆丝', price: 6.0, portion: '一份', sold_at: '二楼窗口3' }]) },
        { id: 3, canteen_name: '第二食堂', meal_type: 'lunch', date: new Date().toISOString().split('T')[0], dishes: JSON.stringify([{ name: '牛肉面', price: 15.0, portion: '一碗', sold_at: '一楼窗口1' }, { name: '盖浇饭', price: 10.0, portion: '一份', sold_at: '一楼窗口2' }, { name: '麻辣烫', price: 12.0, portion: '一份', sold_at: '一楼窗口3' }, { name: '炒饭', price: 8.0, portion: '一份', sold_at: '一楼窗口4' }]) }
    ],
    dormitories: [
        { id: 1, user_id: 2, building: '教师公寓A栋', room_number: '302', bed_number: 1, status: 'occupied', check_in_date: '2024-09-01' }
    ]
};

// 通知公告列表
router.get('/notices', (req, res) => {
    try {
        const { type, page = 1, pageSize = 10, keyword } = req.query;
        const offset = (page - 1) * pageSize;
        const pageSizeInt = parseInt(pageSize);
        const offsetInt = parseInt(offset);
        const pageInt = parseInt(page);
        
        let notices = mockData.notices.filter(n => n.status === 'published');
        
        if (type) {
            notices = notices.filter(n => n.type === type);
        }
        
        if (keyword) {
            notices = notices.filter(n => n.title.includes(keyword) || n.content.includes(keyword));
        }
        
        notices.sort((a, b) => b.is_top - a.is_top || new Date(b.created_at) - new Date(a.created_at));
        
        const total = notices.length;
        const list = notices.slice(offsetInt, offsetInt + pageSizeInt);
        
        res.json({
            code: 0,
            data: { list, total, page: pageInt, pageSize: pageSizeInt }
        });
    } catch (error) {
        console.error('通知列表错误:', error);
        res.status(500).json({ code: 500, message: '获取通知列表失败' });
    }
});

// 通知详情
router.get('/notices/:id', (req, res) => {
    try {
        const notice = mockData.notices.find(n => n.id === parseInt(req.params.id));
        if (!notice) {
            return res.status(404).json({ code: 404, message: '通知不存在' });
        }
        
        notice.views++;
        
        res.json({ code: 0, data: notice });
    } catch (error) {
        console.error('通知详情错误:', error);
        res.status(500).json({ code: 500, message: '获取通知详情失败' });
    }
});

// 课表查询
router.get('/schedules', (req, res) => {
    try {
        const { userId, semester = '2026春季' } = req.query;
        
        let schedules = mockData.schedules.filter(s => s.semester === semester);
        
        if (userId) {
            schedules = schedules.filter(s => s.user_id === parseInt(userId));
        }
        
        schedules.sort((a, b) => a.day_of_week - b.day_of_week || a.start_section - b.start_section);
        
        res.json({ code: 0, data: schedules });
    } catch (error) {
        console.error('课表查询错误:', error);
        res.status(500).json({ code: 500, message: '获取课表失败' });
    }
});

// 成绩查询
router.get('/grades', (req, res) => {
    try {
        const { userId, semester } = req.query;
        
        let grades = mockData.grades;
        
        if (userId) {
            grades = grades.filter(g => g.user_id === parseInt(userId));
        }
        if (semester) {
            grades = grades.filter(g => g.semester === semester);
        }
        
        grades.sort((a, b) => new Date(b.semester) - new Date(a.semester));
        
        let avgGpa = 0;
        if (grades.length > 0) {
            const totalPoints = grades.reduce((sum, r) => sum + (parseFloat(r.grade_point) || 0), 0);
            avgGpa = (totalPoints / grades.length).toFixed(2);
        }
        
        res.json({ code: 0, data: { list: grades, avgGpa } });
    } catch (error) {
        console.error('成绩查询错误:', error);
        res.status(500).json({ code: 500, message: '获取成绩失败' });
    }
});

// 图书列表
router.get('/books', (req, res) => {
    try {
        const { keyword, category, page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;
        
        let books = mockData.books;
        
        if (keyword) {
            books = books.filter(b => b.title.includes(keyword) || b.author.includes(keyword));
        }
        if (category) {
            books = books.filter(b => b.category === category);
        }
        
        const pageSizeInt = parseInt(pageSize);
        const offsetInt = parseInt(offset);
        
        const total = books.length;
        const list = books.slice(offsetInt, offsetInt + pageSizeInt);
        
        res.json({ code: 0, data: { list, total } });
    } catch (error) {
        console.error('图书列表错误:', error);
        res.status(500).json({ code: 500, message: '获取图书列表失败' });
    }
});

// 借阅记录
router.get('/borrow-records', (req, res) => {
    try {
        const { userId } = req.query;
        
        let records = mockData.borrow_records;
        
        if (userId) {
            records = records.filter(r => r.user_id === parseInt(userId));
        }
        
        const recordsWithBooks = records.map(r => {
            const book = mockData.books.find(b => b.id === r.book_id);
            return { ...r, title: book?.title || '', author: book?.author || '' };
        });
        
        recordsWithBooks.sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));
        
        res.json({ code: 0, data: recordsWithBooks });
    } catch (error) {
        console.error('借阅记录错误:', error);
        res.status(500).json({ code: 500, message: '获取借阅记录失败' });
    }
});

// 校园卡信息
router.get('/campus-card/:userId', (req, res) => {
    try {
        const card = mockData.campus_cards.find(c => c.user_id === parseInt(req.params.userId));
        
        if (!card) {
            return res.status(404).json({ code: 404, message: '校园卡不存在' });
        }
        
        const transactions = mockData.card_transactions
            .filter(t => t.card_id === card.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10);
        
        res.json({ code: 0, data: { card, transactions } });
    } catch (error) {
        console.error('校园卡查询错误:', error);
        res.status(500).json({ code: 500, message: '获取校园卡信息失败' });
    }
});

// 校园卡充值
router.post('/campus-card/recharge', (req, res) => {
    try {
        const { userId, amount } = req.body;
        
        const card = mockData.campus_cards.find(c => c.user_id === parseInt(userId));
        
        if (!card) {
            return res.status(404).json({ code: 404, message: '校园卡不存在' });
        }
        
        card.balance += parseFloat(amount);
        
        const newTransaction = {
            id: mockData.card_transactions.length + 1,
            card_id: card.id,
            type: 'recharge',
            amount: parseFloat(amount),
            description: '用户充值',
            created_at: new Date().toLocaleString('zh-CN')
        };
        
        mockData.card_transactions.push(newTransaction);
        
        res.json({ code: 0, message: '充值成功', data: { balance: card.balance } });
    } catch (error) {
        console.error('校园卡充值错误:', error);
        res.status(500).json({ code: 500, message: '充值失败' });
    }
});

// 活动列表
router.get('/activities', (req, res) => {
    try {
        const { type, status = 'upcoming', page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;
        
        let activities = mockData.activities;
        
        if (type) {
            activities = activities.filter(a => a.type === type);
        }
        if (status) {
            activities = activities.filter(a => a.status === status);
        }
        
        const pageSizeInt = parseInt(pageSize);
        const offsetInt = parseInt(offset);
        
        activities.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        
        const total = activities.length;
        const list = activities.slice(offsetInt, offsetInt + pageSizeInt);
        
        res.json({ code: 0, data: { list, total } });
    } catch (error) {
        console.error('活动列表错误:', error);
        res.status(500).json({ code: 500, message: '获取活动列表失败' });
    }
});

// 活动报名
router.post('/activities/signup', (req, res) => {
    try {
        const { activityId, userId } = req.body;
        
        const existing = mockData.activity_signups.find(
            s => s.activity_id === parseInt(activityId) && s.user_id === parseInt(userId)
        );
        
        if (existing) {
            return res.status(400).json({ code: 400, message: '您已报名此活动' });
        }
        
        const newSignup = {
            id: mockData.activity_signups.length + 1,
            activity_id: parseInt(activityId),
            user_id: parseInt(userId),
            created_at: new Date().toISOString().split('T')[0]
        };
        
        mockData.activity_signups.push(newSignup);
        
        const activity = mockData.activities.find(a => a.id === parseInt(activityId));
        if (activity) {
            activity.current_participants++;
        }
        
        res.json({ code: 0, message: '报名成功' });
    } catch (error) {
        console.error('活动报名错误:', error);
        res.status(500).json({ code: 500, message: '报名失败' });
    }
});

// 消息列表
router.get('/messages', (req, res) => {
    try {
        const { userId, type, isRead } = req.query;
        
        let messages = mockData.messages;
        
        if (userId) {
            messages = messages.filter(m => m.user_id === parseInt(userId));
        }
        if (type) {
            messages = messages.filter(m => m.type === type);
        }
        if (isRead !== undefined) {
            messages = messages.filter(m => m.is_read === (isRead === 'true' ? 1 : 0));
        }
        
        messages.sort((a, b) => b.is_top - a.is_top || new Date(b.created_at) - new Date(a.created_at));
        
        const unreadCount = mockData.messages.filter(
            m => m.user_id === parseInt(userId) && m.is_read === 0
        ).length;
        
        res.json({ code: 0, data: { list: messages, unreadCount } });
    } catch (error) {
        console.error('消息列表错误:', error);
        res.status(500).json({ code: 500, message: '获取消息列表失败' });
    }
});

// 标记消息已读
router.post('/messages/read', (req, res) => {
    try {
        const { messageIds } = req.body;
        
        if (messageIds && messageIds.length > 0) {
            messageIds.forEach(id => {
                const message = mockData.messages.find(m => m.id === parseInt(id));
                if (message) {
                    message.is_read = 1;
                }
            });
        }
        
        res.json({ code: 0, message: '已标记为已读' });
    } catch (error) {
        console.error('标记已读错误:', error);
        res.status(500).json({ code: 500, message: '操作失败' });
    }
});

// 失物招领列表
router.get('/lost-found', (req, res) => {
    try {
        const { type, status = 'open' } = req.query;
        
        let items = mockData.lost_found.filter(item => item.status === status);
        
        if (type) {
            items = items.filter(item => item.type === type);
        }
        
        items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        res.json({ code: 0, data: items });
    } catch (error) {
        console.error('失物招领错误:', error);
        res.status(500).json({ code: 500, message: '获取列表失败' });
    }
});

// 发布失物招领
router.post('/lost-found', (req, res) => {
    try {
        const { title, description, type, location, contact, userId } = req.body;
        
        const newItem = {
            id: mockData.lost_found.length + 1,
            title,
            description,
            type,
            location,
            contact,
            user_id: parseInt(userId),
            status: 'open',
            created_at: new Date().toLocaleString('zh-CN')
        };
        
        mockData.lost_found.push(newItem);
        
        res.json({ code: 0, message: '发布成功' });
    } catch (error) {
        console.error('发布失物招领错误:', error);
        res.status(500).json({ code: 500, message: '发布失败' });
    }
});

// 报修列表
router.get('/repairs', (req, res) => {
    try {
        const { userId, status } = req.query;
        
        let repairs = mockData.repairs;
        
        if (userId) {
            repairs = repairs.filter(r => r.user_id === parseInt(userId));
        }
        if (status) {
            repairs = repairs.filter(r => r.status === status);
        }
        
        repairs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        res.json({ code: 0, data: repairs });
    } catch (error) {
        console.error('报修列表错误:', error);
        res.status(500).json({ code: 500, message: '获取列表失败' });
    }
});

// 提交报修
router.post('/repairs', (req, res) => {
    try {
        const { userId, title, description, location, category } = req.body;
        
        const newRepair = {
            id: mockData.repairs.length + 1,
            user_id: parseInt(userId),
            title,
            description,
            location,
            category,
            status: 'pending',
            repairman: '待分配',
            repair_time: null,
            created_at: new Date().toLocaleString('zh-CN')
        };
        
        mockData.repairs.push(newRepair);
        
        res.json({ code: 0, message: '提交成功' });
    } catch (error) {
        console.error('提交报修错误:', error);
        res.status(500).json({ code: 500, message: '提交失败' });
    }
});

// 食堂菜单
router.get('/canteen/menus', (req, res) => {
    try {
        const { canteen, mealType, date } = req.query;
        
        let menus = mockData.canteen_menus;
        
        if (canteen) {
            menus = menus.filter(m => m.canteen_name === canteen);
        }
        if (mealType) {
            menus = menus.filter(m => m.meal_type === mealType);
        }
        if (date) {
            menus = menus.filter(m => m.date === date);
        }
        
        menus.sort((a, b) => a.canteen_name.localeCompare(b.canteen_name));
        
        const result = menus.map(row => ({
            ...row,
            dishes: JSON.parse(row.dishes || '[]')
        }));
        
        res.json({ code: 0, data: result });
    } catch (error) {
        console.error('食堂菜单错误:', error);
        res.status(500).json({ code: 500, message: '获取菜单失败' });
    }
});

// 宿舍信息
router.get('/dorm', (req, res) => {
    try {
        const { userId } = req.query;
        
        let dorms = mockData.dormitories;
        
        if (userId) {
            dorms = dorms.filter(d => d.user_id === parseInt(userId));
        }
        
        res.json({ code: 0, data: dorms });
    } catch (error) {
        console.error('宿舍信息错误:', error);
        res.status(500).json({ code: 500, message: '获取宿舍信息失败' });
    }
});

module.exports = router;