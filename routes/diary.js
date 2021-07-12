var express  = require('express');
var router = express.Router();
var Diary = require('../models/Diary');
var util = require('../util');
var moment = require('moment');

// Diary
router.get('/', function(req, res){
  Diary.find({}).sort( { "_id": -1 } ).exec(function(err, diary) {
    if(err) return res.json(err);
    res.render('diary/index', {diary:diary, time:moment().format('YYYY년 MM월 DD일') });
  });
});

//createdAt: moment(diary.createdAt).format('YYYY년 MM월 DD일') 

router.post('/new', util.isAdmin, function(req, res){
  var data = {
    title : req.body.title,
    body : req.body.body,
    createdAt: moment().format('YYYY년 MM월 DD일') 
  };
  Diary.create(data);
});

router.post('/delete', util.isAdmin, function(req, res){
  Diary.deleteOne({_id:req.body._id}, function(err){
    if(err) return res.json(err);
  });
});

module.exports = router;