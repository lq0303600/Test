-- 校园智能咨询问答平台 - 数据库扩展表
-- 数据库: campus_qa_platform

USE campus_qa_platform;

-- 1. 通知公告表
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('academic', 'student_affairs', 'research', 'logistics', 'activity') DEFAULT 'academic',
    author VARCHAR(100) NOT NULL,
    is_top TINYINT(1) DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 课表表
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_name VARCHAR(100) NOT NULL,
    teacher VARCHAR(50) NOT NULL,
    location VARCHAR(50),
    day_of_week INT NOT NULL COMMENT '1-5代表周一至周五',
    start_section INT NOT NULL COMMENT '开始节次 1-10',
    end_section INT NOT NULL COMMENT '结束节次 1-10',
    semester VARCHAR(20) NOT NULL,
    week_range VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 成绩表
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    credits DECIMAL(3,1) NOT NULL,
    score INT,
    grade_point DECIMAL(3,1),
    semester VARCHAR(20) NOT NULL,
    exam_type ENUM('midterm', 'final', ' makeup') DEFAULT 'final',
    rank_total INT,
    rank_class INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 图书表
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100),
    isbn VARCHAR(50),
    publisher VARCHAR(100),
    category VARCHAR(50),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    location VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 借阅记录表
CREATE TABLE IF NOT EXISTS borrow_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 校园卡表
CREATE TABLE IF NOT EXISTS campus_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'lost', 'frozen') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. 消费记录表
CREATE TABLE IF NOT EXISTS card_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    type ENUM('consume', 'recharge', 'refund') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    location VARCHAR(100),
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES campus_cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. 校园活动表
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('competition', 'lecture', 'volunteer', 'club', 'social') DEFAULT 'competition',
    organizer VARCHAR(100),
    location VARCHAR(100),
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    signup_deadline DATETIME,
    max_participants INT,
    current_participants INT DEFAULT 0,
    status ENUM('upcoming', 'ongoing', 'ended', 'cancelled') DEFAULT 'upcoming',
    cover_image VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. 活动报名表
