var express  = require('express');
var router = express.Router();
var Post = require('../models/Post');
var User = require('../models/User');
var Comment = require('../models/Comment');
var util = require('../util');

// Home
router.get('/', function(req, res){
  res.render('diary/index');
});
router.get('/edit', function(req, res){
  res.render('diary/edit');
});

router.get('/new', function(req, res){
  res.render('diary/new');
});

module.exports = router;