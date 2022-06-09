const Router = require('koa-router')

const { find, findById, create, deleteQuestion, updateQuestion, isQuestionExist, checkQuestioner } = require('../../controllers/question')

const { checkOwner } = require('../../controllers/user')

const { secret } = require('../../config')

const jwt = require('koa-jwt')

const auth = jwt({ secret })

const router = new Router({
  prefix: '/questions'
})

// 获取问题列表
router.get('/', auth, find)

// 根据问题id获取问题详情
router.get('/:id', auth, findById)

// 新增问题
router.post('/create', auth, checkQuestioner, create)

// 更新问题
router.put('/:id/update', auth, isQuestionExist, checkQuestioner, updateQuestion)

// 删除问题
router.delete('/:id', auth, isQuestionExist, checkQuestioner, deleteQuestion)


module.exports = router