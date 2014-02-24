function ensureAuthenticated(req, res, next) {
	
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')

}

function HTMLEncode(str){
  
  var i = str.length,
      aRet = [];

  while (i--) {
    var iC = str[i].charCodeAt();
    if (iC < 0 || iC > 127) {
      aRet[i] = '&#'+iC+';';
    } else {
      aRet[i] = str[i];
    }
   }
  return aRet.join('');
  //return unescape(encodeURIComponent(str));
      
}

module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.HTMLEncode = HTMLEncode;