CREATE TABLE IF NOT EXISTS activity_signups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('signed_up', 'confirmed', 'cancelled') DEFAULT 'signed_up',
    signup_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_signup (activity_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. 消息表
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('system', 'academic', 'activity', 'personal') DEFAULT 'system',
    is_read TINYINT(1) DEFAULT 0,
    is_top TINYINT(1) DEFAULT 0,
    sender VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. 失物招领表
CREATE TABLE IF NOT EXISTS lost_found (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('lost', 'found') NOT NULL,
    location VARCHAR(100),
    contact VARCHAR(100),
    status ENUM('open', 'closed') DEFAULT 'open',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. 报修表
CREATE TABLE IF NOT EXISTS repairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    category VARCHAR(50),
    status ENUM('submitted', 'processing', 'completed', 'rejected') DEFAULT 'submitted',
    handler VARCHAR(100),
    handle_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. 食堂菜单表
CREATE TABLE IF NOT EXISTS canteen_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    canteen_name VARCHAR(50) NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
    date DATE NOT NULL,
    dishes TEXT NOT NULL COMMENT 'JSON格式存储菜品列表',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. 宿舍信息表
CREATE TABLE IF NOT EXISTS dormitories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    building VARCHAR(50) NOT NULL,
    room VARCHAR(20) NOT NULL,
    user_id INT,
    bed_number INT,
    electricity_usage DECIMAL(10,2) DEFAULT 0,
    water_usage DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入通知公告数据
INSERT INTO notices (title, content, type, author, is_top, views) VALUES 
('关于2026年春季学期选课通知', '各位同学：\n\n2026年春季学期选课工作将于6月10日正式开始。请同学们提前做好选课规划，登录教务系统（jwxt.campus.edu）进行选课。\n\n选课时间安排：\n- 第一批次：6月10日-12日（高年级优先）\n- 第二批次：6月13日-15日（全体学生）\n\n注意事项：\n1. 每人每学期最多选修25学分\n2. 选修课需达到规定人数才会开课\n3. 请及时查看选课结果\n\n教务处\n2026年6月7日', 'academic', '教务处', 1, 1256),
('第十届全国大学生数学竞赛报名通知', '一、竞赛时间\n2026年7月15日（周三）上午9:00-12:00\\n\n二、参赛对象\n全校本科生，重点面向数学、物理、计算机等专业学生\n\n三、奖项设置\n- 全国一等奖：5名，奖金3000元\n- 全国二等奖：15名，奖金1500元\n- 省级奖项若干\n\n四、报名时间\n即日起至6月20日\n\n五、报名方式\n登录学生事务中心网站报名，或联系数学系办公室（B栋201室）\n\n联系人：张老师 电话：010-12345680', 'academic', '学生处', 1, 892),
('图书馆新增自习室开放通知', '为满足同学们自习需求，图书馆即日起新增3间自习室，具体安排如下：\n\n新增自习室位置：图书馆5楼501、502、503\n\n开放时间：每日8:00-22:00\n\n座位数量：共180个座位\n\n预约方式：通过图书馆预约系统提前预约，或现场取号\n\n注意事项：\n1. 请保持安静\n2. 禁止占座\n3. 爱护公共设施\n\n图书馆\n2026年6月1日', 'logistics', '图书馆', 0, 654),
('校园歌手大赛报名通知', '第十届校园歌手大赛正式开始报名！\n\n一、参赛对象\n全校在校学生\n\n二、比赛时间\n初赛：6月20日\n复赛：6月25日\n决赛：7月1日\n\n三、奖项设置\n冠军：1名，奖金5000元\n亚军：2名，奖金3000元\n季军：3名，奖金1000元\n最佳人气奖：1名\n\n四、报名方式\n1. 线上报名：登录校园APP\n2. 线下报名：大学生活动中心101室\n\n报名截止时间：6月15日\n\n共青团委员会\n2026年6月5日', 'activity', '团委', 0, 1105),
('关于暑假期间食堂营业安排通知', '各位师生：\n\n暑假期间食堂营业安排如下：\n\n第一食堂：7月1日-8月20日关闭\n第二食堂：正常营业，营业时间调整为7:00-19:00\n第三食堂：周末关闭，工作日正常开放\n\n教师餐厅：7月1日-8月15日关闭\n\n8月21日起各食堂恢复正常营业。\n\n后勤管理处\n2026年6月10日', 'logistics', '后勤处', 0, 432),
('2026年度科研项目申报通知', '各位老师：\n\n2026年度科研项目申报工作现已开始，具体安排如下：\n\n一、申报项目类型\n1. 国家自然科学基金\n2. 教育部人文社科项目\n3. 省级科研项目\n4. 校级青年基金\n\n二、申报时间\n截止日期：2026年7月15日\n\n三、申报方式\n登录科研管理系统在线申报\n\n四、注意事项\n1. 同一申请人同年只能申请一项\n2. 有在研项目未结题者不得申报\n3. 请认真阅读申报指南\n\n科研处\n2026年6月8日', 'research', '科研处', 0, 287);

-- 插入课表数据
INSERT INTO schedules (user_id, course_name, teacher, location, day_of_week, start_section, end_section, semester, week_range) VALUES 
(1, '高等数学A', '王教授', 'A101', 1, 1, 2, '2026春季', '1-16周'),
(1, '大学英语', '李老师', 'B201', 1, 3, 4, '2026春季', '1-16周'),
(1, '线性代数', '张教授', 'A102', 2, 1, 2, '2026春季', '1-16周'),
(1, '大学物理', '刘老师', 'C301', 2, 3, 4, '2026春季', '1-16周'),
(1, '计算机基础', '陈老师', 'D401', 3, 2, 3, '2026春季', '1-16周'),
(1, '体育', '体育老师', '体育馆', 5, 5, 6, '2026春季', '1-16周'),
(1, '马克思主义', '马老师', 'E501', 3, 5, 6, '2026春季', '1-16周'),
(1, '高等数学A', '王教授', 'A101', 4, 1, 2, '2026春季', '1-16周'),
(1, '线性代数', '张教授', 'A102', 5, 1, 2, '2026春季', '1-16周'),
(1, '大学英语', '李老师', 'B201', 2, 5, 6, '2026春季', '1-16周');

-- 插入成绩数据
INSERT INTO grades (user_id, course_name, credits, score, grade_point, semester, rank_total, rank_class) VALUES 
(1, '高等数学A', 4.0, 92, 4.0, '2026春季', 15, 3),
(1, '大学英语', 3.0, 88, 3.8, '2026春季', 28, 8),
(1, '线性代数', 3.0, 95, 4.0, '2026春季', 8, 2),
(1, '大学物理', 4.0, 85, 3.7, '2026春季', 35, 10),
(1, '计算机基础', 3.0, 91, 4.0, '2026春季', 12, 4),
(1, '体育', 1.0, 94, 4.0, '2026春季', 5, 1),
(1, '马克思主义', 2.0, 90, 4.0, '2026春季', 10, 2);

-- 插入图书数据
INSERT INTO books (title, author, isbn, publisher, category, total_copies, available_copies, location) VALUES 
('数据结构与算法', '严蔚敏', '978-7-302-01488-6', '清华大学出版社', '计算机', 5, 3, 'A区3楼A301'),
('计算机网络', '谢希仁', '978-7-121-02687-6', '电子工业出版社', '计算机', 4, 2, 'A区3楼A302'),
('人工智能导论', '李德毅', '978-7-302-04812-6', '清华大学出版社', '计算机', 3, 0, 'A区3楼A303'),
('高等数学', '同济大学', '978-7-04-039661-3', '高等教育出版社', '数学', 8, 5, 'B区2楼B201'),
('线性代数', '同济大学', '978-7-04-039660-6', '高等教育出版社', '数学', 6, 4, 'B区2楼B202'),
('大学物理', '程守洙', '978-7-302-02110-7', '清华大学出版社', '物理', 5, 3, 'C区1楼C101'),
('数据库系统概论', '王珊', '978-7-302-02369-9', '高等教育出版社', '计算机', 4, 3, 'A区3楼A304'),
('操作系统', '汤小丹', '978-7-560-33707-3', '西安电子科技大学出版社', '计算机', 3, 2, 'A区3楼A305'),
('软件工程', '张海藩', '978-7-302-05123-2', '清华大学出版社', '计算机', 3, 3, 'A区3楼A306'),
('离散数学', '屈婉玲', '978-7-302-04802-7', '清华大学出版社', '数学', 4, 4, 'B区2楼B203');

-- 插入借阅记录
INSERT INTO borrow_records (user_id, book_id, borrow_date, due_date, return_date, status) VALUES 
(1, 1, '2026-06-01', '2026-06-15', NULL, 'borrowed'),
(1, 2, '2026-05-28', '2026-06-11', NULL, 'overdue'),
(1, 10, '2026-05-20', '2026-06-03', '2026-06-02', 'returned');

-- 插入校园卡数据
INSERT INTO campus_cards (user_id, card_number, balance) VALUES 
(1, '202601011234', 328.50),
(2, '202602022345', 156.80);

-- 插入消费记录
INSERT INTO card_transactions (card_id, type, amount, location, description) VALUES 
(1, 'consume', 15.00, '第二食堂', '午餐'),
(1, 'consume', 28.00, '图书馆咖啡厅', '咖啡'),
(1, 'consume', 8.50, '第一食堂', '早餐'),
(1, 'consume', 12.00, '校园超市', '零食'),
(1, 'recharge', 100.00, '自助终端', '充值'),
(2, 'consume', 20.00, '第二食堂', '晚餐'),
(2, 'consume', 5.00, '菜鸟驿站', '快递费');

-- 插入活动数据
INSERT INTO activities (title, content, type, organizer, location, start_time, end_time, signup_deadline, max_participants, current_participants, status) VALUES 
('第十届全国大学生数学竞赛', '全国大学生数学竞赛是由中国数学会主办的全国性赛事。\n\n参赛对象：本科生\n参赛年级：不限\n\n竞赛内容：\n- 数学专业组：数学分析、高等代数、解析几何\n- 非数学专业组：高等数学、线性代数\n\n奖项设置：全国一、二、三等奖', 'competition', '数学系', '教学楼A101', '2026-07-15 09:00:00', '2026-07-15 12:00:00', '2026-06-20 23:59:59', 200, 45, 'upcoming'),
('校园歌手大赛', '第十届校园歌手大赛，等你来唱！\n\n比赛形式：个人或组合\n歌曲类型：不限，青春积极向上\n\n奖项：\n- 冠军5000元\n- 亚军3000元\n- 季军1000元\n- 最佳人气奖', 'competition', '团委', '大学生活动中心', '2026-06-20 18:00:00', '2026-06-20 22:00:00', '2026-06-15 23:59:59', 100, 67, 'upcoming'),
('人工智能专题讲座', '主题：AI在教育领域的应用与展望\n\n主讲人：陈教授（清华大学）\n\n内容：\n1. AI教育的发展现状\n2. 智能教学系统\n3. 教育大数据分析\n4. 未来展望\n\n报名对象：全校师生', 'lecture', '计算机学院', '图书馆报告厅', '2026-06-18 14:00:00', '2026-06-18 16:00:00', '2026-06-16 23:59:59', 300, 156, 'upcoming'),
('暑期支教志愿者招募', '2026年暑期“三下乡”社会实践活动志愿者招募\n\n支教地点：西部乡村小学\n支教时间：7月10日-8月5日\n\n服务内容：\n- 语文、数学、英语教学\n- 兴趣课程\n- 调研活动\n\n报名条件：\n1. 在校本科生\n2. 有责任心、耐心\n3. 有志愿服务经历优先', 'volunteer', '学生处', '待定', '2026-07-10 08:00:00', '2026-08-05 18:00:00', '2026-06-25 23:59:59', 50, 23, 'upcoming'),
('书法社团招新', '墨香书法社欢迎你的加入！\n\n我们提供：\n- 专业的书法指导\n- 丰富的交流活动\n- 参展参赛机会\n\n活动时间：每周三下午4-6点\n活动地点：艺术楼301\n\n报名方式：现场报名或联系社长', 'club', '书法社团', '艺术楼301', '2026-06-10 16:00:00', '2026-06-10 18:00:00', '2026-06-09 23:59:59', 30, 18, 'upcoming');

-- 插入消息数据
INSERT INTO messages (user_id, title, content, type, is_read, is_top, sender) VALUES 
(1, '选课系统即将开放', '2026年春季学期选课将于6月10日8:00开放，请同学们提前做好选课规划，登录教务系统进行选课。', 'academic', 0, 1, '教务处'),
(1, '图书馆自习室开放时间调整', '自6月1日起，图书馆自习室开放时间调整为8:00-22:00，请同学们合理安排学习时间。', 'system', 0, 0, '图书馆'),
(1, '校园歌手大赛报名通知', '第十届校园歌手大赛开始报名，奖金丰厚，欢迎同学们积极参与！报名截止日期：6月15日。', 'activity', 0, 0, '团委'),
(1, '图书馆借书逾期提醒', '您借阅的《计算机网络》已逾期，请尽快到图书馆办理续借或归还。', 'system', 1, 0, '图书馆');

-- 插入失物招领
INSERT INTO lost_found (title, description, type, location, contact, user_id, status) VALUES 
('丢失黑色双肩包', '6月5日在图书馆三楼丢失黑色双肩包一个，内有笔记本电脑和课本', 'lost', '图书馆三楼', '张三同学', 1, 'open'),
('拾到校园卡一张', '在食堂门口拾到校园卡一张，请失主带身份证领取', 'found', '第一食堂门口', '李四同学', 2, 'open');

-- 插入报修
INSERT INTO repairs (user_id, title, description, location, category, status, handler) VALUES 
(1, '宿舍空调不制冷', '402房间空调无法制冷，已报修多次仍未解决', '4号楼402', '电器', 'processing', '后勤维修'),
(1, '教室投影仪故障', 'A101教室投影仪无法显示，请尽快维修', '教学楼A101', '多媒体', 'submitted', NULL);

-- 插入食堂菜单
INSERT INTO canteen_menus (canteen_name, meal_type, date, dishes) VALUES 
('第一食堂', 'breakfast', CURDATE(), '["肉包 2元", "鸡蛋 1.5元", "豆浆 2元", "油条 1元", "小米粥 2元"]'),
('第一食堂', 'lunch', CURDATE(), '["红烧肉 12元", "糖醋排骨 15元", "清炒时蔬 6元", "西红柿炒蛋 8元", "米饭 1元"]'),
('第一食堂', 'dinner', CURDATE(), '["宫保鸡丁 12元", "鱼香肉丝 10元", "蒜蓉菜心 6元", "紫菜蛋汤 3元"]'),
('第二食堂', 'breakfast', CURDATE(), '["煎饼果子 5元", "豆腐脑 3元", "油饼 1.5元", "八宝粥 2元"]'),
('第二食堂', 'lunch', CURDATE(), '["黄焖鸡 14元", "酸菜鱼 18元", "麻婆豆腐 8元", "蚝油生菜 6元", "米饭 1元"]');

-- 插入宿舍信息
INSERT INTO dormitories (building, room, user_id, bed_number, electricity_usage, water_usage) VALUES 
('4号楼', '402', 1, 1, 125.5, 8.2),
('4号楼', '402', 2, 2, 125.5, 8.2),
('4号楼', '402', 3, 3, 125.5, 8.2),
('4号楼', '402', 4, 4, 125.5, 8.2);

SELECT '数据库扩展表创建成功!' AS result;
