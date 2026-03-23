# Chrome Dev Tools 前端全流程测试指南

## 📋 测试环境信息

- **前端服务**: http://localhost:5173/
- **后端服务**: http://localhost:8000/
- **API 文档**: http://localhost:8000/docs
- **测试日期**: 2026-03-23

---

## 🚀 启动步骤

### 1. 确保后端服务已启动

```bash
# 后端服务应该在 8000 端口运行
http://localhost:8000/docs
```

### 2. 访问前端应用

在 Chrome 浏览器中打开：
```
http://localhost:5173/
```

### 3. 打开 Chrome Dev Tools

- **快捷键**: `F12` 或 `Ctrl + Shift + I` (Windows/Linux) / `Cmd + Option + I` (Mac)
- **或者**: 右键点击页面 → "检查" / "Inspect"

---

## 🧪 测试场景与步骤

### 测试场景 1: 登录流程

#### 1.1 访问登录页

**操作步骤**:
1. 打开 http://localhost:5173/
2. 检查是否自动跳转到登录页 `/login`

**Dev Tools 验证**:
```
Console Tab: 检查是否有错误
Network Tab: 检查 API 请求
Elements Tab: 检查登录页面是否正确渲染
```

**预期结果**:
- ✅ 页面显示登录表单
- ✅ 页面标题为 "Login"
- ✅ 无控制台错误

#### 1.2 表单验证测试

**操作步骤**:
1. 点击 "登录" 按钮（不填写任何内容）
2. 检查表单验证提示

**Dev Tools 验证**:
```
Elements Tab: 查看 input 元素是否有验证样式
```

**预期结果**:
- ✅ 显示错误提示（用户名和密码必填）
- ✅ 输入框显示错误样式（红色边框）
- ✅ 按钮被禁用或显示错误

#### 1.3 OAuth 按钮测试

**操作步骤**:
1. 点击 "GitHub 登录" 按钮
2. 点击 "GitLab 登录" 按钮

**Dev Tools 验证**:
```
Network Tab: 检查是否有 OAuth 请求
Console Tab: 检查是否有错误
```

**预期结果**:
- ✅ 按钮点击无反应（OAuth 配置未设置）或跳转到 OAuth 页面
- ✅ 无控制台错误

---

### 测试场景 2: 仪表板 (Dashboard)

#### 2.1 访问仪表板

**操作步骤**:
1. 登录成功后自动跳转到 `/` (Dashboard)
2. 或直接访问 http://localhost:5173/

**Dev Tools 验证**:
```
Network Tab: 检查 API 请求（获取统计数据）
Response Tab: 检查 API 响应数据格式
```

**预期结果**:
- ✅ 页面显示 "Dashboard" 标题
- ✅ 显示统计卡片（任务数、设备数、用户数）
- ✅ 无控制台错误

#### 2.2 数据刷新测试

**操作步骤**:
1. 打开 Network Tab
2. 刷新页面（F5）
3. 观察 API 请求

**Dev Tools 验证**:
```
Network Tab: 查找以下请求
- GET /api/dashboard/stats (或类似)
- 检查请求状态码（应该是 200）
```

**预期结果**:
- ✅ 发起 dashboard 统计 API 请求
- ✅ 响应状态码为 200
- ✅ 数据正确显示

---

### 测试场景 3: 任务管理 (Tasks)

#### 3.1 访问任务页面

**操作步骤**:
1. 点击左侧菜单 "Tasks" 或访问 http://localhost:5173/tasks

**Dev Tools 验证**:
```
Network Tab: 检查任务列表 API 请求
```

**预期结果**:
- ✅ 页面显示 "Tasks" 标题
- ✅ 显示任务列表（可能有空状态提示）
- ✅ 无控制台错误

#### 3.2 任务列表渲染

**操作步骤**:
1. 观察 Table 组件
2. 检查表头（Task ID, Pipeline, Status 等）
3. 检查表格数据

**Dev Tools 验证**:
```
Elements Tab: 检查 Table 组件结构
  - <table> 元素
  - <thead> 元素
  - <tbody> 元素
  - <tr> 和 <td> 元素
```

