const Router = require('koa-router')

const { secret } = require('../../config')

const jwt = require('koa-jwt')


const { find, create, findById, deleteComment, update } = require('../../controllers/comment')

const auth = jwt({
  secret
})

const router = new Router({
  prefix: '/comments'
})

// 获取所有的评论列表
router.get('/', auth, find)

// 新增一个评论
router.post('/', auth, create)

// 查看评论的详情
router.get('/:id', auth, findById)

// 删除评论
router.delete('/:id', auth, deleteComment)

// 更新一个评论
router.put('/:id', auth, update)

module.exports = router