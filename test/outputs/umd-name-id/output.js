(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require("templejs"));
  } else if (typeof define === 'function' && define.amd) {
    define("MyModuleId", ["templejs"], factory);
  } else {
    global.MyModule = factory(global.Temple);
  }
}(this, function(Temple) {
  var Template = {};
  return Template;
}));
