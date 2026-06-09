/**
 * 校园服务API路由
 * 处理通知、课表、成绩、图书、活动等请求
 */

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const config = require('../config/app');

// 创建数据库连接池
const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10
});

// 通知公告列表
router.get('/notices', async (req, res) => {
    try {
        const { type, page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;
        const pageSizeInt = parseInt(pageSize);
        const offsetInt = parseInt(offset);
        const pageInt = parseInt(page);
        
        let sql = 'SELECT * FROM notices WHERE status = "published"';
        let countSql = 'SELECT COUNT(*) as total FROM notices WHERE status = "published"';
        const params = [];
        
        if (type) {
            sql += ' AND type = ?';
            countSql += ' AND type = ?';
            params.push(type);
        }
        
        sql += ' ORDER BY is_top DESC, created_at DESC LIMIT ' + pageSizeInt + ' OFFSET ' + offsetInt;
        
        const [rows] = await pool.query(sql, params);
        const [countResult] = await pool.query(countSql, params);
        const total = countResult[0].total;
        
        res.json({
            code: 0,
            data: { list: rows, total, page: pageInt, pageSize: pageSizeInt }
        });
    } catch (error) {
        console.error('通知列表错误:', error);
        res.status(500).json({ code: 500, message: '获取通知列表失败' });
    }
});

// 通知详情
router.get('/notices/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM notices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ code: 404, message: '通知不存在' });
        }
        
        // 增加浏览次数
        await pool.execute('UPDATE notices SET views = views + 1 WHERE id = ?', [req.params.id]);
        
        res.json({ code: 0, data: rows[0] });
    } catch (error) {
        console.error('通知详情错误:', error);
        res.status(500).json({ code: 500, message: '获取通知详情失败' });
    }
});

// 课表查询
router.get('/schedules', async (req, res) => {
    try {
        const { userId, semester = '2026春季' } = req.query;
        
        let sql = 'SELECT * FROM schedules WHERE semester = ?';
        const params = [semester];
        
        if (userId) {
            sql += ' AND user_id = ?';
            params.push(userId);
        }
        
        sql += ' ORDER BY day_of_week, start_section';
        
        const [rows] = await pool.execute(sql, params);
        res.json({ code: 0, data: rows });
    } catch (error) {
        console.error('课表查询错误:', error);
        res.status(500).json({ code: 500, message: '获取课表失败' });
    }
});

// 成绩查询
router.get('/grades', async (req, res) => {
    try {
        const { userId, semester } = req.query;
        
        let sql = 'SELECT * FROM grades WHERE 1=1';
        const params = [];
        
        if (userId) {
            sql += ' AND user_id = ?';
            params.push(userId);
        }
        if (semester) {
            sql += ' AND semester = ?';
            params.push(semester);
        }
        
        sql += ' ORDER BY semester DESC, course_name';
        
        const [rows] = await pool.execute(sql, params);
        
        // 计算平均绩点
        let avgGpa = 0;
        if (rows.length > 0) {
            const totalPoints = rows.reduce((sum, r) => sum + (parseFloat(r.grade_point) || 0), 0);
            avgGpa = (totalPoints / rows.length).toFixed(2);
        }
        
        res.json({ code: 0, data: { list: rows, avgGpa } });
    } catch (error) {
        console.error('成绩查询错误:', error);
        res.status(500).json({ code: 500, message: '获取成绩失败' });
    }
});

