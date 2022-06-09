const Router = require('koa-router')

// const { checkOwner } = require('../../controllers/user')
const jwt = require('koa-jwt')

const { secret } = require('../../config')

const { find, create, findById, update, getTopicFans, validateTopicExit, listQuestion } = require('../../controllers/topic')

const router = new Router({
  prefix: '/topic'
})
const auth = jwt({ secret })


router.get('/', auth, find)

router.get('/:id', auth, validateTopicExit, findById)

router.post('/create', auth, create)

router.put('/update/:id', auth, validateTopicExit, update)

router.get('/:id/topicfans', auth, validateTopicExit, getTopicFans)

router.get('/:id/listQuestion', listQuestion)


module.exports = router