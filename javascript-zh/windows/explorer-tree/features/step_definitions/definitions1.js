const { Given, When, Then, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');

// 清除默认超时
setDefaultTimeout(-1);

// 加载Windows应用的UI模型文件
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////
// 遍历的最大深度，如3就代表最多展开三级节点
const MAX_DEPTH = 3; 

// 记录遍历节点的名称和深度信息用于生成记录，成员为{name, depth}对象
const result = []; 

// 在每个测试场景执行之后检查是否存在窗口类名为 #32770 的对话框,存在则关闭
After(async function () {
    if(await model.getWindow("Window").getWindow({ "className": "#32770" }).exists()){
        await model.getWindow("Window").getWindow({ "className": "#32770" }).close();
    }

    // 最小化窗口
    await model.getWindow("Window").minimize();
})

// {string} 占位符接收一个字符串类型参数，字符串传递给变量tree
When("遍历展开树{string}", async function (tree) {
    let depth = 0

    // 滚动树至顶部
    await model.getTree(tree).scrollToTop();

    // 获取树中的第一个`TreeItem`子节点
    let RootNode = await model.getTree(tree).firstChild("TreeItem"); 
    
    // 如果根节点存在，则递归展开其子节点
    if (RootNode) {
        await expandChild(RootNode, depth);
    } else {
        throw Error(`当前${tree}树中没有任何树节点。`);
    }
});

Given("打开资源管理器", async function () {
    // 如果当前有资源管理器窗口打开就直接用当前窗口
    if (await model.getWindow("Window").exists()) {
        await model.getWindow("Window").restore();
    }else{
        await Util.launchProcess("explorer");
    }
    if (!await model.getWindow("Window").exists(5)) {
        throw Error("资源管理器没有正常启动");
    }
});

Then("将结果附件", async function () {
    let report = "";
    for(let row of result){
        let rowString = '\t'.repeat(row.depth)+row.name+'\n';
        report += rowString;
    }

    // 将report值添加到测试报告中
    this.attach(report);
});

/**
 * expandChild(node: IWinControl, depth: number): Promise<void>
 * @param: {IWinControl} node Current recursive item. It could be any type control.
 *      当前被正在被遍历的控件节点，可以是任何控件类型；
 * @param: {number} depth Curren depth in recursion. Recursion will stop when reaching `MAX_DEPTH`.
 *      当前递归所在的深度，到达最大深度MAX_DEPTH后会停止继续递归； 
 * 
 * @return: Promise<void> Async function but nothing return. All controls which access in recursion was recorded on global variable `result`. 
 *      不返回任何值的异步函数，所有被遍历到的节点信息会记录在全局变量`result`中。
 */
async function expandChild(node, depth) {
    await node.expand();  // 展开目标节点
    await node.highlight(1000);  // 高亮目标节点
    let nodeName = await node.name();
    result.push({ name: nodeName, depth: depth});
    await Util.delay(100); // 根据展开节点后的响应时间来延长

    // 是否有子节点，如果有则递归进入子节点的遍历
    // 但是没有子节点不一定就是叶子节点
    const childNode = await node.firstChild("TreeItem");
    if (childNode && depth + 1 < MAX_DEPTH) {
        await expandChild(childNode, depth + 1);
    }
    // 跳出子节点的遍历后继续下一个兄弟节点的遍历
    // 没有下一个兄弟节点就结束
    const nextNode = await node.next();
    if (nextNode) {
        await expandChild(nextNode, depth);
    } else {
        return;
    }
}