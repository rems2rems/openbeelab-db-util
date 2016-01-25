// Generated by CoffeeScript 1.9.2
(function() {
  var Promise, config, db, dbDriver, expect, promisify_db, util;

  expect = require('must');

  require('../../../openbeelab-util/javascript/objectUtils').install();

  require('../../../openbeelab-util/javascript/arrayUtils').install();

  util = require('util');

  promisify_db = require('../promisify_dbDriver');

  dbDriver = require('../mockDriver');

  Promise = require('promise');

  config = {
    database: {
      name: 'test'
    }
  };

  db = dbDriver.connectToServer(config.database).useDb(config.database.name);

  describe("a mock db", function() {
    return it("should deal with views", function(done) {
      var locsView, standsView;
      standsView = {
        _id: '_design/stands',
        views: {
          all: {
            map: (function(doc) {
              if (doc.type === "stand") {
                return emit(doc._id, doc);
              }
            }).toString()
          }
        }
      };
      locsView = {
        _id: '_design/locs',
        views: {
          all: {
            map: (function(doc) {
              if (doc.type === "location") {
                return emit(doc._id, doc);
              }
            }).toString()
          }
        }
      };
      return db.create().then(function() {
        return db.save(standsView);
      }).then(function() {
        return db.save(locsView);
      }).then(function() {
        return db.save({
          _id: "test_stand",
          type: 'stand',
          name: 'a test stand'
        });
      }).then(function() {
        return db.save({
          _id: 'test_location',
          type: 'location',
          name: 'a test location'
        });
      }).then(function() {
        return db.get('_design/stands/_view/all').then(function(data) {
          expect(data).to.not.be["null"]();
          expect(data.total_rows).to.be.a.number();
          data.total_rows.must.be(1);
          data.rows[0].key.must.be('test_stand');
          return data.rows[0].value.type.must.be("stand");
        });
      }).then(function() {
        return db.get('_design/locs/_view/all').then(function(data) {
          expect(data).to.not.be["null"]();
          expect(data.total_rows).to.be.a.number();
          data.total_rows.must.be(1);
          data.rows[0].key.must.be('test_location');
          data.rows[0].value.type.must.be("location");
          return done();
        });
      })["catch"](function(err) {
        return done(err);
      });
    });
  });

}).call(this);
