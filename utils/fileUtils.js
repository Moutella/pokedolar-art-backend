const fs = require('fs')

function removeFile(filepath){
  fs.unlink(filepath)
}

module.exports = {
  removeFile
}