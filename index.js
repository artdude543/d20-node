var D20 = require("./dist/index").default;
var Test = new D20();

console.log(Test.roll("200d20 /1 +1 -10"));