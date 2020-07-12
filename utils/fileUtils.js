const fs = require('fs')

function removeFile(filepath){
  fs.unlink(filepath)
}

function renameFile(file, newpath){
  fs.renameSync(file, newpath)
}

function removeFolder(folderpath){
  fs.rmdirSync(folderpath, {recursive: true})
}
module.exports = {
  removeFile,
  renameFile,
  removeFolder
}