const { Given, When, Then } = require('cucumber');
const { TestModel } = require('leanpro.win');
const { Util } = require('leanpro.common');

let model = TestModel.loadModel(__dirname + "/model1.tmodel");


//// 你的步骤定义 /////


Given("Windows搜索框输入{string}", async function (text) {
    await model.getButton("在这里输入你要搜索的内容").click(0, 0, 1);
    await model.getEdit("搜索框").click(0, 0, 1);
    await model.getEdit("搜索框").clearAll();
    await model.getEdit("搜索框").set(text);

});

When("打开搜索结果中的应用", async function () {

    await model.getEdit("搜索框").pressKeys("{ENTER}")
});

When("点击【格式】--【字体】", async function () {

    await model.getMenuItem("格式(O)1").click(0, 0, 1);
    await model.getMenuItem("字体(F)...").click(0, 0, 1);

});


When("设置好字体格式后点击【确定】按钮", async function () {
    await model.getListItem("微软雅黑").scrollIntoView();
    await model.getListItem("微软雅黑").click(0, 0, 1);
    await model.getListItem("五号").scrollIntoView();
    await model.getListItem("五号").click(0, 0, 1);
    await model.getListItem("粗体").scrollIntoView();
    await model.getListItem("粗体").click(0, 0, 1);
    await model.getButton("确定").click(0, 0, 1);
});

When("在记事本中输入{string}", async function (text) {

    await model.getDocument("文本编辑器").click(0, 0, 1);
    await model.getDocument("文本编辑器").clearAll();
    await model.getDocument("文本编辑器").set(text);

});

When("点击【文件】--【另存为】", async function () {

    await model.getMenuItem("文件(F)").click(0, 0, 1);
    await model.getMenuItem("另存为(A)...").click(0, 0, 1);

});

When("在弹出来的文件对话框中输入{string}", async function (filename) {

    await model.getEdit("文件名:1").click(0, 0, 1);
    await model.getEdit("文件名:1").clearAll();
    await model.getEdit("文件名:1").set(filename);

});