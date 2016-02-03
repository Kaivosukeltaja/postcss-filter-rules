/*!
 * postcss-filter-rules | MIT (c) Niko Salminen
 * https://github.com/kaivosukeltaja/postcss-filter-rules
*/
var postcss = require('postcss');

module.exports = postcss.plugin('filterRules', function(options) {
  options = options || {};

  var properties = options.properties || options.props;
  var exclude = !!options.exclude;

  if (!Array.isArray(properties)) {
    properties = [properties];
  }

  return function filterRules(style) {
    style.eachRule(function(rule) {
      rule.each(function(decl, index) {
        if (exclude !== (properties.indexOf(decl.prop) === -1)) {
          rule.remove();
        }
      });
    });
  }
});
