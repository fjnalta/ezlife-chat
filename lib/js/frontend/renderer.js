'use strict'

const fs = require('fs');
const path = require('path');
const app = require('electron').remote.app;
const cheerio = require('cheerio');

window.$ = window.jQuery = require('jquery');
window.Tether = require('tether');
window.Bootstrap = require('bootstrap');

let webRoot = path.join(app.getAppPath(), 'lib', 'js', 'frontend');
//let webRoot = path.dirname(__dirname)
window.view = require(path.join(webRoot, 'view.js'))
window.model = require(path.join(webRoot, 'model.js'))
//window.model.db = path.join(app.getPath('userData'), 'example.db')

// Compose the DOM from separate HTML
let htmlPath = path.join(app.getAppPath(), 'lib','view');
let body = fs.readFileSync(path.join(htmlPath, 'body.html'), 'utf8');
let contactList = fs.readFileSync(path.join(htmlPath, 'contactList.html'), 'utf8');
let messageWindow = fs.readFileSync(path.join(htmlPath, 'messageWindow.html'), 'utf8');
let footer = fs.readFileSync(path.join(htmlPath, 'footer.html'), 'utf8');

// Create DOM
let O = cheerio.load(body);
// TODO - create IDs to append HTML to body
O('#contactList').append(contactList);
O('#messageWindow').append(messageWindow);
O('#footer').append(footer);

// Pass DOM to jQuery
let dom = O.html();
$('body').html(dom);

$('document').ready(function () {
//  window.model.getPeople()
//  $('#edit-person-submit').click(function (e) {
//    e.preventDefault()
//    let ok = true
//    $('#first_name, #last_name').each(function (idx, obj) {
//      if ($(obj).val() === '') {
//        $(obj).removeClass('is-valid').addClass('is-invalid')
//        ok = false
//      } else {
//        $(obj).addClass('is-valid').removeClass('is-invalid')
//      }
//    })
//    if (ok) {
//      $('#edit-person-form').addClass('was-validated')
//      let formId = $(e.target).parents('form').attr('id')
//      let keyValue = window.view.getFormFieldValues(formId)
//      window.model.saveFormData('people', keyValue, function () {
//        window.model.getPeople()
//      })
//    }
//  })
});