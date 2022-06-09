const Comment = require('../models/comment')

class commentCtl {
  async find (ctx) {
    const commentList = await Comment.find().populate('commenter replyTo')
    ctx.body = commentList
  }

  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      commenter: { type: 'string', required: true },
      questionId: { type: 'string', required: true },
      answerId: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false }
    })
    const comment = await new Comment(ctx.request.body).save()
    ctx.body = comment
  }

  async findById (ctx) {
    const { id } = ctx.params
    const comment = await Comment.findById(id).populate('commenter')
    ctx.body = comment
  }

  async update (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const { id } = ctx.params
    const { content } = ctx.request.body
    const comment = await Comment.findByIdAndUpdate(id, { content })
    ctx.body = comment
  }


  async deleteComment (ctx) {
    const { id } = ctx.params
    const comment = await Comment.findByIdAndRemove(id)
    ctx.body = comment
  }
}


module.exports = new commentCtl()