/**
 * 知识库模型 - 内存存储版本（无需MySQL）
 */
const knowledgeBase = [
  { id: 1, title: '入学指南', content: '新生入学需携带身份证、录取通知书、一寸照片8张。报到时间为9月1日-9月3日，地点为大学生活动中心。学费可通过银行卡、支付宝或微信缴纳。', category: 'admission', keywords: '入学,报到,新生,录取,学费', views: 128, likes: 15, status: 'published', created_by: 1, created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
  { id: 2, title: '图书馆开放时间', content: '图书馆周一至周五开放时间为8:00-22:00，周末为9:00-20:00。寒暑假期间开放时间调整为10:00-18:00。图书馆提供自习室、研讨室和电子阅览室。', category: 'campus', keywords: '图书馆,开放时间,自习', views: 256, likes: 32, status: 'published', created_by: 1, created_at: '2024-01-02 00:00:00', updated_at: '2024-01-02 00:00:00' },
  { id: 3, title: '奖学金申请', content: '国家奖学金金额为8000元/年，申请条件：成绩排名专业前10%，无违纪记录，有突出的综合素质表现。申请时间为每年10月。', category: 'academic', keywords: '奖学金,国家奖学金,申请', views: 189, likes: 28, status: 'published', created_by: 2, created_at: '2024-01-03 00:00:00', updated_at: '2024-01-03 00:00:00' },
  { id: 4, title: '就业指导中心服务', content: '就业指导中心位于活动中心3楼，提供简历指导、模拟面试、招聘会信息等服务。开放时间：周一至周五9:00-17:00。电话：010-12345678。', category: 'career', keywords: '就业,指导,简历,招聘', views: 145, likes: 19, status: 'published', created_by: 2, created_at: '2024-01-04 00:00:00', updated_at: '2024-01-04 00:00:00' },
  { id: 5, title: '宿舍管理规定', content: '宿舍门禁时间为23:00-6:00，禁止使用大功率电器（超过800W），每两周进行卫生检查。晚归需凭学生证登记。', category: 'life', keywords: '宿舍,门禁,用电,卫生', views: 312, likes: 45, status: 'published', created_by: 1, created_at: '2024-01-05 00:00:00', updated_at: '2024-01-05 00:00:00' },
  { id: 6, title: '选课系统使用', content: '选课系统于每学期开学前两周开放，学生需登录教务系统（jwxt.campus.edu）进行选课。每人每学期最多可选25学分。', category: 'academic', keywords: '选课,学分,教务系统', views: 267, likes: 38, status: 'published', created_by: 2, created_at: '2024-01-06 00:00:00', updated_at: '2024-01-06 00:00:00' },
  { id: 7, title: '食堂分布与营业', content: '学校共有3个食堂：第一食堂位于教学区，第二食堂位于宿舍区，第三食堂位于体育馆附近。第一食堂营业时间6:30-20:00，第二食堂6:00-21:00。', category: 'life', keywords: '食堂,就餐,餐饮', views: 198, likes: 24, status: 'published', created_by: 1, created_at: '2024-01-07 00:00:00', updated_at: '2024-01-07 00:00:00' },
  { id: 8, title: '校园卡充值与挂失', content: '校园卡可在食堂充值机、自助服务终端或通过校园APP充值。充值时间7:00-19:00。丢失后需立即在自助终端或学生事务中心挂失。', category: 'campus', keywords: '校园卡,充值,挂失', views: 345, likes: 52, status: 'published', created_by: 1, created_at: '2024-01-08 00:00:00', updated_at: '2024-01-08 00:00:00' },
  { id: 9, title: '转专业申请条件', content: '转专业申请时间为大一下学期和大二上学期（每年4月和10月）。要求：成绩绩点达到3.0以上，无挂科记录，通过拟转入专业考核。', category: 'academic', keywords: '转专业,绩点,考核', views: 178, likes: 22, status: 'published', created_by: 2, created_at: '2024-01-09 00:00:00', updated_at: '2024-01-09 00:00:00' },
  { id: 10, title: '毕业学分要求', content: '本科生需修满150学分，其中必修课80学分，选修课40学分，实践课30学分。需通过毕业论文答辩，英语四级，计算机二级。', category: 'academic', keywords: '毕业,学分,论文,四级', views: 423, likes: 67, status: 'published', created_by: 2, created_at: '2024-01-10 00:00:00', updated_at: '2024-01-10 00:00:00' },
  { id: 11, title: '一卡通门禁权限', content: '校园一卡通可开通图书馆借阅、食堂消费、宿舍门禁、考勤签到等功能。门禁权限可通过自助终端设置。', category: 'campus', keywords: '一卡通,门禁,借阅', views: 289, likes: 41, status: 'published', created_by: 1, created_at: '2024-01-11 00:00:00', updated_at: '2024-01-11 00:00:00' },
  { id: 12, title: '心理咨询中心', content: '心理咨询中心位于校医院4楼，提供免费心理咨询服务。预约电话：010-12345679。开放时间：周一至周五8:30-17:30。', category: 'life', keywords: '心理,咨询,健康', views: 134, likes: 17, status: 'published', created_by: 1, created_at: '2024-01-12 00:00:00', updated_at: '2024-01-12 00:00:00' },
  { id: 13, title: '实验室预约', content: '计算机实验室、语言实验室需提前在实验室管理系统预约。预约时间最长为4小时/人/天。违约3次将被限制使用。', category: 'academic', keywords: '实验室,预约,计算机', views: 98, likes: 12, status: 'published', created_by: 2, created_at: '2024-01-13 00:00:00', updated_at: '2024-01-13 00:00:00' },
  { id: 14, title: '体育馆使用', content: '体育馆开放时间：工作日6:30-21:00，周末8:00-20:00。羽毛球、乒乓球、篮球场地需提前预约。', category: 'campus', keywords: '体育,场馆,预约', views: 167, likes: 25, status: 'published', created_by: 1, created_at: '2024-01-14 00:00:00', updated_at: '2024-01-14 00:00:00' },
  { id: 15, title: '网络与WiFi', content: '校园WiFi覆盖教学楼、宿舍区和图书馆。账号为学号，密码可在校内自助终端重置。带宽限制：下载20Mbps，上传10Mbps。', category: 'campus', keywords: '网络,WIFI,上网', views: 234, likes: 33, status: 'published', created_by: 1, created_at: '2024-01-15 00:00:00', updated_at: '2024-01-15 00:00:00' },
  { id: 16, title: '学生证补办', content: '学生证丢失可到学生事务中心补办，工本费20元。补办后需加盖最新注册章方可生效。寒暑假购票优惠每年可用4次。', category: 'admission', keywords: '学生证,补办,优惠', views: 145, likes: 18, status: 'published', created_by: 1, created_at: '2024-01-16 00:00:00', updated_at: '2024-01-16 00:00:00' },
  { id: 17, title: '创新学分获取', content: '创新学分可通过参加科研项目、学科竞赛、社会实践、论文发表等方式获取。需修满4学分方可毕业。', category: 'academic', keywords: '创新学分,竞赛,科研', views: 187, likes: 26, status: 'published', created_by: 2, created_at: '2024-01-17 00:00:00', updated_at: '2024-01-17 00:00:00' },
  { id: 18, title: '勤工助学岗位', content: '学校提供图书馆助理、实验室助理、行政助理等勤工助学岗位。时薪15-20元，每月工作时间不超过40小时。', category: 'career', keywords: '勤工俭学,兼职,岗位', views: 212, likes: 31, status: 'published', created_by: 2, created_at: '2024-01-18 00:00:00', updated_at: '2024-01-18 00:00:00' },
  { id: 19, title: '医保与就医', content: '大学生医保参保费每年100元，看病可到校医院，报销比例70%-90%。转诊需先经校医院开具转诊单。', category: 'life', keywords: '医保,医疗,报销', views: 256, likes: 38, status: 'published', created_by: 1, created_at: '2024-01-19 00:00:00', updated_at: '2024-01-19 00:00:00' },
  { id: 20, title: '快递收发服务', content: '快递服务中心位于南门旁，营业时间9:00-19:00。顺丰、圆通、中通、韵达等主流快递均可送达。', category: 'campus', keywords: '快递,收发,物流', views: 178, likes: 24, status: 'published', created_by: 1, created_at: '2024-01-20 00:00:00', updated_at: '2024-01-20 00:00:00' }
];

const KnowledgeModel = {
  async createTable() {
    return Promise.resolve();
  },

  async create(data) {
    return new Promise((resolve) => {
      const newItem = {
        id: knowledgeBase.length + 1,
        title: data.title,
        content: data.content,
        category: data.category || 'other',
        keywords: data.keywords || '',
        views: 0,
        likes: 0,
        status: data.status || 'published',
        created_by: data.created_by || 1,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      knowledgeBase.push(newItem);
      resolve(newItem.id);
    });
  },

  async findById(id) {
    return new Promise((resolve) => {
      const item = knowledgeBase.find(k => k.id === parseInt(id));
      resolve(item || null);
    });
  },

  async findAll(options = {}) {
    return new Promise((resolve) => {
      let filtered = knowledgeBase.filter(k => k.status === 'published');
      
      if (options.category) {
        filtered = filtered.filter(k => k.category === options.category);
      }
      
      if (options.keyword) {
        const kw = options.keyword.toLowerCase();
        filtered = filtered.filter(k => 
          k.title.toLowerCase().includes(kw) || 
          k.content.toLowerCase().includes(kw) || 
          k.keywords.toLowerCase().includes(kw)
        );
      }
      
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const offset = (page - 1) * pageSize;
      const paginated = filtered.slice(offset, offset + pageSize);
      
      resolve({ list: paginated, total: filtered.length });
    });
  },

  async search(query, limit = 5) {
    return new Promise((resolve) => {
      const kw = query.toLowerCase();
      const results = knowledgeBase
        .filter(k => k.status === 'published')
        .filter(k => 
          k.title.toLowerCase().includes(kw) || 
          k.content.toLowerCase().includes(kw) || 
          k.keywords.toLowerCase().includes(kw)
        )
        .map(k => ({
          ...k,
          similarity_score: k.title.toLowerCase().includes(kw) ? 0.8 : 
                            k.content.toLowerCase().includes(kw) ? 0.6 : 0.4
        }))
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, limit);
      
      resolve(results);
    });
  },

  async update(id, data) {
    return new Promise((resolve) => {
      const index = knowledgeBase.findIndex(k => k.id === parseInt(id));
      if (index === -1) {
        resolve(false);
        return;
      }
      
      knowledgeBase[index] = {
        ...knowledgeBase[index],
        ...data,
        updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      resolve(true);
    });
  },

  async delete(id) {
    return new Promise((resolve) => {
      const index = knowledgeBase.findIndex(k => k.id === parseInt(id));
      if (index === -1) {
        resolve(false);
        return;
      }
      knowledgeBase.splice(index, 1);
      resolve(true);
    });
  },

  async incrementViews(id) {
    return new Promise((resolve) => {
      const item = knowledgeBase.find(k => k.id === parseInt(id));
      if (item) {
        item.views++;
      }
      resolve();
    });
  }
};

module.exports = KnowledgeModel;