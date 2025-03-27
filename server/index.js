// node后端服务器
const http = require('http')
const badyParser = require('body-parser')
const express = require('express')
const userApi = require('./api/userApi')

let app = express()
const bodyParser = require('body-parser')
const cors = require('cors') // 解决跨域问题
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors())
app.use(bodyParser.json())

let server = http.createServer(app)
// 引入路由文件(即upLoadImg.js)
const router = require('./api/upLoadImg')
// 部署静态资源, 部署之后即可通过域名访问文件
app.use(express.static('upload'))
// 挂载路由
app.use('/api/upload', router)

app.use('/api/email', userApi)

app.use(badyParser.json())
app.use(badyParser.urlencoded({
  extended: false
}))

// 后端api路由
app.use('/api/user', userApi)
app.use('/api/book', userApi)

// 启动监听
server.listen(8888, () => {
  console.log(' success!! port:8888')
})
