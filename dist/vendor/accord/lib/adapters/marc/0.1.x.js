// Generated by CoffeeScript 1.12.1
(function() {
  var Adapter, Marc, W,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Adapter = require('../../adapter_base');

  W = require('when');

  Marc = (function(superClass) {
    extend(Marc, superClass);

    function Marc() {
      return Marc.__super__.constructor.apply(this, arguments);
    }

    Marc.prototype.name = 'marc';

    Marc.prototype.extensions = ['md'];

    Marc.prototype.output = 'html';

    Marc.prototype._render = function(str, options) {
      var base, k, ref, ref1, ref2, v;
      base = this.engine();
      ref = options['data'];
      for (k in ref) {
        v = ref[k];
        base.set(k, v);
      }
      delete options['data'];
      ref1 = options['partial'];
      for (k in ref1) {
        v = ref1[k];
        base.partial(k, v);
      }
      delete options['partial'];
      ref2 = options['filter'];
      for (k in ref2) {
        v = ref2[k];
        base.filter(k, v);
      }
      delete options['filter'];
      base.config(options);
      return W.resolve({
        result: base(str, true)
      });
    };

    return Marc;

  })(Adapter);

  module.exports = Marc;

}).call(this);
