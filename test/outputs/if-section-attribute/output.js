import Temple from "templejs";
const Template = {};
var idom = Temple.idom;

var decorators = Temple.decorators;

Template["if-test"] = Temple.create("if-test", function(scope, key) {
  idom.text(" ");
  idom.elementOpen("div", key + "-1");
  decorators.render(scope, "class", function(scope) {
    return Temple.utils.toString((scope.lookup("someBool") ? Temple.utils.joinValues("true") :
      scope.lookup("someOtherBool") ? Temple.utils.joinValues("also true") :
      Temple.utils.joinValues("false")));
  });
  idom.elementClose("div");
  idom.text(" ");
});

export default Template;