// 图书列表
router.get('/books', async (req, res) => {
    try {
        const { keyword, category, page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;
        
        let sql = 'SELECT * FROM books WHERE 1=1';
        let countSql = 'SELECT COUNT(*) as total FROM books WHERE 1=1';
        const params = [];
        
        if (keyword) {
            sql += ' AND (title LIKE ? OR author LIKE ?)';
            countSql += ' AND (title LIKE ? OR author LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        if (category) {
            sql += ' AND category = ?';
            countSql += ' AND category = ?';
            params.push(category);
        }
        
        const pageSizeInt = parseInt(pageSize);
        const offsetInt = parseInt(offset);
        
        sql += ' LIMIT ' + pageSizeInt + ' OFFSET ' + offsetInt;
        
        const [rows] = await pool.query(sql, params);
        const [countResult] = await pool.query(countSql, params);
        const total = countResult[0].total;
        
        res.json({ code: 0, data: { list: rows, total } });
    } catch (error) {
        console.error('图书列表错误:', error);
        res.status(500).json({ code: 500, message: '获取图书列表失败' });
    }
});

// 借阅记录
router.get('/borrow-records', async (req, res) => {
    try {
        const { userId } = req.query;
        
        let sql = `SELECT br.*, b.title, b.author 
                   FROM borrow_records br 
                   LEFT JOIN books b ON br.book_id = b.id 
                   WHERE 1=1`;
        const params = [];
        
        if (userId) {
            sql += ' AND br.user_id = ?';
            params.push(userId);
        }
        
        sql += ' ORDER BY br.borrow_date DESC';
        
        const [rows] = await pool.execute(sql, params);
        res.json({ code: 0, data: rows });
    } catch (error) {
        console.error('借阅记录错误:', error);
        res.status(500).json({ code: 500, message: '获取借阅记录失败' });
    }
});

// 校园卡信息
router.get('/campus-card/:userId', async (req, res) => {
    try {
        const [cards] = await pool.execute(
            'SELECT * FROM campus_cards WHERE user_id = ?', 
            [req.params.userId]
        );
        
        if (cards.length === 0) {
            return res.status(404).json({ code: 404, message: '校园卡不存在' });
        }
        
        const card = cards[0];
        
        // 获取消费记录
        const [transactions] = await pool.execute(
            'SELECT * FROM card_transactions WHERE card_id = ? ORDER BY created_at DESC LIMIT 10',
            [card.id]
        );
        
        res.json({ code: 0, data: { card, transactions } });
    } catch (error) {
        console.error('校园卡查询错误:', error);
        res.status(500).json({ code: 500, message: '获取校园卡信息失败' });
    }
});

// 校园卡充值
router.post('/campus-card/recharge', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        
        const [cards] = await pool.execute(
            'SELECT * FROM campus_cards WHERE user_id = ?',
            [userId]
        );
        
        if (cards.length === 0) {
            return res.status(404).json({ code: 404, message: '校园卡不存在' });
        }
        
        const card = cards[0];
        
        // 更新余额
        await pool.execute(
            'UPDATE campus_cards SET balance = balance + ? WHERE id = ?',
            [amount, card.id]
        );
        
        // 添加充值记录
        await pool.execute(
            'INSERT INTO card_transactions (card_id, type, amount, description) VALUES (?, ?, ?, ?)',
            [card.id, 'recharge', amount, '用户充值']
        );
        
        res.json({ code: 0, message: '充值成功' });
    } catch (error) {
        console.error('校园卡充值错误:', error);
        res.status(500).json({ code: 500, message: '充值失败' });
    }
});

// 活动列表
router.get('/activities', async (req, res) => {
    try {
        const { type, status = 'upcoming', page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;
        
        let sql = 'SELECT * FROM activities WHERE 1=1';
        let countSql = 'SELECT COUNT(*) as total FROM activities WHERE 1=1';
        const params = [];
        
        if (type) {
            sql += ' AND type = ?';
            countSql += ' AND type = ?';
            params.push(type);
        }
        if (status) {
            sql += ' AND status = ?';
            countSql += ' AND status = ?';
            params.push(status);
        }
        
        const pageSizeInt = parseInt(pageSize);
        const offsetInt = parseInt(offset);
        
        sql += ' ORDER BY start_time ASC LIMIT ' + pageSizeInt + ' OFFSET ' + offsetInt;
        
        const [rows] = await pool.query(sql, params);
        const [countResult] = await pool.query(countSql, params);
        const total = countResult[0].total;
        
        res.json({ code: 0, data: { list: rows, total } });
    } catch (error) {
        console.error('活动列表错误:', error);
        res.status(500).json({ code: 500, message: '获取活动列表失败' });
    }
});

// 活动报名
router.post('/activities/signup', async (req, res) => {
    try {
        const { activityId, userId } = req.body;
        
        // 检查是否已报名
        const [existing] = await pool.execute(
            'SELECT * FROM activity_signups WHERE activity_id = ? AND user_id = ?',
            [activityId, userId]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ code: 400, message: '您已报名此活动' });
        }
        
        // 添加报名
        await pool.execute(
            'INSERT INTO activity_signups (activity_id, user_id) VALUES (?, ?)',
            [activityId, userId]
        );
        
        // 更新活动人数
        await pool.execute(
            'UPDATE activities SET current_participants = current_participants + 1 WHERE id = ?',
            [activityId]
        );
        
        res.json({ code: 0, message: '报名成功' });
    } catch (error) {
        console.error('活动报名错误:', error);
        res.status(500).json({ code: 500, message: '报名失败' });
    }
});

// 消息列表
router.get('/messages', async (req, res) => {
    try {
        const { userId, type, isRead } = req.query;
        
        let sql = 'SELECT * FROM messages WHERE 1=1';
        const params = [];
        
        if (userId) {
            sql += ' AND user_id = ?';
            params.push(userId);
        }
        if (type) {
            sql += ' AND type = ?';
            params.push(type);
        }
        if (isRead !== undefined) {
            sql += ' AND is_read = ?';
            params.push(isRead === 'true' ? 1 : 0);
        }
        
        sql += ' ORDER BY is_top DESC, created_at DESC';
        
        const [rows] = await pool.execute(sql, params);
        
        // 获取未读数
        const [unreadResult] = await pool.execute(
            'SELECT COUNT(*) as unread FROM messages WHERE user_id = ? AND is_read = 0',
            [userId]
        );
        
        res.json({ 
            code: 0, 
            data: { 
                list: rows, 
                unreadCount: unreadResult[0].unread 
            } 
        });
    } catch (error) {
        console.error('消息列表错误:', error);
        res.status(500).json({ code: 500, message: '获取消息列表失败' });
    }
});

