// Generated by CoffeeScript 1.9.2
(function() {
  module.exports = {
    _id: '_design/updates',
    updates: {
      time: (function(doc, req) {
        if (!doc.server_timestamp) {
          doc.server_timestamp = (new Date()).toISOString();
        }
        return [doc, 'server timestamp ok for object ' + req.id];
      }).toString()
    }
  };

}).call(this);
