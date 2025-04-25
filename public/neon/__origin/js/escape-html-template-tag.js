(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.escapeHtmlTemplateTag = factory());
})(this, (function () {
  var ENTITIES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  var inspect = Symbol["for"]('nodejs.util.inspect.custom');
  var ENT_REGEX = new RegExp(Object.keys(ENTITIES).join('|'), 'g');
  function join(array, separator) {
    if (separator === undefined || separator === null) {
      separator = ',';
    }
    if (array.length <= 0) {
      return new HtmlSafeString([''], []);
    }
    return new HtmlSafeString([''].concat(Array(array.length - 1).fill(separator), ['']), array);
  }
  function safe(value) {
    return new HtmlSafeString([String(value)], []);
  }
  function escapehtml(unsafe) {
    if (unsafe instanceof HtmlSafeString) {
      return unsafe.toString();
    }
    if (Array.isArray(unsafe)) {
      return join(unsafe, '').toString();
    }
    return String(unsafe).replace(ENT_REGEX, function (_char) {
      return ENTITIES[_char];
    });
  }
  var HtmlSafeString = /*#__PURE__*/function () {
    function HtmlSafeString(parts, subs) {
      this._parts = void 0;
      this._subs = void 0;
      this._parts = parts;
      this._subs = subs;
    }
    var _proto = HtmlSafeString.prototype;
    _proto.toString = function toString() {
      var _this = this;
      return this._parts.reduce(function (result, part, i) {
        var sub = _this._subs[i - 1];
        return result + escapehtml(sub) + part;
      });
    };
    _proto[inspect] = function () {
      return "HtmlSafeString '" + this.toString() + "'";
    };
    return HtmlSafeString;
  }();
  function escapeHtml(parts) {
    return new HtmlSafeString(parts, [].slice.call(arguments, 1));
  }

  var index_cjs = Object.assign(escapeHtml, {
    "default": escapeHtml,
    join: join,
    safe: safe
  });

  return index_cjs;

}));
