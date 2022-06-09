const path = require('path')

class HomeCtl {
  index (ctx) {
    ctx.body = '这是主页'
  }

  upload (ctx) {
    const file = ctx.request.files.file
    // 获取文件名称加拓展名
    const basename = path.basename(file.filepath)
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`
    }
  }
}


module.exports = new HomeCtl()

