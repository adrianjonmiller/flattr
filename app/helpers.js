const _ = require('lodash')
const pluralize = require('pluralize')

module.exports = {
  reverse: function (arguments) {
    return _.reverse(_.values(arguments))
  },
  camelToSentence: function (key) {
    if (key) {
      var result = key.replace( /([A-Z])/g, " $1" );
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
  },
  createUid: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },
  equal: function () {
    return arguments[0] === arguments[1]
  },
  hasValue: function (item, array) {
    console.log(array.includes(item))
    return array.includes(item)
  },
  inputs: function (arguments) {
    return 'inputs/' + arguments
  },
  pluralize: function (word) {
    return pluralize(word)
  },
  var: function(name, value, context) {
    this[name] = value;
  }
}
