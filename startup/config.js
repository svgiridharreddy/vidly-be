const config = require('config');

module.exports = function(){
  // load the environment variable at the time of application start. If no env variable is found app should not be run. This to make sure to send JWT Token in response.
  console.log("private key is :",config.get("jwtPrivateKey")) // variable is not loading from environment variables. By passing using staic key loaded from development.json config file
  if(!config.get("jwtPrivateKey")){
    throw new Error("Fatal Error: jwtPrivate key is not defined");
  } 
}