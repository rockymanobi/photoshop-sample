/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

(function () {

  var _ = require('underscore');
  var _generator;

  // Environment Settings
  var env = process.env.NODE_ENV;
  var ENVIRONMENT = {
    development: "development"
  };
  var envIsDevelopent = env === ENVIRONMENT.development;

  var EventEmitter = require('events').EventEmitter;
  var ev = new EventEmitter();

  function init(generator) {
    _generator = generator;

    function evHoge( filename, maxLength ){
      show( filename, maxLength );
    }


    function initLater() {

      // Get data from Photoshop via _generator.getDocumentInfo
      //requestEntireDocument();
      generator.addMenuItem("fp", "First Plugin", true, false);

      // Register events on Photoshop
      ev.on('kicked', evHoge );

    }
    process.nextTick(initLater);
    process.nextTick(listening);

  }


  /*********** HELPERS ***********/

  function sendJavascript(str){
      _generator.evaluateJSXString(str)
      .then(
          function(result){
              console.log(result);
          },
          function(err){
              console.log(err);
          });
  }


 

  function listening(){
    var express = require('express');
    var bodyParser     = require('body-parser');
    var methodOverride = require('method-override');
    var busboy = require('connect-busboy');
    

    var exApp = express();
    exApp.use(busboy()); 
    exApp.use(methodOverride());


    var routes = {
      upload : require('./routes/upload')(ev)
    };

    exApp.get('/', function(req, res){
      res.sendfile( __dirname + '/index.html');
    });
    exApp.post('/upload', routes.upload.post );

    exApp.post('/postimage', function(req, res){
      res.sendfile('./test/plugins/my-plugin/index.html');
      //sendJavascript("alert( 'ALERT FROM BROWSER!! ' );");
      // connect-form adds the req.form object
      // we can (optionally) define onComplete, passing
      // the exception (if any) fields parsed, and files parsed
    });
    var server = exApp.listen(3000, function() {
      var port = server.address().port;

      require('dns').lookup( require('os').hostname(), function( err, add, fam){
        console.log( 'listening on ' + add + ':' + port );
      });


    });
  }


  function show(filename, maxLength){
    var fs = require('fs');
    //fs.readFile(testurl)

    var _maxLength = maxLength || 400; // 何も入力がなければ400pxサイズにする
    var uploadDirPath = __dirname + '/upload';

    var ECT = require('ect');
    var renderer = ECT({ root : __dirname + '/photoshop_scripts' });
    var data = { fname : filename, maxLength: _maxLength, uploadDirPath: uploadDirPath };
    var html = renderer.render('template.ect', data);

    _generator.evaluateJSXString(html);

    return;
  }




  exports.init = init;



}());
