const { Schema, model } = require('mongoose')

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
  topics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  }
})


module.exports = model('Question', questionSchema)