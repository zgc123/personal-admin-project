/*
 * @Description: 接口服务
 */
const path = require('path');
const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'mock/db.json'))
const middlewares = jsonServer.defaults()

// 登录中间件
const loginMiddleware = (req, res, next) => {
  if (req.path === '/login' && req.method === 'POST') {
    const { username, password } = req.body
    const db = router.db.read()
    const user = db.users.find(u => u.username === username && u.password === password)

    if (user) {
      return res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        roles: user.roles,
        token: 'admin-token-' + user.id
      })
    } else {
      return res.status(401).json({ message: '账号或密码错误' })
    }
  }
  next()
}

server.use(middlewares)
server.use(loginMiddleware)
server.use(router)

const port = 3030
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`)
})