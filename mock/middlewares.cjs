/*
 * @Description: 登录中间件
 */
module.exports = (req, res, next) => {
  if (req.path === '/login' && req.method === 'POST') {
    const db = require('./db.json')
    const { username, password } = req.body

    const user = db.users.find(
      u => u.username === username && u.password === password
    )

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count'); 
  next()
}