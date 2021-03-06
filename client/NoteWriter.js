'use strict';

var Controller = require('substance/ui/Controller');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Icon = require('substance/ui/FontAwesomeIcon');
var Toolbar = require('substance/ui/Toolbar');
var Layout = require('substance/ui/Layout');
var Cover = require('./Cover');
var UndoTool = require('substance/ui/UndoTool');
var RedoTool = require('substance/ui/RedoTool');
var SwitchTextTypeTool = require('substance/packages/text/SwitchTextTypeTool');
var StrongTool = require('substance/packages/strong/StrongTool');
var EmphasisTool = require('substance/packages/emphasis/EmphasisTool');
var LinkTool = require('substance/packages/link/LinkTool');
var CodeTool = require('substance/packages/code/CodeTool');
var ImageTool = require('substance/packages/image/ImageTool');
var MarkTool = require('./MarkTool');
var TodoTool = require('./TodoTool');
var CommentTool = require('./CommentTool');

function NoteWriter() {
  Controller.apply(this, arguments);
}

NoteWriter.Prototype = function() {

  // Custom Render method for your editor
  this.render = function($$) {
    var config = this.getConfig();
    return $$('div').addClass('sc-note-writer').append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        // Top area (toolbar)
        $$('div').addClass('se-toolbar-wrapper').append(
          $$(Layout, {width: 'large', noPadding: true}).append(
            $$(Toolbar).append(
              $$(Toolbar.Group).append(
                $$(SwitchTextTypeTool, {'title': this.i18n.t('switch_text')}),
                $$(UndoTool).append($$(Icon, {icon: 'fa-undo'})),
                $$(RedoTool).append($$(Icon, {icon: 'fa-repeat'})),
                $$(StrongTool).append($$(Icon, {icon: 'fa-bold'})),
                $$(EmphasisTool).append($$(Icon, {icon: 'fa-italic'})),
                $$(CodeTool).append($$(Icon, {icon: 'fa-code'})),
                $$(MarkTool).append($$(Icon, {icon: 'fa-pencil'})),
                $$(LinkTool).append($$(Icon, {icon: 'fa-link'})),
                $$(TodoTool).append($$(Icon, {icon: 'fa-check-square-o'})),
                $$(CommentTool).append($$(Icon, {icon: 'fa-comment'})),
                $$(ImageTool).append($$(Icon, {icon: 'fa-image'}))
              )
            )
          )
        ),
        // Bottom area (content)
        $$(ScrollPane, {
          scrollbarType: 'native',
          scrollbarPosition: 'right'
        }).append(
          // $$('div').addClass('se-note-content').append(
          $$(Layout, {
            width: 'large'
          }).append(
            $$(Cover, {
              doc: this.doc,
              noteInfo: this.props.noteInfo
            }).ref('cover'),
            $$(ContainerEditor, {
              doc: this.props.documentSession.doc,
              containerId: 'body',
              name: 'bodyEditor',
              commands: config.bodyEditor.commands,
              textTypes: config.bodyEditor.textTypes
            }).ref('bodyEditor')
          )
        ).ref('scrollableContent')
      )
    );
  };
};

Controller.extend(NoteWriter);

NoteWriter.static.config = {
  i18n: {
    'todo.content': 'Todo'
  },
  // Controller specific configuration (required!)
  controller: {
    // Component registry
    components: {
      'paragraph': require('substance/packages/paragraph/ParagraphComponent'),
      'heading': require('substance/packages/heading/HeadingComponent'),
      'comment': require('./CommentComponent'),
      'image': require('substance/packages/image/ImageComponent'),
      'link': require('substance/packages/link/LinkComponent'),
      'todo': require('./TodoComponent'),
      'codeblock': require('substance/packages/codeblock/CodeblockComponent'),
      'blockquote': require('substance/packages/blockquote/BlockquoteComponent')
    },
    // Controller commands
    commands: [
      require('substance/ui/UndoCommand'),
      require('substance/ui/RedoCommand'),
      require('substance/ui/SaveCommand')
    ]
  },
  titleEditor: {
    commands: [
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/subscript/SubscriptCommand'),
      require('./MarkCommand'),
      require('substance/packages/superscript/SuperscriptCommand')
    ]
  },
  // Custom configuration (required!)
  bodyEditor: {
    commands: [
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/strong/StrongCommand'),
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/code/CodeCommand'),
      require('substance/packages/link/LinkCommand'),
      require('substance/packages/image/ImageCommand'),
      require('./MarkCommand'),
      require('./TodoCommand'),
      require('./CommentCommand')
    ],
    textTypes: [
      {name: 'paragraph', data: {type: 'paragraph'}},
      {name: 'heading1',  data: {type: 'heading', level: 1}},
      {name: 'heading2',  data: {type: 'heading', level: 2}},
      {name: 'heading3',  data: {type: 'heading', level: 3}},
      {name: 'codeblock', data: {type: 'codeblock'}},
      {name: 'blockquote', data: {type: 'blockquote'}}
    ]
  }
};

module.exports = NoteWriter;
