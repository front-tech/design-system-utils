/* module.exports.registerHelper("isDefined", function (value) {
    console.log(value);
    return value;
  }); */

module.exports = {
  isDefined: function (value) {
    if (typeof value === "object") return value.length > 0;
    return value !== undefined;
  },
  isMixin: function (value) {
    return value === 'mixin';
  },

  isCSS: function (value) {
    return value === 'css';
  },
};
