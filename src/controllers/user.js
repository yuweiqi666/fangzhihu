const User = require('../models/user')

const Question = require('../models/question')

const Answer = require('../models/answer')

const jsonwebtoken = require('jsonwebtoken')

const { secret } = require('../config')

class UserCtl {
  async find (ctx) {
    const { pageSize = 10, pageNum = 1 } = ctx.query
    // 用户列表分页
    const perPage = Math.max(+pageSize, 1)
    const pageIndex = Math.max(+pageNum, 1)
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip((pageIndex - 1) * perPage);
  }

  async findById (ctx) {
    // 获取需要显示的字段
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').map(f => ' +' + f).filter(f => f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields).populate('following followingTopics')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async register (ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      },
      gender: {
        type: 'string',
        required: true
      }
    })

    const { name } = ctx.request.body
    const exitUser = await User.findOne({ name })
    if (exitUser) {
      ctx.throw(409, '用户名已存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  // 用户授权
  async checkOwner (ctx, next) {
    if (ctx.params.id !== ctx.state.user['_id']) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  // 校验用户必须存在
  async validateUserExist (ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    await next()
  }

  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      age: { type: 'string', required: false },
      avatar: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      location: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employment: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    })
    const { name = '' } = ctx.request.body
    const exitUser = await User.findOne({ name })
    if (exitUser) {
      ctx.throw(409, '用户名已存在')
    }

    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async deleteUser (ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })

    const user = await User.findOne(ctx.request.body)

    if (!user) {
      ctx.throw(401, '用户名或密码不正确')
    }

    const { _id, name } = user

    const token = jsonwebtoken.sign({ _id, name }, secret, {
      expiresIn: '1d'
    })

    ctx.body = { token }

  }

  // 获取用户关注列表
  async listFollowing (ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    ctx.body = user
  }

  // 获取用户粉丝列表
  async listFans (ctx) {
    const fans = await User.find({ following: ctx.params.id })
    ctx.body = fans
  }

  // 关注用户
  async followUser (ctx) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user['_id']).select('+following')
    if (!me.following.map(f => f.toString()).includes(id)) {
      me.following.push(id)
      await me.save()
    }
    ctx.status = 204
  }

  // 取消关注用户
  async unFollow (ctx) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user['_id']).select('+following')
    const index = me.following.map(f => f.toString()).indexOf(id)
    if (index > -1) {
      me.following.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }

  // 用户关注话题列表
  async followingTopicList (ctx) {
    const { id } = ctx.params
    const user = await User.findById(id).select('+followingTopics').populate('followingTopics')
    ctx.body = user.followingTopics
  }

  // 用户关注话题
  async followingTopic (ctx) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user['_id']).select('+followingTopics')
    if (!me.followingTopics.map(f => f.toString()).includes(id)) {
      me.followingTopics.push(id)
      await me.save()
    }
    ctx.status = 204
  }

  // 用户取消关注话题
  async unFollowingTopic (ctx) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user['_id']).select('+followingTopics')
    const index = me.followingTopics.map(f => f.toString()).indexOf(id)
    if (index > -1) {
      me.followingTopics.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }

  // 用户的问题列表
  async userQuestionList (ctx) {
    const { id } = ctx.params
    const questioner = await Question.find({ questioner: id })
    ctx.body = questioner
  }

  // 用户赞过的答案
  async listLikingAnswers (ctx) {
    const { id } = ctx.params
    const user = await User.findById(id).select('+likingAnswers').populate('likingAnswers')
    ctx.body = user.likingAnswers
  }

  // 对答案点赞
  async likeAnswer (ctx, next) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if (!me.likingAnswers.map(answer => answer.toString()).includes(id)) {
      me.likingAnswers.push(id)
      await me.save()
      await Answer.findByIdAndUpdate(id, { $inc: { voteCount: 1 } })
    }
    ctx.status = 204
    // 点赞和踩是互斥关系  在点赞答案的同时需要取消对答案的踩
    await next()
  }

  // 对答案取消点赞
  async unLikeAnswer (ctx) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const stringLikingAnswers = me.likingAnswers.map(answer => answer.toString())
    if (stringLikingAnswers.includes(id)) {
      const index = stringLikingAnswers.indexOf(id)
      me.likingAnswers.splice(index, 1)
      await me.save()
      await Answer.findByIdAndUpdate(id, { $inc: { voteCount: -1 } })
    }
    ctx.status = 204
  }

  // 用户踩过的答案
  async disListLikingAnswer (ctx) {
    const { id } = ctx.params
    const user = await User.findById(id).select('+disLikingAnswers').populate('disLikingAnswers')
    ctx.body = user.disLikingAnswers
  }

  // 对答案踩
  async disLikeAnswer (ctx, next) {
    const { id } = ctx.params

    const me = await User.findById(ctx.state.user._id).select('+disLikingAnswers')

    if (!me.disLikingAnswers.map(disAnswer => disAnswer.toString()).includes(id)) {
      me.disLikingAnswers.push(id)
      await me.save()
    }
    ctx.status = 204
    await next()
  }

  // 对答案取消踩
  async unDisLikeAnswer (ctx) {
    const { id } = ctx.params

    const me = await User.findById(ctx.state.user._id).select('+disLikingAnswers')

    const index = me.disLikingAnswers.indexOf(id)

    if (index > -1) {
      me.disLikingAnswers.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }


  // 用户收藏的答案列表
  async collectingAnswerList (ctx) {
    const { id } = ctx.params
    const user = await User.findById(id).select('+collectingAnswers').populate('collectingAnswers')
    ctx.body = user.collectingAnswers
  }

  // 对答案进行收藏
  async collectAnswer (ctx) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    if (!me.collectingAnswers.map(answer => answer.toString()).includes(id)) {
      me.collectingAnswers.push(id)
      await me.save()
    }
    ctx.status = 204
  }

  // 对答案取消收藏
  async unCollectAnswer (ctx) {
    const { id } = ctx.params
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    const index = me.collectingAnswers.map(answer => answer.toString()).indexOf(id)
    if (index > -1) {
      me.collectingAnswers.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }

}

module.exports = new UserCtl()