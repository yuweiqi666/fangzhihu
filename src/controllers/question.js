const Question = require('../models/question')

class QusetionCtl {
  async find (ctx) {
    const { pageSize = 10, pageNum = 1 } = ctx.query
    const pageIndex = Math.max(pageNum, 1)
    const perPage = Math.max(pageSize, 1)
    const question = await Question.find().limit(perPage).skip((pageIndex - 1) * perPage)
    ctx.body = question
  }

  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const question = await Question.findById(ctx.params.id).select(selectedFields).populate('questioner topics')
    ctx.body = question
  }

  async isQuestionExist (ctx, next) {
    const { id } = ctx.params
    const question = await Question.findById(id).select('+questioner')
    if (!question) ctx.throw(404, '问题不存在')
    ctx.state.question = question
    await next()
  }

  async checkQuestioner (ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user['_id']) ctx.throw(403, "没有权限")
    await next()
  }


  async create (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      desc: { type: 'string', required: true },
      questioner: { type: 'string', required: true }
    })

    const { title } = ctx.request.body

    const isExistQuestion = await Question.findOne({ title })

    if (isExistQuestion) ctx.throw(409, '问题已存在')


    const question = await new Question(ctx.request.body).save()

    ctx.body = question
  }

  async updateQuestion (ctx) {
    const { id } = ctx.params
    ctx.verifyParams({
      title: { type: 'string', required: false },
      desc: { type: 'string', required: false },
      topics: { type: 'array', itemType: 'string', required: false }
    })
    const question = await Question.findByIdAndUpdate(id, ctx.request.body)
    ctx.body = question
  }

  async deleteQuestion (ctx) {
    const { id } = ctx.params
    const question = await Question.findByIdAndRemove(id)
    ctx.body = question
  }
}



module.exports = new QusetionCtl()