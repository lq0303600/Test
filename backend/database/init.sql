-- 校园智能咨询问答平台数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS campus_qa_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campus_qa_platform;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student' COMMENT '用户角色',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 问题表
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '问题ID',
    user_id INT NOT NULL COMMENT '提问用户ID',
    title VARCHAR(200) NOT NULL COMMENT '问题标题',
    content TEXT NOT NULL COMMENT '问题内容',
    category ENUM('admission', 'academic', 'campus', 'career', 'life', 'other') DEFAULT 'other' COMMENT '问题分类',
    status ENUM('pending', 'answered', 'resolved') DEFAULT 'pending' COMMENT '问题状态',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium' COMMENT '优先级',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='问题表';

-- 回答表
CREATE TABLE IF NOT EXISTS answers (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '回答ID',
    question_id INT NOT NULL COMMENT '关联问题ID',
    user_id INT COMMENT '回答用户ID（AI回答时为NULL）',
    content TEXT NOT NULL COMMENT '回答内容',
    source ENUM('knowledge_base', 'ai', 'human') DEFAULT 'ai' COMMENT '回答来源',
    accuracy DECIMAL(3,2) DEFAULT 0.8 COMMENT '回答准确率（AI回答时使用）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_question_id (question_id),
    INDEX idx_source (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='回答表';

-- 知识库表
CREATE TABLE IF NOT EXISTS knowledge_base (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '知识库ID',
    title VARCHAR(200) NOT NULL COMMENT '知识标题',
    content TEXT NOT NULL COMMENT '知识内容',
    category ENUM('admission', 'academic', 'campus', 'career', 'life', 'other') DEFAULT 'other' COMMENT '分类',
    keywords TEXT COMMENT '关键词（逗号分隔）',
    similarity_score DECIMAL(3,2) DEFAULT 0.0 COMMENT '相似度分数（用于检索）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_category (category),
    FULLTEXT INDEX ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识库表';

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '消息ID',
    user_id INT NOT NULL COMMENT '用户ID',
    question_id INT COMMENT '关联问题ID',
    content TEXT NOT NULL COMMENT '消息内容',
    type ENUM('question', 'answer', 'system') DEFAULT 'question' COMMENT '消息类型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_question_id (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- 插入初始知识库数据
INSERT INTO knowledge_base (title, content, category, keywords) VALUES 
('入学指南', '新生入学需携带身份证、录取通知书、一寸照片8张。报到时间为9月1日-9月3日，地点为大学生活动中心。', 'admission', '入学,报到,新生,录取'),
('图书馆开放时间', '图书馆周一至周五开放时间为8:00-22:00，周末为9:00-20:00。寒暑假期间开放时间调整为10:00-18:00。', 'campus', '图书馆,开放时间'),
('奖学金申请', '国家奖学金申请条件：成绩排名专业前10%，无违纪记录，有突出的综合素质表现。申请时间为每年10月。', 'academic', '奖学金,申请,国家奖学金'),
('就业指导中心', '就业指导中心位于大学生活动中心3楼，提供简历指导、模拟面试、招聘会信息等服务。开放时间：周一至周五9:00-17:00。', 'career', '就业,指导,简历'),
('宿舍管理规定', '宿舍门禁时间为23:00-6:00，禁止使用大功率电器，每周二、周五进行卫生检查。', 'life', '宿舍,门禁,卫生'),
('选课系统', '选课系统于每学期开学前两周开放，学生需登录教务系统进行选课。每人每学期最多可选25学分。', 'academic', '选课,学分,教务系统'),
('食堂分布', '学校共有3个食堂：第一食堂位于教学区，第二食堂位于宿舍区，第三食堂位于体育馆附近。', 'life', '食堂,就餐'),
('校园卡充值', '校园卡可在食堂充值机、自助服务终端或通过校园APP进行充值。充值最低金额为10元。', 'campus', '校园卡,充值'),
('转专业政策', '转专业申请时间为大一下学期和大二上学期，要求成绩绩点达到3.0以上，无挂科记录。', 'academic', '转专业,绩点'),
('毕业要求', '本科生需修满150学分，通过毕业论文答辩，英语达到四级水平，计算机达到二级水平。', 'academic', '毕业,学分,论文');