**预期结果**:
- ✅ 表格结构正确
- ✅ 表头显示正确
- ✅ 数据正确显示（或空状态）

#### 3.3 任务筛选功能

**操作步骤**:
1. 查找筛选器（Status 下拉框）
2. 选择不同的状态
3. 观察表格变化

**Dev Tools 验证**:
```
Network Tab: 检查筛选 API 请求
  - GET /api/tasks?status=pending (等)
```

**预期结果**:
- ✅ 筛选器可用
- ✅ 发起筛选请求
- ✅ 表格根据筛选条件更新

---

### 测试场景 4: 设备管理 (Devices)

#### 4.1 访问设备页面

**操作步骤**:
1. 点击左侧菜单 "Devices" 或访问 http://localhost:5173/devices

**Dev Tools 验证**:
```
Network Tab: 检查设备列表 API 请求
```

**预期结果**:
- ✅ 页面显示 "Devices" 标题
- ✅ 显示设备列表
- ✅ 无控制台错误

#### 4.2 设备列表渲染

**操作步骤**:
1. 观察 Table 组件
2. 检查设备信息（Device ID, IP, Status 等）

**Dev Tools 验证**:
```
Elements Tab: 检查组件结构
```

**预期结果**:
- ✅ 表格结构正确
- ✅ 设备信息显示正确

#### 4.3 设备状态显示

**操作步骤**:
1. 查找设备状态标签
2. 检查状态颜色区分

**Dev Tools 验证**:
```
Elements Tab: 检查 Badge/Tag 组件
```

**预期结果**:
- ✅ 不同状态显示不同颜色（Online=绿色, Offline=红色等）

---

### 测试场景 5: 用户管理 (Users)

#### 5.1 访问用户页面

**操作步骤**:
1. 点击左侧菜单 "Users" 或访问 http://localhost:5173/users

**Dev Tools 验证**:
```
Network Tab: 检查用户列表 API 请求
```

**预期结果**:
- ✅ 页面显示 "Users" 标题
- ✅ 显示用户列表
- ✅ 无控制台错误

#### 5.2 用户列表渲染

**操作步骤**:
1. 观察 Table 组件
2. 检查用户信息（Username, Email, Role 等）

**Dev Tools 验证**:
```
Elements Tab: 检查表格结构
```

**预期结果**:
- ✅ 表格结构正确
- ✅ 用户信息显示正确

#### 5.3 用户操作测试

**操作步骤**:
1. 查找操作按钮（Edit, Delete）
2. 点击按钮（如果有）
3. 观察弹窗或确认对话框

**Dev Tools 验证**:
```
Elements Tab: 检查 Modal/Dialog 组件
```

**预期结果**:
- ✅ 操作按钮显示正确
- ✅ 点击后显示确认对话框

---

### 测试场景 6: 导航和路由

#### 6.1 主菜单导航

**操作步骤**:
1. 点击左侧菜单的各种链接
2. 观察页面跳转
3. 检查 URL 变化

**Dev Tools 验证**:
```
Console Tab: 检查路由日志（如果有）
Network Tab: 检查页面资源加载
```

**预期结果**:
- ✅ 菜单导航正常
- ✅ URL 正确变化
- ✅ 页面正确渲染

#### 6.2 面包屑导航

**操作步骤**:
1. 深入导航到某个页面
2. 点击面包屑导航
3. 观察返回行为

**Dev Tools 验证**:
```
Elements Tab: 检查面包屑组件
```

**预期结果**:
- ✅ 面包屑显示正确
- ✅ 点击面包屑正确导航

#### 6.3 浏览器前进后退

**操作步骤**:
1. 使用浏览器后退按钮
2. 使用浏览器前进按钮
3. 观察页面变化

**预期结果**:
- ✅ 前进后退功能正常
- ✅ 页面状态正确恢复

---

### 测试场景 7: 响应式设计

#### 7.1 移动端视图测试

**操作步骤**:
1. 打开 Dev Tools
2. 点击 Device Toolbar (Toggle device toolbar)
3. 选择移动设备（如 iPhone 12）

**Dev Tools 验证**:
```
Elements Tab: 检查断点样式
```

**预期结果**:
- ✅ 页面响应式布局
- ✅ 移动端菜单可用

