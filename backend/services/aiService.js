/**
 * AI服务模块
 * 处理与DeepSeek API的交互
 */
const axios = require('axios');
const config = require('../config/ai');
const logger = require('../utils/logger');

/**
 * 获取当前时间
 * @returns {Object} - 包含当前时间信息
 */
function getCurrentTime() {
  const now = new Date();
  return {
    date: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
    weekday: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()],
    full: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  };
}

/**
 * 获取最新新闻（通过网络搜索）
 * @param {string} keyword - 搜索关键词
 * @returns {Array} - 新闻列表
 */
async function getLatestNews(keyword = '') {
  try {
    // 使用百度搜索API（免费，无需API密钥）
    const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword + ' 最新新闻')}8&rn=10&ie=utf-8`;
    
    const response = await axios.get(searchUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // 解析HTML获取新闻标题和链接
    const newsItems = [];
    const titleRegex = /<h3[^>]*class="[^"]*news-title[^"]*"[^>]*>.*?<a[^>]*>([^<]+)<\/a>/gi;
    const linkRegex = /<h3[^>]*>.*?<a[^>]*href="([^"]+)"[^>]*>/gi;
    
    let match;
    const titles = [];
    const links = [];
    
    while ((match = titleRegex.exec(response.data)) !== null) {
      titles.push(match[1].trim());
    }
    
    while ((match = linkRegex.exec(response.data)) !== null) {
      links.push(match[1]);
    }
    
    for (let i = 0; i < Math.min(titles.length, 5); i++) {
      newsItems.push({
        title: titles[i],
        link: links[i] || ''
      });
    }
    
    return newsItems;
  } catch (error) {
    logger.error('获取新闻失败:', error.message);
    return [];
  }
}

/**
 * 搜索网络信息
 * @param {string} keyword - 搜索关键词
 * @returns {string} - 搜索结果摘要
 */
async function searchWeb(keyword) {
  try {
    // 使用百度搜索
    const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}&rn=5&ie=utf-8`;
    
    const response = await axios.get(searchUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // 简单解析搜索结果摘要
    const abstractRegex = /<span[^>]*class="[^"]*c-abstract[^"]*"[^>]*>([^<]+)<\/span>/gi;
    const results = [];
    let match;
    
    while ((match = abstractRegex.exec(response.data)) !== null && results.length < 3) {
      const abstract = match[1].replace(/<[^>]+>/g, '').trim();
      if (abstract && abstract.length > 20) {
        results.push(abstract);
      }
    }
    
    return results.join('\n\n');
  } catch (error) {
    logger.error('网络搜索失败:', error.message);
    return '';
  }
}

/**
 * 调用DeepSeek API生成回答
 * @param {string} question - 用户问题
 * @param {string} context - 上下文信息（来自知识库）
 * @returns {string} - AI生成的回答
 */
async function generateAnswer(question, context = '') {
  const questionLower = question.toLowerCase();
  
  // 检查是否询问时间
  if (questionLower.includes('现在几点') || questionLower.includes('现在时间') || 
      questionLower.includes('当前时间') || questionLower.includes('几点') ||
      questionLower.includes('日期') || questionLower.includes('今天')) {
    const time = getCurrentTime();
    return `当前时间是：${time.full}\n${time.weekday}`;
  }
  
  // 检查是否询问新闻
  if (questionLower.includes('新闻') || questionLower.includes('最新消息') || 
      questionLower.includes('最近发生了什么')) {
    const news = await getLatestNews(question.replace(/新闻|最新消息|最近发生了什么/g, '').trim());
    if (news.length > 0) {
      return `以下是最新新闻：\n\n${news.map((n, i) => `${i + 1}. ${n.title}`).join('\n')}\n\n如需了解更多详情，请访问相关新闻网站。`;
    } else {
      return '抱歉，暂时无法获取最新新闻。请稍后再试或访问新闻网站查看。';
    }
  }
  
  // 检查是否需要网络搜索
  const needWebSearch = questionLower.includes('搜索') || questionLower.includes('查询') ||
                        questionLower.includes('最近') || questionLower.includes('最新') ||
                        questionLower.includes('今天') || questionLower.includes('今年') ||
                        questionLower.includes('现在') || questionLower.includes('当前');
  
  if (needWebSearch) {
    const webResult = await searchWeb(question);
    if (webResult) {
      context = context ? context + '\n\n网络搜索结果：\n' + webResult : '网络搜索结果：\n' + webResult;
    }
  }
  
  if (!config.apiKey) {
    logger.warn('DeepSeek API Key未配置，使用模拟回答');
    return generateMockAnswer(question);
  }
  
  try {
    // 构建提示词
    let prompt = '你是一个校园智能咨询助手，请根据用户的问题提供准确、有用的回答。\n\n';
    
    if (context) {
      prompt += `参考信息：\n${context}\n\n`;
    }
    
    prompt += `用户问题：${question}\n\n回答：`;
    
    const response = await axios.post(
      config.apiUrl,
      {
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: config.timeout
      }
    );
    
    const answer = response.data.choices[0]?.message?.content;
    
    if (!answer) {
      throw new Error('AI API返回空响应');
    }
    
    logger.info('AI回答生成成功');
    return answer.trim();
    
  } catch (error) {
    logger.error('AI API调用失败:', error.message);
    
    // 如果AI调用失败，返回模拟回答
    return generateMockAnswer(question);
  }
}

