module.exports = function( env ){

  var _env = env || 'production'

  var config = {
    development:{
      hostUrl: "http://localhost:3000"
    },
    production:{
      hostUrl: "http://spps-demo.herokuapp.com"
    }
  }

  return config[_env];
};