#### 7.2 平板视图测试

**操作步骤**:
1. 选择平板设备（如 iPad）
2. 调整屏幕大小

**Dev Tools 验证**:
```
Elements Tab: 检查响应式布局
```

**预期结果**:
- ✅ 平板布局正确
- ✅ 横竖屏切换正常

#### 7.3 桌面端视图测试

**操作步骤**:
1. 切换到桌面模式
2. 调整窗口大小

**Dev Tools 验证**:
```
Elements Tab: 检查弹性布局
```

**预期结果**:
- ✅ 桌面布局正确
- ✅ 窗口缩放正常

---

### 测试场景 8: API 请求和错误处理

#### 8.1 API 请求监控

**操作步骤**:
1. 打开 Network Tab
2. 触发各种操作（导航、筛选等）
3. 观察 API 请求

**Dev Tools 验证**:
```
Network Tab:
- 查看 Request URL
- 查看 Request Method (GET, POST, etc.)
- 查看 Request Headers
- 查看 Response Status
- 查看 Response Body
```

**预期结果**:
- ✅ 所有 API 请求都有正确的 URL
- ✅ 请求方法正确
- ✅ 请求头包含认证信息（Authorization）
- ✅ 响应状态码正确
- ✅ 响应数据格式正确

#### 8.2 错误处理测试

**操作步骤**:
1. 停止后端服务（模拟网络错误）
2. 刷新前端页面
3. 观察 Error Handling

**Dev Tools 验证**:
```
Console Tab: 检查错误消息
Network Tab: 检查失败的请求
```

**预期结果**:
- ✅ 显示错误提示
- ✅ 无控制台未捕获错误
- ✅ 用户体验友好

#### 8.3 Token 刷新测试

**操作步骤**:
1. 登录后等待 token 过期（模拟）
2. 触发 API 请求
3. 观察 token 刷新

**Dev Tools 验证**:
```
Network Tab: 查找刷新 token 的请求
Console Tab: 检查 token 刷新日志
```

**预期结果**:
- ✅ Token 自动刷新
- ✅ 用户无感知
- ✅ API 请求重试成功

---

### 测试场景 9: 性能测试

#### 9.1 页面加载性能

**操作步骤**:
1. 打开 Performance Tab
2. 点击 Record
3. 刷新页面
4. 停止录制

**Dev Tools 验证**:
```
Performance Tab:
- 查看 Flame Chart
- 查看 FPS (Frames Per Second)
- 查看 Network 请求时间
```

**预期结果**:
- ✅ 首次内容绘制 (FCP) < 1.8s
- ✅ 最大内容绘制 (LCP) < 2.5s
- ✅ FPS > 30

#### 9.2 资源加载优化

**操作步骤**:
1. 打开 Network Tab
2. 刷新页面
3. 查看 Loading 阶段

**Dev Tools 验证**:
```
Network Tab:
- 查看资源加载顺序
- 查看资源大小
- 查看加载时间
```

**预期结果**:
- ✅ JavaScript 包大小合理
- ✅ CSS 包大小合理
- ✅ 资源压缩正确

#### 9.3 内存泄漏测试

**操作步骤**:
1. 打开 Performance Monitor
2. 记录初始内存
3. 反复导航页面
4. 观察内存变化

**Dev Tools 验证**:
```
Performance Monitor:
- JS Heap Size
- DOM Nodes
- Event Listeners
```

**预期结果**:
- ✅ JS Heap Size 稳定
- ✅ 无内存泄漏

---

### 测试场景 10: 可访问性测试

#### 10.1 键盘导航

**操作步骤**:
1. 使用 `Tab` 键导航
2. 使用 `Enter` 键激活按钮
3. 使用 `Esc` 关闭弹窗

**Dev Tools 验证**:
```
Elements Tab: 检查 tab-index 属性
```

**预期结果**:
- ✅ Tab 顺序合理
- ✅ Enter 键激活工作正常
- ✅ Esc 关闭功能正常

#### 10.2 屏幕阅读器支持

**操作步骤**:
1. 使用 Elements Tab
2. 检查语义化标签
3. 检查 ARIA 属性

