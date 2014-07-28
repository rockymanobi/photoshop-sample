
var fs = require('fs');
var moment = require('moment');
module.exports = function(){

  return function(){
    var current = moment(new Date());
    var dir = __dirname + "/upload/";

    fs.readdir(dir, function(err, files){
      files.filter(function(file){
        var stat = fs.statSync(dir + file);
        var timestamp = moment(stat.ctime) ;
        return file !== ".gitkeep" && stat.isFile() && current.diff( timestamp, 'seconds') > 120;
      }).forEach(function (file) {
        fs.unlink( dir + file );
        //console.log("[" + file  + "]");
      });
    });

  }
}();
