const awssdk = require('aws-sdk')
const serverConfig = require("../config")
const fs = require('fs')
class AWSUtils{
  constructor(){
    this.s3 = new awssdk.S3({accessKeyId: serverConfig.AWS_KEY, secretAccessKey: serverConfig.AWS_SECRET})
  }

  putFile(file, path){
    let params = {
      Bucket: serverConfig.AWS_BUCKET,
      Key: path,
      Body: fs.readFileSync(file)
    }
    this.s3.putObject(params, function (err, data) {
      console.log(data)
      console.log(err)
      if (err) throw "falha de upload";
    });
  }
}

module.exports = AWSUtils