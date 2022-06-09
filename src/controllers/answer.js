const Answer = require('../models/answer')

class AnswerCtl {
  // 校验回答是否存在
  async isAnswerExist (ctx, next) {
    const { id } = ctx.params
    const answerer = await Answer.findById(id).select('+answerer')
    if (!answerer) ctx.throw(404, '回答不存在')
    ctx.state.answerer = answerer
    await next()
  }
  //校验是不是回答的作者
  async isAnswer (ctx, next) {
    const { answerer } = ctx.state.answerer
    if (answerer.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }

  async find (ctx) {
    const { pageSize, pageNum } = ctx.query
    const pageIndex = Math.max(pageNum, 1)
    const perPage = Math.max(pageSize, 1)
    const answer = await Answer.find().limit(perPage).skip((pageIndex - 1) * perPage)
    ctx.body = answer
  }

  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      answerer: { type: 'string', required: true },
      questionId: { type: 'string', required: true }
    })
    const answer = await new Answer(ctx.request.body).save()
    ctx.body = answer
  }

  async findById (ctx) {
    const { id } = ctx.params
    const { fields = '' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const answer = await Answer.findById(id).select(selectedFields).populate('answerer')
    ctx.body = answer
  }

  async update (ctx) {
    const { id } = ctx.params
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    const answer = await Answer.findByIdAndUpdate(id, ctx.request.body)
    ctx.body = answer
  }

  async deleteAnswer (ctx) {
    const { id } = ctx.params
    const answer = await Answer.findByIdAndRemove(id)
    ctx.body = answer
  }

}

module.exports = new AnswerCtl()