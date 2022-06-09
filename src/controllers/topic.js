const Topic = require('../models/topic')

const User = require('../models/user')

const Question = require('../models/question')

class TopicCtl {
  // 校验话题必须存在
  async validateTopicExit (ctx, next) {
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) ctx.throw(404, '话题不存在')
    await next()
  }

  // 获取话题粉丝列表
  async getTopicFans (ctx) {
    const topicFans = await User.find({ followingTopics: ctx.params.id })
    ctx.body = topicFans
  }

  async find (ctx) {
    const { pageSize = 10, pageNum = 1 } = ctx.query
    // 话题列表分页
    const perPage = Math.max(+pageSize, 1)
    const pageIndex = Math.max(+pageNum, 1)
    const topic = await Topic.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip((pageIndex - 1) * perPage)
    ctx.body = topic
  }

  async findById (ctx) {
    const { id } = ctx.params
    const { fields = "" } = ctx.query
    const selectedFields = fields.split(';').map(item => ' +' + item).filter(f => f).join('')
    const topic = await Topic.findById(id).select(selectedFields)
    if (!topic) ctx.throw(404, '话题不存在')
    ctx.body = topic
  }

  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const { name } = ctx.request.body

    const existTopic = await Topic.findOne({ name })

    if (existTopic) ctx.throw(409, "话题已存在")

    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }

  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })

    const { id } = ctx.params

    const topic = await Topic.findById(id)

    if (!topic) ctx.throw(404, '话题不存在')

    const updateTopic = await Topic.findByIdAndUpdate(id, ctx.request.body)

    ctx.body = updateTopic
  }

  // 话题的问题列表
  async listQuestion (ctx) {
    const { id } = ctx.params
    const questions = await Question.find({ topics: id }).select('+topics').populate('topics')
    ctx.body = questions
  }
}


module.exports = new TopicCtl()