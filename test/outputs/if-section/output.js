import Temple from "templejs";
const Template = {};
var idom = Temple.idom;

Template["if-test"] = Temple.create("if-test", function(scope, key) {
  idom.text(" ");
  if (scope.lookup("key")) {
    idom.text(" If ");
  }
  else if (scope.lookup("otherkey")) {
    idom.text(" Else If ");
  }
  else {
    idom.text(" Else ");
  }
  idom.text(" ");
});

export default Template;
