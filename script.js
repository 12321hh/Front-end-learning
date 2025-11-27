// ------------- 登录逻辑（index.html）-------------
// 页面加载完成后执行
window.onload = function() {
  // 优先通过元素存在判断页面类型（适配 GitHub Pages 子路径）
  if (document.getElementById('loginForm')) {
    initLogin();
  }
  if (document.getElementById('showUsername')) {
    checkLoginStatus();
  }
};

// 初始化登录页逻辑
function initLogin() {
  // 获取表单、输入框、错误提示元素
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorTip = document.getElementById('errorTip');

  // 监听表单提交事件
  loginForm.onsubmit = function(e) {
    // 阻止表单默认提交行为（避免页面刷新）
    e.preventDefault();

    // 1. 获取输入值（去除首尾空格）
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // 2. 表单验证（非空）
    if (!username) {
      errorTip.textContent = '请输入账号名称！';
      return; // 验证失败，终止执行
    }
    if (!password) {
      errorTip.textContent = '请输入密码！';
      return;
    }

    // 3. 模拟登录验证（真实项目中替换为后端接口请求）
    // 测试账号：admin  密码：123456
    if (username === 'admin' && password === '123456') {
      // 登录成功：存储登录状态到本地（localStorage）
      localStorage.setItem('isLogin', 'true'); // 标记已登录
      localStorage.setItem('username', username); // 存储用户名

      // 跳转到首页
      window.location.href = 'home.html';
    } else {
      // 登录失败：提示错误
      errorTip.textContent = '用户名或密码错误！';
      // 清空密码框
      passwordInput.value = '';
    }
  };
}

// 首页：校验登录状态（未登录则跳回登录页）
function checkLoginStatus() {
  const isLogin = localStorage.getItem('isLogin');
  // 如果未登录，跳回登录页
  if (!isLogin || isLogin !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // 已登录：显示用户名 + 绑定退出按钮事件
  const username = localStorage.getItem('username');
  document.getElementById('showUsername').textContent = username;
  
  // 退出按钮逻辑
  document.getElementById('logoutBtn').onclick = function() {
    // 清除本地登录状态
    localStorage.removeItem('isLogin');
    localStorage.removeItem('username');
    // 跳回登录页
    window.location.href = 'index.html';
    alert('退出成功！');
  };
}