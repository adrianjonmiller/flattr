const low = require('lowdb')
const path = require('path')
const Models = require(path.join(__dirname, '../models'))
const lodashId = require('lodash-id')
const shortId = require('shortid')

function Data () {
  this.db = low(path.join(__dirname, './db.json'))
  this.db.defaults(Models.defaults()).write()
  this.db._.mixin(lodashId)
}

Data.prototype.create = function (ref, data, cb) {
  let id = shortId.generate()
  this.db.get(ref).set(id, data).write()
  cb(() => id)
}

Data.prototype.read = function (ref, query, cb) {
  if (typeof ref === 'function') {
    ref(() => this.db.value())
  } else if (typeof query === 'function') {
    query(() => this.db.get(ref).value())
  } else {
    cb(() => this.db.get(ref).find(query).value())
  }
}

Data.prototype.update = function (ref, data, cb) {
  this.db.set(ref, data).write()
  cb()
}

Data.prototype.delete = function (ref, data, cb) {
  this.db.unset(ref).write()
  cb()
}

module.exports = new Data()
