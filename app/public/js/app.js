const js = require('js-');
const moment = require('moment');
const endDate = moment("2021-01-20");
const today = moment().startOf('day');

window.Js = new js();

Js.lib.Days = function () {
  this.innerHTML = Math.round(moment.duration(endDate - today).asDays());
}

Js.lib.fieldset = function () {
  var fieldset = this
  var els = fieldset.querySelectorAll('input')

  Array.prototype.forEach.call(els, function (el) {
    var className = "has-focus";
    el.addEventListener('focus', function () {
      if (fieldset.classList)
        fieldset.classList.add(className);
      else
        fieldset.className += ' ' + className;
    })

    el.addEventListener('blur', function () {
      if (fieldset.classList)
        fieldset.classList.remove(className);
      else
        fieldset.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    })
  })

  setInterval(function(){
    Array.prototype.forEach.call(els, function (el, i) {
      var className = "has-content";

      if (el.value) {
        if (fieldset.classList)
          fieldset.classList.add(className);
        else
          fieldset.className += ' ' + className;
      } else {
        if (fieldset.classList)
          fieldset.classList.remove(className);
        else
          fieldset.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    });
  }, 100);
}

Js.lib.delete = function () {
  this.addEventListener('click', function () {
    xmlRequest('delete', window.location.pathname, function (response) {
      if (response === 'success') {
        window.location.replace('/admin');
      }
    })
  })
}


function xmlRequest(type, url, cb) {
  var request = new XMLHttpRequest();
  request.open(type, url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      if( typeof cb === 'function' ) {
        cb(request.responseText);
      }
    } else {
      console.log(request);
    }
  };

  request.onerror = function(errorMsg) {
    console.log(errorMsg);
  };

  request.send();
}
