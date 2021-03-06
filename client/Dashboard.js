'use strict';

var DocumentClient = require('./NotesDocumentClient');
var Err = require('substance/util/Error');
var Header = require('./Header');
var Button = require('substance/ui/Button');
var Layout = require('substance/ui/Layout');
var Component = require('substance/ui/Component');
var NoteItem = require('./NoteItem');

function Dashboard() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });
}

Dashboard.Prototype = function() {

  this.didMount = function() {
    this._loadDocuments();
  };

  this.willReceiveProps = function() {
    this._loadDocuments();
  };

  this.render = function($$) {
    var noteItems = this.state.noteItems;
    var el = $$('div').addClass('sc-dashboard');

    el.append($$(Header, {
      actions: {
        'newNote': 'New Note'
      }
    }));

    if (!noteItems) {
      return el;
    }

    if (noteItems.length > 0) {
      el.append(this.renderFull($$));
    } else {
      el.append(this.renderEmpty($$));
    }
    return el;
  };

  this.renderEmpty = function($$) {
    var layout = $$(Layout, {
      width: 'medium',
      textAlign: 'center'
    });

    layout.append(
      $$('h1').html(
        'Almost there'
      ),
      $$('p').html('Create your first note now. Then invite colleagues and friends to view and edit it simultaneously — just share the URL!'),
      $$(Button).addClass('se-new-note-button').append('Create new note')
        .on('click', this.send.bind(this, 'newNote'))
    );

    return layout;
  };

  this.renderFull = function($$) {
    var noteItems = this.state.noteItems;
    var layout = $$(Layout, {
      width: 'large'
    });

    layout.append(
      $$('div').addClass('se-intro').append(
        $$('div').addClass('se-note-count').append(
          'Showing ',
          noteItems.length.toString(),
          ' notes'
        ),
        $$(Button).addClass('se-new-note-button').append('New Note')
          .on('click', this.send.bind(this, 'newNote'))
      )
    );

    if (noteItems) {
      noteItems.forEach(function(noteItem) {
        layout.append(
          $$(NoteItem, noteItem)
        );
      });
    }
    return layout;
  };

  this._getUserId = function() {
    var authenticationClient = this.context.authenticationClient;
    var user = authenticationClient.getUser();
    return user.userId;
  };

  this._getUserName = function() {
    var authenticationClient = this.context.authenticationClient;
    var user = authenticationClient.getUser();
    return user.name;
  };

  /*
    Loads documents
  */
  this._loadDocuments = function() {
    var self = this;
    var documentClient = this.documentClient;
    var userId = this._getUserId();

    documentClient.listUserDashboard(userId, function(err, notes) {
      if (err) {
        this.setState({
          error: new Err('Dashboard.LoadingError', {
            message: 'Documents could not be loaded.',
            cause: err
          })
        });
        console.error('ERROR', err);
        return;
      }

      self.extendState({
        noteItems: notes
      });
    }.bind(this));
  };
};

Component.extend(Dashboard);

module.exports = Dashboard;