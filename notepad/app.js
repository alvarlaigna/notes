'use strict';

var _ = require('substance/util/helpers');
var $ = window.$ = require('substance/util/jquery');
var Component = require('substance/ui/Component');
var CollabSession = require('substance/model/CollabSession');

var Notepad = require('./Notepad');
var Note = require('../note/Note');

$(function() {

  var doc = new Note();

  // EXPERIMENTAL: with server.serveHTML it is now possible to
  // provide dynamic configuration information via HTML meta tags
  // TODO: we want this to go into a Substance util helper
  var config = {};
  var metaTags = window.document.querySelectorAll('meta');

  _.each(metaTags, function(tag) {
    var name = tag.getAttribute('name');
    var content = tag.getAttribute('content');
    if (name && content) {
      config[name] = content;
    }
  });

  var host = config.host || 'localhost';
  var port = config.port || 5000;
  var wsUrl;
  if (config.NODE_ENV === 'production') {
    // we assume that we have a http/websocket prox running on the host
    // i.e. port is only used on localhost
    wsUrl = 'ws://'+host;
  } else {
    wsUrl = 'ws://'+host+':'+port;
  }
  console.log('WebSocket-URL:', wsUrl);
  var ws = new WebSocket(wsUrl);
  var session = new CollabSession(doc, ws, {
    docId: 'note-1',
    docVersion: 0
  });

  // For debugging in the console
  window.doc = doc;
  window.session = session;

  session.on('connected', function() {
    Component.mount(Notepad, {
      documentSession: session,
    }, document.getElementById('editor_container'));
  });


});