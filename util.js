var util = {};

util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'이미 사용중인 이름 입니다.' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else {
    req.flash('errors', {login:'로그인이 필요합니다.'});
    res.redirect('/login');
  }
}

util.isAdmin = function(req, res, next) {
  if(req.user.id == "60e3c47a7ea3eab848d1b634" || req.user.id == "60e552f90b9b211c71a3b637" ){
    next();
  } else {
    req.flash('errors', {login:'관리자 계정으로 로그인 하십시오.'});
    res.redirect('/login');
  }
}

util.noPermission = function(req, res){
  req.flash('errors', {login:"권한이 없습니다."});
  req.logout();
  res.redirect('/login');
}

util.getPostQueryString = function(req, res, next){
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){
    var queryString = '';
    var queryArray = [];
    var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
    var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
    var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
    var searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:'');

    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);
    if(searchType) queryArray.push('searchType='+searchType);
    if(searchText) queryArray.push('searchText='+searchText);

    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

    return queryString;
  }
  next();
}

util.convertToTrees = function(array, idFieldName, parentIdFieldName, childrenFieldName){
  var cloned = array.slice();

  for(var i=cloned.length-1; i>-1; i--){
    var parentId = cloned[i][parentIdFieldName];

    if(parentId){
      var filtered = array.filter(function(elem){
        return elem[idFieldName].toString() == parentId.toString();
      });

      if(filtered.length){
        var parent = filtered[0];

        if(parent[childrenFieldName]){
          parent[childrenFieldName].unshift(cloned[i]);
        }
        else {
          parent[childrenFieldName] = [cloned[i]];
        }

      }
      cloned.splice(i,1);
    }
  }

  return cloned;
}

util.wrapAsync = function(fn) {
  return function (req, res, next) {
    // 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달
    // (이 경우에는 오류 처리기)
    fn(req, res, next).catch(next);
  };
}

module.exports = util;
