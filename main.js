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
  var uuid = require('node-uuid');
  var _generator;

  // Environment Settings
  var env = process.env.NODE_ENV;

  var CONFIG = require('./config')(env);
  var SERVER_URL = CONFIG.hostUrl;

  var EventEmitter = require('events').EventEmitter;
  var ev = new EventEmitter();

  function init(generator) {
    _generator = generator;

    function initLater() {

      // Get data from Photoshop via _generator.getDocumentInfo
      //requestEntireDocument();
      generator.addMenuItem("fp", "First Plugin", true, false);


      connect();

    }
    process.nextTick(initLater);

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
  /*********** Socket ***********/
  function connect(){
    console.log('connecting to ' + SERVER_URL);
    var socket = require('socket.io-client')( SERVER_URL);
    socket.on('connect', function(){
      console.log("connected");

      socket.on('chat message', function(data){
        var ext = require('path').extname(data.name);
        var uuidV4 = uuid.v4();
        var filename = uuidV4 + ext;
        var maxSize = data.maxSize || 300;
        var imageBuffer = new Buffer(data.file, 'base64'); //console = <Buffer 75 ab 5a 8a ...
        require('fs').writeFile( __dirname + "/upload/" + filename, imageBuffer, function(err){
          if( !err ){
            show(filename, maxSize);
          }
        });
      });
      socket.on('disconnect', function(){
        console.log('disconnected');
      });
    });
  }

  function show(filename, maxLength){
    var fs = require('fs');
    var ECT = require('ect');

    var _maxLength = maxLength || 400; // 何も入力がなければ400pxサイズにする
    var uploadDirPath = __dirname + '/upload';

    var renderer = ECT({ root : __dirname + '/photoshop_scripts' });
    var data = { fname : filename, maxLength: _maxLength, uploadDirPath: uploadDirPath };
    var html = renderer.render('template.ect', data);

    _generator.evaluateJSXString(html);

    return;
  }

  exports.init = init;

}());
