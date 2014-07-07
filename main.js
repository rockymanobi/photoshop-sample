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

  var EventEmitter = require('events').EventEmitter;
  var ev = new EventEmitter();

  function init(generator) {
    console.log( _ );
    _generator = generator;
    console.log("Hello world");

    function evHoge( filename, maxLength ){
      console.log("yhaaaa");
      show( filename, maxLength );
    }


    function initLater() {

      console.log("init later");

      // Get data from Photoshop via _generator.getDocumentInfo
      //requestEntireDocument();
      generator.addMenuItem("fp", "First Plugin", true, false);

      // Register events on Photoshop
      _generator.onPhotoshopEvent("currentDocumentChanged", handleCurrentDocumentChanged);
      _generator.onPhotoshopEvent("imageChanged", handleImageChanged);
      _generator.onPhotoshopEvent("toolChanged", handleToolChanged);

      ev.on('kicked', evHoge );

    }
    process.nextTick(initLater);
    process.nextTick(listening);



  }


  /*********** EVENTS ***********/

  function handleCurrentDocumentChanged(id) {
    console.log("handleCurrentDocumentChanged: "+id)
    //setCurrentDocumentId(id);
  }

  function handleImageChanged(document) {
    console.log("Image " + document.id + " was changed:");//, stringify(document));
  }

  function handleToolChanged(document){
    console.log("Tool changed " + document.id + " was changed:");//, stringify(document));
  }
  /*********** HELPERS ***********/


  function sendJavascript(str){
      _generator.evaluateJSXString(str).then(
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
      console.log( req.param("ababa") );
      console.log( req.param("image") );
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
    console.log(html);

    _generator.evaluateJSXString(html);

    return;
    // fs.unlink( __dirname + '/upload/' + filename , function (err) {
    //   if (err) throw err;
    //   console.log('successfully deleted /tmp/hello');
    // });


    //fs.readFile(__dirname + "/photoshop.txt", "utf-8", function (err, txt) {
    //    var JSX = txt;
    //    console.log( __dirname )
    //    console.log( txt );
    //    console.log(err)
    //   _generator.evaluateJSXString(JSX);
    //    console.log("hoge")
    //    //console.dir( res );
    //})
  }




  exports.init = init;



}());
