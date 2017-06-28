const path = require('path')
const shortId = require('shortid')
const bcrypt = require('bcrypt-nodejs')
const low = require('lowdb')

function Models () {
  this.db = low(path.join(__dirname, '../data/db.json'))
}

Models.prototype.defaults = function () {
  return {
    user: {},
    post: {},
    category: {}
  }
}

Models.prototype.user = function () {
  return {
    name: {
      type: 'text',
      default: '',
      required: true,
      data: function (data) {
        return data
      }
    },
    password: {
      type: 'password',
      default: '',
      required: true,
      data: function (data) {
        return bcrypt.hashSync(data)
      }
    },
    confirmPassword: {
      type: 'password',
      default: '',
      required: true,
      data: function (data) {
        return bcrypt.hashSync(data)
      }
    },
    access: {
      type: 'text',
      default: 1,
      required: false,
      data: function (data) {
        return data
      }
    }
  }
}

Models.prototype.post = function () {
  return {
    name: {
      type: 'text',
      default: '',
      required: true,
      data: function (data) {
        return data
      }
    },
    date: {
      type: 'date',
      default: '',
      required: false,
      data: function (data) {
        return data
      }
    },
    category: {
      type: 'checklist',
      default: '',
      required: false,
      values: () => {
        return this.db.get('category').value()
      },
      data: (data) => {
        return data
      }
    },
    link: {
      type: 'url',
      default: '',
      required: true,
      data: function (data) {
        return data
      }
    },
    content: {
      type: 'textarea',
      default: '',
      required: true,
      data: function (data) {
        return data
      }
    }
  }
}

Models.prototype.category = function () {
  return {
    name: {
      type: 'text',
      default: '',
      required: true,
      data: function (data) {
        return data
      }
    }
  }
}

module.exports = new Models()
