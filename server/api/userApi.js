const express = require('express')
const router = express.Router()
const nodemail = require('./nodemailer')
const DBHelper = require('../utils/DBHelper')
const sql = require('../sqlMap')

// 增加用户
router.post('/addUser', (req, res) => {
  let sqlStr = sql.user.add
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.name, params.email, params.password, params.type], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 查询用户
router.post('/selectUser', (req, res) => {
  let sqlStr = sql.user.select
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.name], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 查询用户用于注册判断
router.post('/selectUser_like', (req, res) => {
  let sqlStr = sql.user.select_like
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.name, params.email], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 查询用户验证码
router.post('/selectCode', (req, res) => {
  let sqlStr = sql.user.selectcode
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.name], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 查询用户验证码
router.post('/updatePassword', (req, res) => {
  let sqlStr = sql.user.updatepass
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.password, params.name], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 查询书籍
router.post('/selectBook', (req, res) => {
  let sqlStr = sql.book.select
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.name], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 增加书籍
router.post('/addBook', (req, res) => {
  let sqlStr = sql.book.add
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.name, params.master, params.book, params.introduction, params.content, params.picture], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 删除书籍
router.post('/deleteBook', (req, res) => {
  let sqlStr = sql.book.delete
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.id], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 修改书籍
router.post('/updateBook', (req, res) => {
  let sqlStr = sql.book.update
  let params = req.body
  let conn = new DBHelper().getConn()
  conn.query(sqlStr, [params.name, params.master, params.book, params.introduction, params.content, params.picture, params.id], (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
  conn.end()
})

// 验证邮件
const check = {} // 声明一个对象缓存邮箱和验证码，留着
const Email = require('./sendEmail.js') // 引入封装好的函数
router.post('/el', (req, res) => {
  let params = req.body

  if (!params.email) {
    return res.send('参数错误')
  } // email出错时或者为空时
  let code = parseInt(Math.random(0, 1) * 10000) // 生成随机验证码
  check[params.email] = code
  // 发送邮件
  Email.sendMail(params.email, (state) => {
    if (state) {
      return res.send('发送成功')
    } else {
      return res.send('失败')
    }
  })
})

const randomFns = () => { // 生成6位随机数
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += parseInt(Math.random() * 10)
  }
  return code
}

// 获取邮箱验证码
router.post('/eMail', async function (req, res, next) { // 可用post方法，看个人喜好
  const currentDate = new Date()
  currentDate.toLocaleDateString()
  const EMAIL = req.body.email // 这里是接收邮件的邮箱，我这里写死，可从req中获取
  let code = randomFns()
  let Code = `${code} ` + ` <br> ${currentDate}`
  const mail = {
    // 发件人
    from: 'youcan0109@163.com', // 这里需要相同的后缀邮箱，如何上面你是用的网易邮箱，这里也要是网易邮箱
    // 主题
    subject: '验证码', // 邮箱主题
    // 收件人
    to: EMAIL, // 前台传过来的邮箱
    // 邮件内容，HTML格式
    html: `
          <p>您好！</p>
          <p>你的验证码是：<strong style="color: #ff4e2a;">${Code}</strong></p>
          <p>***该验证码5分钟内有效***</p>` // html 内容
  }
  await nodemail.sendMail(mail, function (error, info) {
    if (error) {
      res.json({
        code: 1,
        message: '获取验证码失败，请稍后再试...'
      })
    }
    let conn = new DBHelper().getConn()
    const sql = `UPDATE user set code=? where email=?`
    conn.query(sql, [code, EMAIL], (err, result) => {
      if (err) {
        console.log(err)
        res.json({
          code: 1,
          message: '获取验证码失败，请稍后再试'
        })
      } else {
        res.json({
          code: 0,
          message: '获取验证码成功,请去邮箱获取验证码'
        })
      }
    })
    // transporter.close() // 关闭连接池
  })
})

module.exports = router
