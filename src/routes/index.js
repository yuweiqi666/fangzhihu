const fs = require('fs')

const { resolve } = require('path')

module.exports = (app) => {
  fs.readdirSync(resolve(__dirname, 'modules')).forEach(file => {

    const router = require(`./modules/${file}`)

    app.use(router.routes()).use(router.allowedMethods())

  })

}