// 标记消息已读
router.post('/messages/read', async (req, res) => {
    try {
        const { messageIds } = req.body;
        
        if (messageIds && messageIds.length > 0) {
            const placeholders = messageIds.map(() => '?').join(',');
            await pool.execute(
                `UPDATE messages SET is_read = 1 WHERE id IN (${placeholders})`,
                messageIds
            );
        }
        
        res.json({ code: 0, message: '已标记为已读' });
    } catch (error) {
        console.error('标记已读错误:', error);
        res.status(500).json({ code: 500, message: '操作失败' });
    }
});

// 失物招领列表
router.get('/lost-found', async (req, res) => {
    try {
        const { type, status = 'open' } = req.query;
        
        let sql = 'SELECT * FROM lost_found WHERE status = ?';
        const params = [status];
        
        if (type) {
            sql += ' AND type = ?';
            params.push(type);
        }
        
        sql += ' ORDER BY created_at DESC';
        
        const [rows] = await pool.execute(sql, params);
        res.json({ code: 0, data: rows });
    } catch (error) {
        console.error('失物招领错误:', error);
        res.status(500).json({ code: 500, message: '获取列表失败' });
    }
});

// 发布失物招领
router.post('/lost-found', async (req, res) => {
    try {
        const { title, description, type, location, contact, userId } = req.body;
        
        await pool.execute(
            'INSERT INTO lost_found (title, description, type, location, contact, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, type, location, contact, userId]
        );
        
        res.json({ code: 0, message: '发布成功' });
    } catch (error) {
        console.error('发布失物招领错误:', error);
        res.status(500).json({ code: 500, message: '发布失败' });
    }
});

// 报修列表
router.get('/repairs', async (req, res) => {
    try {
        const { userId, status } = req.query;
        
        let sql = 'SELECT * FROM repairs WHERE 1=1';
        const params = [];
        
        if (userId) {
            sql += ' AND user_id = ?';
            params.push(userId);
        }
        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }
        
        sql += ' ORDER BY created_at DESC';
        
        const [rows] = await pool.execute(sql, params);
        res.json({ code: 0, data: rows });
    } catch (error) {
        console.error('报修列表错误:', error);
        res.status(500).json({ code: 500, message: '获取列表失败' });
    }
});

// 提交报修
router.post('/repairs', async (req, res) => {
    try {
        const { userId, title, description, location, category } = req.body;
        
        await pool.execute(
            'INSERT INTO repairs (user_id, title, description, location, category) VALUES (?, ?, ?, ?, ?)',
            [userId, title, description, location, category]
        );
        
        res.json({ code: 0, message: '提交成功' });
    } catch (error) {
        console.error('提交报修错误:', error);
        res.status(500).json({ code: 500, message: '提交失败' });
    }
});

// 食堂菜单
router.get('/canteen/menus', async (req, res) => {
    try {
        const { canteen, mealType, date } = req.query;
        
        let sql = 'SELECT * FROM canteen_menus WHERE 1=1';
        const params = [];
        
        if (canteen) {
            sql += ' AND canteen_name = ?';
            params.push(canteen);
        }
        if (mealType) {
            sql += ' AND meal_type = ?';
            params.push(mealType);
        }
        if (date) {
            sql += ' AND date = ?';
            params.push(date);
        } else {
            sql += ' AND date = CURDATE()';
        }
        
        sql += ' ORDER BY canteen_name, meal_type';
        
        const [rows] = await pool.execute(sql, params);
        
        // 解析菜品JSON
        const menus = rows.map(row => ({
            ...row,
            dishes: JSON.parse(row.dishes || '[]')
        }));
        
        res.json({ code: 0, data: menus });
    } catch (error) {
        console.error('食堂菜单错误:', error);
        res.status(500).json({ code: 500, message: '获取菜单失败' });
    }
});

// 宿舍信息
router.get('/dorm', async (req, res) => {
    try {
        const { userId } = req.query;
        
        let sql = 'SELECT * FROM dormitories WHERE 1=1';
        const params = [];
        
        if (userId) {
            sql += ' AND user_id = ?';
            params.push(userId);
        }
        
        const [rows] = await pool.execute(sql, params);
        res.json({ code: 0, data: rows });
    } catch (error) {
        console.error('宿舍信息错误:', error);
        res.status(500).json({ code: 500, message: '获取宿舍信息失败' });
    }
});

module.exports = router;
