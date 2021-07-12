var mongoose = require('mongoose');

// schema
var DiarySchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required!']},
  body:{type:String, required:[true,'Body is required!']},
  createdAt:{type:String, required:[true,'createdAt is required!']}
});

DiarySchema.pre('save', async function (next){
  return next();
});

// model & export
var Diary = mongoose.model('diary', DiarySchema);
module.exports = Diary;
