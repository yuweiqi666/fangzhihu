const { Schema, model } = require('mongoose')

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatar: { type: String },
  introduction: { type: String, select: false },
  following: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], select: false }
})


module.exports = model('Topic', topicSchema)