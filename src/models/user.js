const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  "__v": { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  age: { type: Number, default: 0 },
  avatar: { type: String, select: false },
  gender: { type: String, enum: ['male', 'female'], default: 'male', required: true },
  headline: { type: String, select: false },
  location: { type: [{ type: String }], select: false },
  business: { type: String, select: false },
  employments: { type: [{ company: { type: String }, job: { type: String } }], select: false },
  educations: {
    type: [{
      school: { type: String },
      major: { type: String },
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
      entrance_year: { type: Number },
      graduation_year: { type: Number },

    }],
    select: false
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false
  },
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  },
  likingAnswers: { type: [{ type: Schema.Types.ObjectId }], ref: 'Answer', select: false },
  disLikingAnswers: { type: [{ type: Schema.Types.ObjectId }], ref: 'Answer', select: false },
  collectingAnswers: { type: [{ type: Schema.Types.ObjectId }], ref: 'Answer', select: false }
})

module.exports = model('User', userSchema)

