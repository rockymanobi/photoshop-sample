var fs;

fs = require('fs');

module.exports = function( event ){
  return {
    post: function(req, res) {

      var fstream;
      var maxLength;
      req.pipe(req.busboy);
      req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        if( fieldname === "max-length" ){
          maxLength = val;
        }
      });
      req.busboy.on('file', function (fieldname, file, filename) {
          console.log("Uploading: " + filename); 
          fstream = fs.createWriteStream(__dirname + '/../upload/' + filename);
          file.pipe(fstream);
          fstream.on('close', function () {
            // TODO: maxLengthの代入が危険すぎるので注意ね
            event.emit('kicked', filename, maxLength );
            res.redirect('back');
          });
      });
    }
  }
}
