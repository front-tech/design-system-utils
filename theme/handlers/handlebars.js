

module.exports = {
  isDefined: function (value) {
    if (typeof value === "object") return value.length > 0;
    return value !== undefined;
  },
  isMixin: function (value) {
    return value === 'mixin';
  },
  isFunction: function (value) {
    return value === 'function';
  },
  isCSS: function (value) {
    return value === 'css';
  },
};