**Dev Tools 验证**:
```
Elements Tab:
- <nav>, <main>, <section>, <article>
- role 属性
- aria-label, aria-describedby
```

**预期结果**:
- ✅ 使用语义化标签
- ✅ ARIA 属性正确
- ✅ 交互元素有适当的标签

#### 10.3 对比度和颜色测试

**操作步骤**:
1. 使用 Audits Tab (Lighthouse)
2. 运行 Accessibility 检查

**Dev Tools 验证**:
```
Lighthouse/Accessibility:
- Color contrast
- Image alt text
- Form labels
- Heading hierarchy
```

**预期结果**:
- ✅ 对比度符合 WCAG 标准
- ✅ 所有图片有 alt 文本
- ✅ 表单有标签
- ✅ 标题层级正确

---

## 📊 测试检查清单

### 页面加载
- [ ] 所有页面都能正确加载
- [ ] 无 JavaScript 错误
- [ ] 无 CSS 错误
- [ ] 加载时间合理

### 导航
- [ ] 菜单导航正常
- [ ] 面包屑导航正常
- [ ] 浏览器前进后退正常
- [ ] URL 路由正确

### 表单
- [ ] 表单验证正确
- [ ] 错误提示清晰
- [ ] 提交按钮状态正确
- [ ] 键盘操作支持

### API 交互
- [ ] API 请求正确发送
- [ ] 响应正确处理
- [ ] 错误正确处理
- [ ] Loading 状态正确

### 响应式
- [ ] 移动端布局正确
- [ ] 平板布局正确
- [ ] 桌面端布局正确
- [ ] 横竖屏切换正常

### 性能
- [ ] 页面加载快
- [ ] 资源优化好
- [ ] 无内存泄漏
- [ ] FPS 高

### 可访问性
- [ ] 键盘导航支持
- [ ] 屏幕阅读器支持
- [ ] 颜色对比度达标
- [ ] 语义化标签使用

---

## 🐛 常见问题排查

### 问题 1: 页面空白

**检查步骤**:
1. Console Tab 查看错误
2. Network Tab 检查资源加载
3. 检查 JavaScript 语法错误

### 问题 2: API 请求失败

**检查步骤**:
1. Network Tab 检查请求 URL
2. 检查请求头（Authorization）
3. 检查响应状态码
4. 检查响应体错误信息

### 问题 3: 样式错乱

**检查步骤**:
1. Elements Tab 检查 CSS 类
2. Computed Tab 检查计算样式
3. 检查 CSS 文件是否加载

### 问题 4: 交互不响应

**检查步骤**:
1. Elements Tab 检查事件监听器
2. Console Tab 查看事件错误
3. 检查 JavaScript 错误

---

## 📝 测试报告模板

```
测试日期: 2026-03-23
测试人员: [Your Name]
测试环境: Chrome Dev Tools, http://localhost:5173/

测试结果:
- 登录流程: [Pass/Fail]
- 仪表板: [Pass/Fail]
- 任务管理: [Pass/Fail]
- 设备管理: [Pass/Fail]
- 用户管理: [Pass/Fail]
- 导航和路由: [Pass/Fail]
- 响应式设计: [Pass/Fail]
- API 请求: [Pass/Fail]
- 性能: [Pass/Fail]
- 可访问性: [Pass/Fail]

发现的问题:
1. [问题描述]
2. [问题描述]

改进建议:
1. [改进建议]
2. [改进建议]

整体评估: [优秀/良好/一般/需要改进]
```

---

## 🎯 快速测试脚本

### 自动化测试命令

```bash
# 测试登录页
curl http://localhost:5173/login

# 测试仪表板
curl http://localhost:5173/

# 测试任务页面
curl http://localhost:5173/tasks

# 测试设备页面
curl http://localhost:5173/devices

# 测试用户页面
curl http://localhost:5173/users
```

### 测试数据检查

```bash
# 检查后端 API 响应
curl http://localhost:8000/api/tasks
curl http://localhost:8000/api/devices
curl http://localhost:8000/api/users
```

---

**测试完成后，请更新测试状态：**
- ✅ 所有测试通过
- ⚠️ 部分测试失败
- ❌ 需要修复
