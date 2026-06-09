/**
 * 用户模型 - 内存存储版本（无需MySQL）
 */
const users = [
  {
    id: 1,
    username: 'student1',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrqj3J8j8j8j8j8j8j8j8j8j8j8j8j8',
    role: 'student',
    nickname: '小明',
    phone: '13800138001',
    avatar: null,
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'teacher1',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrqj3J8j8j8j8j8j8j8j8j8j8j8j8j8',
    role: 'teacher',
    nickname: '李老师',
    phone: '13800138002',
    avatar: null,
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    username: 'admin',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrqj3J8j8j8j8j8j8j8j8j8j8j8j8j8',
    role: 'admin',
    nickname: '管理员',
    phone: '13800138003',
    avatar: null,
    status: 'active',
    created_at: new Date().toISOString()
  }
];

// 预设密码的hash值（密码都是123456）
const passwordHash = '$2a$10$sID5Ivcd2KwGVbqkVxOXmO2LhzD89SzhpROHSMxdEL88sTaakMbxS';

// 初始化用户密码
users.forEach(user => {
  user.password = passwordHash;
});

const UserModel = {
  /**
   * 根据用户名查找用户
   */
  findByUsername(username) {
    return new Promise((resolve, reject) => {
      const user = users.find(u => u.username === username);
      resolve(user || null);
    });
  },

  /**
   * 根据ID查找用户
   */
  findById(id) {
    return new Promise((resolve, reject) => {
      const user = users.find(u => u.id === parseInt(id));
      if (user) {
        // 返回时不包含密码
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
    });
  },

  /**
   * 创建用户
   */
  create(userData) {
    return new Promise((resolve, reject) => {
      const { username, password, role, nickname, phone } = userData;

      // 检查用户名是否已存在
      if (users.find(u => u.username === username)) {
        reject(new Error('用户名已存在'));
        return;
      }

      const newUser = {
        id: users.length + 1,
        username,
        password,
        role: role || 'student',
        nickname: nickname || username,
        phone: phone || null,
        avatar: null,
        status: 'active',
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      resolve(newUser.id);
    });
  },

  /**
   * 更新用户信息
   */
  update(id, updateData) {
    return new Promise((resolve, reject) => {
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index === -1) {
        reject(new Error('用户不存在'));
        return;
      }

      users[index] = { ...users[index], ...updateData };
      resolve(true);
    });
  },

  /**
   * 更新密码
   */
  updatePassword(id, newPassword) {
    return new Promise((resolve, reject) => {
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index === -1) {
        reject(new Error('用户不存在'));
        return;
      }

      users[index].password = newPassword;
      resolve(true);
    });
  },

  /**
   * 查找所有客服
   */
  findCustomerService() {
    return new Promise((resolve) => {
      const csUsers = users
        .filter(u => u.role === 'customer_service')
        .map(({ password, ...user }) => user);
      resolve(csUsers);
    });
  },

  /**
   * 获取所有用户（管理员）
   */
  findAll() {
    return new Promise((resolve) => {
      const allUsers = users.map(({ password, ...user }) => user);
      resolve(allUsers);
    });
  }
};

module.exports = UserModel;