"use strict";

var connect = require('./connect');
var EventEmitter = require('substance/util/EventEmitter');

/*
  Implements Substance Store API. This is just a stub and is used for
  testing.
*/
function ChangesStore(knex) {
  this.db = connect(knex.config);
  ChangesStore.super.apply(this);
}

ChangesStore.Prototype = function() {

  /*
    Gets changes from the DB.
    
    @param {String} id changeset id
    @param {String} sinceVersion changes since version (0 = all changes, 1 all except first change)
  */
  this.getChanges = function(id, sinceVersion, cb) {
    // cb(null, changes, headVersion);
    var self = this;
    var query = this.db('changes')
                .select('data', 'id')
                .where('changeset', id)
                .andWhere('id', '>', sinceVersion)
                .orderBy('pos', 'desc');

    query.asCallback(function(err, changes) {
      if (err) return cb(err, changes, null);
      self.getVersion(id, function(err, headVersion) {
        return cb(err, changes, headVersion);
      });
    });
  };

  /*
    Add a change to a changeset. Implicitly creates a new changeset
    when the first change is added to 
  
    @param {String} id changeset id
    @param {String} change serialized change
  */
  this.addChange = function(id, change, cb) {
    // cb(null, change, headVersion)
    var self = this;
    var user = 'substance bot';

    this.getVersion(id, function(err, headVersion) {
      var version = headVersion + 1;
      var record = {
        id: id + '/' + version,
        changeset: id,
        pos: version,
        data: change,
        timestamp: Date.now(),
        user: user
      };

      self.db.table('changes').insert(record)
        .asCallback(function(err) {
          cb(err, change, version);
        });
    });
  };

  /*
    Gets the version number for a document
  */
  this.getVersion = function(id, cb) {
    // HINT: version = count of changes
    // 0 changes: version = 0
    // 1 change:  version = 1
    var query = this.db('changes')
                .where('changeset', id)
                .count();
    query.asCallback(function(err, count) {
      if (err) return cb(err);
      return cb(err, count[0]['count(*)']);
    });
    // cb(null, headversion);
  };

  /*
    Removes a changeset from the db
    
    @param {String} id changeset id
  */
  this.deleteChangeset = function(id, cb) {
    var query = this.db('changes')
                .where('changeset', id)
                .del();
    query.asCallback(function(err) {
      return cb(err);
    });
  };

};

EventEmitter.extend(ChangesStore);

module.exports = ChangesStore;