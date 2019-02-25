const { TestModel, Auto } = require("leanpro.win");
let path = require('path')
let tmodelfile = path.join(__dirname, 'Mail.tmodel')
var model = TestModel.loadModel(tmodelfile);


exports.model = model;