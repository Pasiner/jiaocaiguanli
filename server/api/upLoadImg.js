// 引入express路由
const express = require('express')
const router = express.Router()
const multer = require('multer')

/*
  multer是node的中间件, 处理表单数据 主要用于上传文件  multipart/form-data
*/

// 指定存储位置
const storage = multer.diskStorage({
  // 存储位置
  destination (req, file, callback) {
    // 参数一 错误信息   参数二  上传路径（此处指定upload文件夹）
    callback(null, 'upload')
  },
  // 确定文件名
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

// 得到multer对象  传入storage对象
const upload = multer({ storage })

// 挂载中间件
router.post('/upImg', upload.single('file'), (req, res) => {
  // 需要返回图片的访问地址    域名+文件名
  const url = 'http://localhost:8888/' + req.file.filename
  res.json({url})
})

module.exports = router
