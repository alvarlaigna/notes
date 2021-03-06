'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var filter = require('lodash/filter');
var size = require('lodash/size');
var moment = require('moment');

var NoteSummary = function() {
  NoteSummary.super.apply(this, arguments);
};

NoteSummary.Prototype = function() {

  this.render = function($$) {
    var doc = this.context.controller.getDocument();
    var noteInfo = this.props.noteInfo.props;

    var updatedAt = moment(noteInfo.updatedAt).fromNow();
    var commentsQt = size(doc.getIndex('type').get('comment'));
    var commentsLabel = commentsQt == 1 ? 'comment' : 'comments';
    var issueIndex = doc.getIndex('type').get('todo');
    var issuesQt = size(issueIndex);
    var resolvedQt = size(filter(issueIndex, function(i){return i.done;}));

    var el = $$('div').addClass('sc-note-summary');
    if (this.props.mobile) {
      el.addClass('sm-mobile');
    }

    el.append(
      $$('div').addClass('se-item').append(
        $$(Icon, {icon: "fa-comment-o"}),
        ' ' +commentsQt + ' ' + commentsLabel
      ),
      $$('div').addClass('se-item').append(
        $$(Icon, {icon: "fa-check-square-o"}),
        $$('div').addClass('se-issues-bar').append(
          $$('div').addClass('se-completed')
            .setAttribute('style', 'width: ' + resolvedQt/issuesQt*100 + '%')
        ),
        resolvedQt + ' of ' + issuesQt
      ),
      $$('div').addClass('se-item').append(
        'Updated ',
        updatedAt,
        ' by ',
        noteInfo.updatedBy
      )
    );
    return el;
  };
};

Component.extend(NoteSummary);

module.exports = NoteSummary;