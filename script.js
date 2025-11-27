// ------------- 登录逻辑（index.html）-------------
// 页面加载完成后执行
// 构造绝对 URL（兼容 GitHub Pages 仓库子路径与 index.html 作为入口）
// 例如：/Front-end-learning/index.html -> basePath = '/Front-end-learning/'
// 返回完整的绝对地址： https://12321hh.github.io/Front-end-learning/home.html
function makeAbsolute(path) {
  const loc = location;
  const pathname = loc.pathname;
  // 如果当前 URL 指向具体文件（以 .html 结尾），移除文件名，保留目录
  const basePath = pathname.endsWith('.html') ? pathname.replace(/[^\/]*$/, '') : pathname;
  // 确保 basePath 以 / 结尾
  const normalizedBase = basePath.endsWith('/') ? basePath : basePath + '/';
  return loc.origin + normalizedBase + path;
}

// 将页面上所有相对 <a> 链接改写为绝对链接（排除外部链接、锚点、javascript:）
function rewriteRelativeLinks() {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const lower = href.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('#') || lower.startsWith('javascript:')) {
      return;
    }
    // 将相对路径转换为绝对路径
    a.href = makeAbsolute(href);
  });
}

// 在 window.onload 中调用改写并添加调试输出
window.onload = function() {
  // 优先通过元素存在判断页面类型（适配 GitHub Pages 子路径）
  rewriteRelativeLinks(); // 先改写所有链接，避免微信内置浏览器使用错误基准
  console.log('[script.js] rewriteRelativeLinks applied. base ->', location.origin + location.pathname);
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
    // 把所有 programmatic 跳转改为使用 makeAbsolute + replace（replace 在历史中不留下记录，微信表现更稳定）
    if (username === 'admin' && password === '123456') {
      // 登录成功：存储登录状态到本地（localStorage）
      localStorage.setItem('isLogin', 'true'); // 标记已登录
      localStorage.setItem('username', username); // 存储用户名

      // 跳转到首页（使用基于当前 location 的绝对 URL，兼容微信内置浏览器）
      // 使用 replace 避免在历史记录中留下中间页（可按需改为 href/assign）
      const target = makeAbsolute('home.html');
      console.log('[script.js] login success, redirect to', target);
      location.replace(target);
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
    // 使用绝对 URL 跳回登录页
    const target = makeAbsolute('index.html');
    console.log('[script.js] not logged in, redirect to', target);
    location.replace(target);
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
    const logoutTarget = makeAbsolute('index.html');
    console.log('[script.js] logout, redirect to', logoutTarget);
    location.replace(logoutTarget);
    alert('退出成功！');
  };
}