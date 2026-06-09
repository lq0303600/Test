const mysql = require('mysql2/promise');
const config = require('../config/app');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...config.db,
      charset: 'utf8mb4',
      connectionLimit: 10
    });
  }
  return pool;
}

const KnowledgeModel = {
  async createTable() {
    const conn = await getPool().getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          category ENUM('admission', 'academic', 'campus', 'career', 'life', 'other') DEFAULT 'other',
          keywords TEXT,
          views INT DEFAULT 0,
          likes INT DEFAULT 0,
          status ENUM('draft', 'published', 'archived') DEFAULT 'published',
          created_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_category (category),
          INDEX idx_status (status),
          FULLTEXT INDEX ft_search (title, content)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      
      // 插入初始数据
      await conn.query(`
        INSERT IGNORE INTO knowledge_base (id, title, content, category, keywords) VALUES 
        (1, '入学指南', '新生入学需携带身份证、录取通知书、一寸照片8张。报到时间为9月1日-9月3日，地点为大学生活动中心。学费可通过银行卡、支付宝或微信缴纳。', 'admission', '入学,报到,新生,录取,学费'),
        (2, '图书馆开放时间', '图书馆周一至周五开放时间为8:00-22:00，周末为9:00-20:00。寒暑假期间开放时间调整为10:00-18:00。图书馆提供自习室、研讨室和电子阅览室。', 'campus', '图书馆,开放时间,自习'),
        (3, '奖学金申请', '国家奖学金金额为8000元/年，申请条件：成绩排名专业前10%，无违纪记录，有突出的综合素质表现。申请时间为每年10月。', 'academic', '奖学金,国家奖学金,申请'),
        (4, '就业指导中心服务', '就业指导中心位于活动中心3楼，提供简历指导、模拟面试、招聘会信息等服务。开放时间：周一至周五9:00-17:00。电话：010-12345678。', 'career', '就业,指导,简历,招聘'),
        (5, '宿舍管理规定', '宿舍门禁时间为23:00-6:00，禁止使用大功率电器（超过800W），每两周进行卫生检查。晚归需凭学生证登记。', 'life', '宿舍,门禁,用电,卫生'),
        (6, '选课系统使用', '选课系统于每学期开学前两周开放，学生需登录教务系统（jwxt.campus.edu）进行选课。每人每学期最多可选25学分。', 'academic', '选课,学分,教务系统'),
        (7, '食堂分布与营业', '学校共有3个食堂：第一食堂位于教学区，第二食堂位于宿舍区，第三食堂位于体育馆附近。第一食堂营业时间6:30-20:00，第二食堂6:00-21:00。', 'life', '食堂,就餐,餐饮'),
        (8, '校园卡充值与挂失', '校园卡可在食堂充值机、自助服务终端或通过校园APP充值。充值时间7:00-19:00。丢失后需立即在自助终端或学生事务中心挂失。', 'campus', '校园卡,充值,挂失'),
        (9, '转专业申请条件', '转专业申请时间为大一下学期和大二上学期（每年4月和10月）。要求：成绩绩点达到3.0以上，无挂科记录，通过拟转入专业考核。', 'academic', '转专业,绩点,考核'),
        (10, '毕业学分要求', '本科生需修满150学分，其中必修课80学分，选修课40学分，实践课30学分。需通过毕业论文答辩，英语四级，计算机二级。', 'academic', '毕业,学分,论文,四级'),
        (11, '一卡通门禁权限', '校园一卡通可开通图书馆借阅、食堂消费、宿舍门禁、考勤签到等功能。门禁权限可通过自助终端设置。', 'campus', '一卡通,门禁,借阅'),
        (12, '心理咨询中心', '心理咨询中心位于校医院4楼，提供免费心理咨询服务。预约电话：010-12345679。开放时间：周一至周五8:30-17:30。', 'life', '心理,咨询,健康'),
        (13, '实验室预约', '计算机实验室、语言实验室需提前在实验室管理系统预约。预约时间最长为4小时/人/天。违约3次将被限制使用。', 'academic', '实验室,预约,计算机'),
        (14, '体育馆使用', '体育馆开放时间：工作日6:30-21:00，周末8:00-20:00。羽毛球、乒乓球、篮球场地需提前预约。', 'campus', '体育,场馆,预约'),
        (15, '网络与WiFi', '校园WiFi覆盖教学楼、宿舍区和图书馆。账号为学号，密码可在校内自助终端重置。带宽限制：下载20Mbps，上传10Mbps。', 'campus', '网络,WIFI,上网'),
        (16, '学生证补办', '学生证丢失可到学生事务中心补办，工本费20元。补办后需加盖最新注册章方可生效。寒暑假购票优惠每年可用4次。', 'admission', '学生证,补办,优惠'),
        (17, '创新学分获取', '创新学分可通过参加科研项目、学科竞赛、社会实践、论文发表等方式获取。需修满4学分方可毕业。', 'academic', '创新学分,竞赛,科研'),
        (18, '勤工助学岗位', '学校提供图书馆助理、实验室助理、行政助理等勤工助学岗位。时薪15-20元，每月工作时间不超过40小时。', 'career', '勤工俭学,兼职,岗位'),
        (19, '医保与就医', '大学生医保参保费每年100元，看病可到校医院，报销比例70%-90%。转诊需先经校医院开具转诊单。', 'life', '医保,医疗,报销'),
        (20, '快递收发服务', '快递服务中心位于南门旁，营业时间9:00-19:00。顺丰、圆通、中通、韵达等主流快递均可送达。', 'campus', '快递,收发,物流')
      `);
      console.log('知识库表创建成功');
    } finally {
      conn.release();
    }
  },

  async create(data) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO knowledge_base (title, content, category, keywords, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [data.title, data.content, data.category || 'other', data.keywords, data.status || 'published', data.created_by]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  },

  async findById(id) {
    const conn = await getPool().getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM knowledge_base WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      conn.release();
    }
  },

  async findAll(options = {}) {
    const conn = await getPool().getConnection();
    try {
      let sql = 'SELECT * FROM knowledge_base WHERE status = "published"';
      const params = [];
      
      if (options.category) {
        sql += ' AND category = ?';
        params.push(options.category);
      }
      
      if (options.keyword) {
        sql += ' AND (title LIKE ? OR content LIKE ? OR keywords LIKE ?)';
        const kw = `%${options.keyword}%`;
        params.push(kw, kw, kw);
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const offset = (page - 1) * pageSize;
      
      sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
      
      const [rows] = await conn.execute(sql, params);
      
      // 获取总数
      let countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total').replace(` LIMIT ${pageSize} OFFSET ${offset}`, '');
      const [countResult] = await conn.execute(countSql, params.slice(0, options.keyword ? -3 : params.length));
      const total = countResult[0]?.total || 0;
      
      return { list: rows, total };
    } finally {
      conn.release();
    }
  },

  async search(query, limit = 5) {
    const conn = await getPool().getConnection();
    try {
      const sql = `
        SELECT *, 
          (CASE 
            WHEN title LIKE ? THEN 0.8 
            WHEN content LIKE ? THEN 0.6 
            WHEN keywords LIKE ? THEN 0.4 
            ELSE 0.1 
          END) as similarity_score
        FROM knowledge_base 
        WHERE status = 'published' AND (title LIKE ? OR content LIKE ? OR keywords LIKE ?)
        ORDER BY similarity_score DESC
        LIMIT ?
      `;
      const kw = `%${query}%`;
      const [rows] = await conn.execute(sql, [kw, kw, kw, kw, kw, kw, limit]);
      return rows;
    } finally {
      conn.release();
    }
  },

  async update(id, data) {
    const conn = await getPool().getConnection();
    try {
      const fields = [];
      const values = [];
      
      if (data.title) { fields.push('title = ?'); values.push(data.title); }
      if (data.content) { fields.push('content = ?'); values.push(data.content); }
      if (data.category) { fields.push('category = ?'); values.push(data.category); }
      if (data.keywords) { fields.push('keywords = ?'); values.push(data.keywords); }
      if (data.status) { fields.push('status = ?'); values.push(data.status); }
      
      if (fields.length === 0) return false;
      
      values.push(id);
      const [result] = await conn.execute(
        `UPDATE knowledge_base SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  },

  async delete(id) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'DELETE FROM knowledge_base WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  },

  async incrementViews(id) {
    const conn = await getPool().getConnection();
    try {
      await conn.execute('UPDATE knowledge_base SET views = views + 1 WHERE id = ?', [id]);
    } finally {
      conn.release();
    }
  }
};

module.exports = KnowledgeModel;
