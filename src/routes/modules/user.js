const Router = require('koa-router')

const {
  find,
  findById,
  register,
  update,
  deleteUser,
  login,
  checkOwner,
  listFollowing,
  followUser,
  unFollow,
  listFans,
  validateUserExist,
  followingTopic,
  followingTopicList,
  unFollowingTopic,
  userQuestionList,
  listLikingAnswers,
  likeAnswer,
  unLikeAnswer,
  disListLikingAnswer,
  disLikeAnswer,
  unDisLikeAnswer,
  collectingAnswerList,
  collectAnswer,
  unCollectAnswer
} = require('../../controllers/user')

const { validateTopicExit } = require('../../controllers/topic')

const jwt = require('koa-jwt')

const { secret } = require('../../config')

const router = new Router({
  prefix: '/users'
})

const auth = jwt({ secret })


// 注册
router.post('/register', register)

// 登陆
router.post('/login', login)

// 获取用户列表
router.get('/', auth, find)

// 根据用户id查找用户
router.get('/:id', auth, checkOwner, findById)

// 修改用户信息
router.put('/:id', auth, checkOwner, update)

// 删除用户
router.delete('/:id', auth, checkOwner, deleteUser)

// 获取用户关注列表
router.get('/:id/following', auth, checkOwner, listFollowing)

// 获取用户粉丝列表
router.get('/:id/fans', auth, checkOwner, listFans)

// 关注用户
router.post('/:id/following', auth, validateUserExist, followUser)

// 取消关注
router.delete('/:id/unfollowing', auth, validateUserExist, unFollow)

// 用户关注话题
router.post('/:id/followingTopic', auth, validateTopicExit, followingTopic)

// 用户取消关注话题
router.delete('/:id/unFollowingTopic', auth, validateTopicExit, unFollowingTopic)

// 获取用户关注话题列表
router.get('/:id/followingTopicList', auth, checkOwner, followingTopicList)

// 获取用户问题列表
router.get('/:id/userQuestionList', auth, checkOwner, userQuestionList)

// 用户的赞过的答案列表
router.get('/likeAnswersList/:id', auth, listLikingAnswers)

// 对答案点赞
router.post('/likeAnswers/:id', auth, likeAnswer, unDisLikeAnswer)

// 对答案取消点赞
router.post('/unLikeAnswers/:id', auth, unLikeAnswer)

// 用户踩过的答案列表
router.get('/disLikeAnswerList/:id', auth, disListLikingAnswer)

// 对答案踩
router.post('/disLikeAnswer/:id', auth, disLikeAnswer, unLikeAnswer)

// 对答案取消踩
router.post('/unDisLikeAnswer/:id', auth, unDisLikeAnswer)

// 用户的收藏答案列表
router.get('/collectAnswerList/:id', auth, collectingAnswerList)

// 收藏答案
router.post('/collectAnswer/:id', auth, collectAnswer)

// 取消收藏答案
router.post('/unCollectAnswer/:id', auth, unCollectAnswer)

module.exports = router