/**
 * 生成模拟回答（当AI API不可用时）
 * @param {string} question - 用户问题
 * @returns {string} - 模拟回答
 */
function generateMockAnswer(question) {
  const questionLower = question.toLowerCase();
  
  // 校园相关问题
  if (questionLower.includes('图书馆') || questionLower.includes('借书')) {
    return '图书馆周一至周五开放时间为8:00-22:00，周末为9:00-20:00。您可以凭借校园卡进入图书馆并借阅图书，每本书可借阅30天。';
  }
  
  if (questionLower.includes('食堂') || questionLower.includes('吃饭')) {
    return '学校共有3个食堂，提供各种口味的餐食。第一食堂位于教学区，第二食堂位于宿舍区，第三食堂位于体育馆附近。';
  }
  
  if (questionLower.includes('宿舍') || questionLower.includes('住宿')) {
    return '宿舍门禁时间为23:00-6:00，禁止使用大功率电器。宿舍内配备基本家具和空调。';
  }
  
  if (questionLower.includes('选课') || questionLower.includes('课程')) {
    return '选课系统于每学期开学前两周开放，学生需登录教务系统进行选课。每人每学期最多可选25学分。';
  }
  
  if (questionLower.includes('奖学金') || questionLower.includes('助学金')) {
    return '国家奖学金申请条件：成绩排名专业前10%，无违纪记录，有突出的综合素质表现。申请时间为每年10月。';
  }
  
  if (questionLower.includes('就业') || questionLower.includes('工作')) {
    return '就业指导中心位于大学生活动中心3楼，提供简历指导、模拟面试、招聘会信息等服务。开放时间：周一至周五9:00-17:00。';
  }
  
  if (questionLower.includes('入学') || questionLower.includes('报到')) {
    return '新生入学需携带身份证、录取通知书、一寸照片8张。报到时间为9月1日-9月3日，地点为大学生活动中心。';
  }
  
  // 通用知识问答
  if (questionLower.includes('你好') || questionLower.includes('嗨') || questionLower.includes('hello') || questionLower.includes('hi')) {
    return '你好！我是校园智能助手，很高兴为你服务。请问有什么我可以帮助你的吗？';
  }
  
  if (questionLower.includes('谢谢') || questionLower.includes('thank')) {
    return '不客气！能帮到你我很开心。如果还有其他问题，随时可以问我。';
  }
  
  if (questionLower.includes('天气') || questionLower.includes('温度')) {
    return '抱歉，我目前无法获取实时天气信息。你可以通过手机天气APP或网站查询当地天气。';
  }
  
  if (questionLower.includes('时间') || questionLower.includes('几点')) {
    const now = new Date();
    return `现在是${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
  
  if (questionLower.includes('你是谁') || questionLower.includes('你的名字')) {
    return '我是校园智能助手，是一个基于AI技术的智能问答系统。我的主要任务是帮助同学们解答校园生活中的各种问题。';
  }
  
  if (questionLower.includes('什么是') || questionLower.includes('定义') || questionLower.includes('解释')) {
    const topic = question.replace(/什么是|什么叫|定义|解释/g, '').trim();
    if (topic) {
      return `关于"${topic}"，这是一个很有趣的话题。由于我的知识有限，无法给出完整的解释。建议你查阅相关资料或咨询专业人士获取更详细的信息。`;
    }
  }
  
  if (questionLower.includes('如何') || questionLower.includes('怎么') || questionLower.includes('怎样')) {
    return '这是一个很好的问题！具体的方法可能因情况而异。如果你能提供更多上下文信息，我可以尝试给出更具体的建议。';
  }
  
  if (questionLower.includes('为什么') || questionLower.includes('原因')) {
    return '这背后可能有多种原因。如果你能提供更多背景信息，我可以尝试帮你分析可能的原因。';
  }
  
  if (questionLower.includes('推荐') || questionLower.includes('建议')) {
    return '好的！根据你的需求，我有以下建议供你参考：1. 先明确自己的目标和需求；2. 收集相关信息；3. 对比分析不同选项；4. 做出最适合自己的选择。';
  }
  
  // 创意内容生成
  if (questionLower.includes('写') || questionLower.includes('生成') || questionLower.includes('创作')) {
    if (questionLower.includes('文案') || questionLower.includes('通知') || questionLower.includes('报告')) {
      return '我可以帮你生成各种文案！请告诉我具体的主题和要求，比如：\n- 失物招领文案\n- 活动通知\n- 请假条\n- 感谢信\n等等，我会尽力为你创作。';
    }
  }
  
  // 数学计算
  if (/[\d+\-*/().]+/.test(question)) {
    try {
      const expression = question.replace(/[^0-9+\-*/().]/g, '');
      if (expression) {
        const result = eval(expression);
        return `计算结果：${expression} = ${result}`;
      }
    } catch (e) {
      // 忽略计算错误
    }
  }
  
  // 默认回答
  return `你问的是："${question}"\n\n这是一个很有意思的问题！我来帮你分析一下...\n\n由于AI服务暂不可用，我无法提供更详细的回答。不过，我可以给你一些通用建议：\n\n1. 如果这是校园相关问题，请查看校园官网或联系相关部门\n2. 如果这是学习问题，可以咨询老师或同学\n3. 如果这是生活问题，可以和朋友家人商量\n\n如果AI服务恢复后，我可以为你提供更专业的回答！`;
}

/**
 * 对问题进行分类
 * @param {string} question - 用户问题
 * @returns {string} - 分类结果
 */
function classifyQuestion(question) {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('入学') || questionLower.includes('报到') || questionLower.includes('录取') || questionLower.includes('新生')) {
    return 'admission';
  }
  
  if (questionLower.includes('课程') || questionLower.includes('选课') || questionLower.includes('成绩') || questionLower.includes('考试') || 
      questionLower.includes('学分') || questionLower.includes('论文') || questionLower.includes('毕业') || questionLower.includes('转专业') ||
      questionLower.includes('奖学金') || questionLower.includes('绩点')) {
    return 'academic';
  }
  
  if (questionLower.includes('图书馆') || questionLower.includes('校园卡') || questionLower.includes('食堂') || questionLower.includes('体育馆') ||
      questionLower.includes('教学楼') || questionLower.includes('校历') || questionLower.includes('校园网')) {
    return 'campus';
  }
  
  if (questionLower.includes('就业') || questionLower.includes('实习') || questionLower.includes('简历') || questionLower.includes('面试') ||
      questionLower.includes('招聘') || questionLower.includes('职业')) {
    return 'career';
  }
  
  if (questionLower.includes('宿舍') || questionLower.includes('住宿') || questionLower.includes('生活') || questionLower.includes('吃饭') ||
      questionLower.includes('交通') || questionLower.includes('医疗') || questionLower.includes('快递')) {
    return 'life';
  }
  
  return 'other';
}

/**
 * 搜索融合接口 - 同时进行多表搜索和AI问答
 * @param {string} question - 用户问题
 * @param {string} searchType - 搜索类型 (combined/search/ask)
 * @returns {Object} - 包含回答和搜索结果的对象
 */
async function searchAndAsk(question, searchType = 'combined') {
  try {
    // 1. 从所有表中搜索数据
    const searchResults = searchAllTables(question);
    
    // 2. 调用AI生成回答（带搜索上下文）
    let answer;
    let knowledgeUsed = false;
    
    if (searchResults.length > 0 && searchType !== 'ask') {
      // 有搜索结果，作为上下文传给AI
      const context = searchResults.slice(0, 5).map(item => {
        let content = item.content || item.description || item.summary || '';
        return `${item.title}\n${content.substring(0, 200)}`;
      }).join('\n\n');
      
      answer = await generateAnswer(question, context);
      knowledgeUsed = true;
    } else {
      // 无搜索结果或仅AI问答模式
      answer = await generateAnswer(question);
      knowledgeUsed = false;
    }
    
    // 3. 整合结果
    return {
      answer: answer,
      searchResults: searchType !== 'ask' ? searchResults : [],
      confidence: searchResults.length > 0 ? 0.85 : 0.6,
      intent: { type: '咨询', confidence: 0.7 },
      category: classifyQuestion(question),
      knowledgeUsed: knowledgeUsed
    };
  } catch (error) {
    logger.error('搜索融合失败:', error);
    return {
      answer: '抱歉，处理您的问题时发生错误，请稍后再试。',
      searchResults: [],
      confidence: 0.3,
      intent: { type: '咨询', confidence: 0.3 },
      category: 'other',
      knowledgeUsed: false
    };
  }
}

/**
 * 从所有表中搜索数据
 * @param {string} question - 搜索关键词
 * @returns {Array} - 搜索结果数组
 */
function searchAllTables(question) {
  const results = [];
  const keyword = question.toLowerCase();
  
  // 模拟搜索校园数据（实际应从数据库查询）
  const mockData = {
    notices: [
      { id: 1, title: '图书馆开放时间调整通知', content: '图书馆将于下周一起调整开放时间为8:00-22:00', type: 'notice' },
      { id: 2, title: '新学期选课通知', content: '新学期选课将于9月1日开始，请同学们及时选课', type: 'notice' },
      { id: 3, title: '食堂菜品更新公告', content: '第三食堂新增多种特色菜品，欢迎品尝', type: 'notice' }
    ],
    books: [
      { id: 101, title: '高等数学', content: '高等数学教材，适合大一学生使用', type: 'book' },
      { id: 102, title: '大学英语', content: '大学英语四级备考指南', type: 'book' },
      { id: 103, title: '计算机导论', content: '计算机科学入门教材', type: 'book' }
    ],
    activities: [
      { id: 201, title: '校园招聘会', content: '秋季校园招聘会将于10月举行', type: 'activity' },
      { id: 202, title: '新生欢迎晚会', content: '新生欢迎晚会将于9月10日举办', type: 'activity' }
    ],
    canteen: [
      { id: 301, title: '第一食堂', description: '提供各种家常菜，口味丰富', type: 'canteen' },
      { id: 302, title: '第二食堂', description: '特色小吃窗口，价格实惠', type: 'canteen' }
    ],
    dormitory: [
      { id: 401, title: '学生宿舍管理规定', content: '宿舍门禁时间23:00-6:00', type: 'dormitory' }
    ],
    lost_found: [
      { id: 501, title: '失物招领：学生证', content: '在图书馆捡到学生证一张，请失主联系', type: 'lost_found' }
    ]
  };
  
  // 搜索所有表
  for (const [tableName, items] of Object.entries(mockData)) {
    items.forEach(item => {
      const titleMatch = item.title && item.title.toLowerCase().includes(keyword);
      const contentMatch = (item.content || item.description || '').toLowerCase().includes(keyword);
      
      if (titleMatch || contentMatch) {
        results.push({
          id: item.id,
          title: item.title,
          summary: (item.content || item.description || '').substring(0, 100),
          type: item.type,
          source: tableName
        });
      }
    });
  }
  
  return results.slice(0, 10);
}

module.exports = {
  generateAnswer,
  classifyQuestion,
  searchAndAsk,
  searchAllTables
};
