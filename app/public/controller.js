const flatfile = require('flatfile')
const path = require('path')
const fs = require('fs')

// Data Model Templates
const models = require(path.join(__dirname, '../models'))

function Data() {
  this.data = path.join(__dirname, '../data')
}

Data.prototype.exists = function (path, cb) {
  path.split('/').forEach((item) => {
    if(fs.existsSync(`${this.data}/${item}.json`)) {
      cb(`${this.data}/${item}.json`)
      return
    } else {
      fs.writeFile(`${this.data}/${item}.json`, '{}', function () {
        cb(`${this.data}/${item}.json`)
      })
      return
    }
  })
}

Data.prototype.get = function (filePath, cb) {
  this.exists(filePath, (path) => {
    flatfile.db(`${path}`, (err, data) => {
      if (err) throw err
      cb(() => data)
    })
  })
}

Data.prototype.getAll = function (cb) {
  let data = {}
  this.modelAll((models) => {
    models().forEach((el, i) => {
      this.get(el, function (snapShot) {
        data[el] = snapShot()
        if (i === models().length - 1) {
          cb(() => data)
        }
      })
    })
  })
}

Data.prototype.modelAll = function (cb) {
  cb(() => Object.keys(models))
}

Data.prototype.model = function (type, cb) {
  cb(() => models[type]())
}

module.exports = new Data()
