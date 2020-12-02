const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { AppModel, Auto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const path = require("path");
let model = AppModel.loadModel(__dirname + "/model1.tmodel");


//// 你的步骤定义 /////

function genAbsPath(relativePath) {
    let absPath = '';
    if (!path.isAbsolute(relativePath)) {
        absPath = path.join(__dirname, '..', relativePath);
    } else {
        absPath = relativePath;
    }
    let pathNodes = absPath.split('\\');
    return pathNodes;
}
async function isClickable(model) {
    let rectHeight = await model.height();
    let rectWidtch = await model.width();
    return rectHeight > 0 || rectWidtch > 0;
}

Given("访问并选中{string}文件", async function (relativePath) {
    let pathNodes = genAbsPath(relativePath);
    let tree = model.getTree('Tree');
    let foundFlag = false;
    // 由于磁盘名称不同这里为路径中的磁盘名做修改
    pathNodes[0] = pathNodes[0] == 'C:' ? 'Windows  (C:)' : pathNodes[0];
    for (let i = 0; i < pathNodes.length; i++) {
        while (true) {
            await Util.delay(500);
            let treeItems = await tree.getControls({ type: 'TreeItem', levelToParent: 1 });
            foundFlag = false;
            for (let j = 0; j < treeItems.length; j++) {
                let treeItem = treeItems[j];
                let treeItemName = await treeItem.name();
                if (treeItemName == pathNodes[i]) {
                    await treeItems[j].dblClick(1, 1, 1);
                    foundFlag = true;
                    this.node = treeItem;
                    break;
                }
            }
            if (!foundFlag) {
                console.log(await treeItems[1].name())
                let pgdnBtn = model.getButton("Page down");
                if (!await pgdnBtn.exists(0) && await isClickable(pgdnBtn)) {
                    throw pathNodes[i] + " Node not find";
                } else {
                    await pgdnBtn.click();
                }
            } else {
                break;
            }
        }
    }
});

Then("{string}节点选中", async function (treeItemName) {
    let isFocused = await this.node.focused();
    let nodeName = await this.node.name();
    assert.ok(nodeName == treeItemName && isFocused, "未选中节点或选中的节点不正确，选中了节点" + nodeName);
});



