// Generated by CoffeeScript 1.9.2
(function() {
  var dbs, docs, emit, promisify_db, util,
    hasProp = {}.hasOwnProperty;

  require('../../openbeelab-util/javascript/stringUtils').install();

  promisify_db = require('./promisify_dbDriver');

  util = require('util');

  docs = [];

  emit = function(key, value) {
    return docs.push({
      key: key,
      value: value
    });
  };

  exports.dbs = dbs = {
    _users: {}
  };

  exports.connectToServer = function(config) {
    var updateViews;
    updateViews = function(db) {
      var _, candidate, name, ref, ref1, results, view;
      ref = db.views;
      results = [];
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        view = ref[name];
        docs = [];
        ref1 = db.data;
        for (_ in ref1) {
          if (!hasProp.call(ref1, _)) continue;
          candidate = ref1[_];
          if (!candidate._id.startsWith('_design/')) {
            view.map.bind(this).call(this, candidate);
          }
        }
        results.push(db.views[name].data = {
          total_rows: docs.length,
          rows: docs.clone()
        });
      }
      return results;
    };
    return {
      database: function(name) {
        var db;
        db = dbs[name];
        return {
          exists: function(callback) {
            return callback(null, (dbs != null ? dbs[name] : void 0) != null);
          },
          create: function(callback) {
            if (db != null) {
              return callback('db exists.');
            } else {
              db = dbs[name] = {
                views: {},
                data: {}
              };
              return callback(null);
            }
          },
          save: function(doc, callback) {
            var _, fn, mapFunc, mapreduce, ref, ref1, rev;
            if (doc._id == null) {
              doc._id = String.generateToken(6);
            }
            rev = 0;
            if (doc._rev != null) {
              ref = doc._rev.split("-"), rev = ref[0], _ = ref[1];
            }
            rev += 1;
            doc._rev = rev + "-" + String.generateToken(6);
            db.data[doc._id] = doc;
            if (doc._id.startsWith('_design')) {
              mapFunc = null;
              ref1 = doc.views;
              fn = function(mapFunc) {
                var view;
                view = {
                  map: mapFunc,
                  reduce: mapreduce['reduce'],
                  data: []
                };
                return db.views[name] = view;
              };
              for (name in ref1) {
                if (!hasProp.call(ref1, name)) continue;
                mapreduce = ref1[name];
                name = doc._id + '/_view/' + name;
                eval("mapFunc = " + mapreduce['map'] + ';');
                fn(mapFunc);
              }
            }
            updateViews(db);
            return callback(null, doc);
          },
          remove: function(doc, callback) {
            var _, delDoc, ref, rev;
            if ((db != null ? db.data[doc != null ? doc._id : void 0] : void 0) == null) {
              callback("doc doesn't exist.", {
                ok: false
              });
            }
            ref = doc._rev.split("-"), rev = ref[0], _ = ref[1];
            rev += 1;
            delDoc = {};
            delDoc._id = doc._id;
            delDoc._rev = rev + "-" + String.generateToken(6);
            delDoc._deleted = true;
            db.data[doc._id] = delDoc;
            return callback(null, {
              ok: true
            });
          },
          get: function(id, callback) {
            var doc, ref;
            if (id != null ? id.startsWith('_design/') : void 0) {
              return callback(null, db.views[id].data);
            } else {
              doc = null;
              if (!(db != null ? (ref = db.data[id]) != null ? ref._deleted : void 0 : void 0)) {
                doc = db != null ? db.data[id] : void 0;
              }
              return callback(null, doc);
            }
          }
        };
      },
      useDb: function(name) {
        return promisify_db(this.database(name));
      }
    };
  };

}).call(this);
