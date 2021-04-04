const fs = require('fs')

function removeFile(filepath){
  fs.unlinkSync(filepath)
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