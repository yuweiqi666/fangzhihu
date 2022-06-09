const Router = require('koa-router')

const jwt = require('koa-jwt')

const { secret } = require('../../config')

const { find, create, findById, update, isAnswerExist, isAnswer, deleteAnswer } = require('../../controllers/answer')

const auth = jwt({ secret })

const router = new Router({
  prefix: '/answers'
})

// 获取答案列表
router.get('/', auth, find)

// 新增一个答案
router.post('/', auth, create)

// 获取答案的详情
router.get('/:id', auth, isAnswerExist, isAnswer, findById)

// 更新答案
router.put('/:id', auth, isAnswerExist, isAnswer, update)

// 删除答案
router.delete('/:id', auth, isAnswerExist, isAnswer, deleteAnswer)

module.exports = router