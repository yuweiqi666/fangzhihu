const Koa = require('koa')

const { resolve } = require('path')

const bodyParser = require('koa-body')

const koaStatic = require('koa-static')

const error = require('koa-json-error')

const parameter = require('koa-parameter')

const mongoose = require('mongoose')

const { connectionStr } = require('./config')

const app = new Koa()

// mongodb数据库连接
mongoose.connect(connectionStr, () => {
  console.log('mongodb connect success...')
})

mongoose.connection.on('error', console.error)

// 导入项目路由
const routing = require('./routes')

app.use(koaStatic(resolve(__dirname, './public')))

// 错误处理中间件
app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

// 获取传参
app.use(bodyParser({
  // 支持文件/图片上传
  multipart: true,
  formidable: {
    // 上传文件地址
    uploadDir: resolve(__dirname, './public/uploads'),
    // 保留文件拓展名
    keepExtensions: true
  }
}))

// 参数校验
app.use(parameter(app))

// 路由中间件
routing(app)

app.listen(3000, () => {
  console.log('server running...')
})
