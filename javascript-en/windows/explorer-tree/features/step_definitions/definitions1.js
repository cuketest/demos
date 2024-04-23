const { Given, When, Then, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');

// Clear the default timeout
setDefaultTimeout(-1);

// Load the UI model file of the Windows application
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");

//// your step definition /////
// The maximum depth of traversal, such as 3 means to expand at most three levels of nodes
const MAX_DEPTH = 3; 
// The name and depth information of the record traversal node is used to generate the record, and the members are {name, depth} objects
const result = []; 

// After each test scenario, check if there is a dialog with the window class name #32770, if so, close it
After(async function () {
    if (await model.getWindow("Window").getWindow({ "className": "#32770" }).exists()){
        await model.getWindow("Window").getWindow({ "className": "#32770" }).close();
    }

    // Minimize window
    await model.getWindow("Window").minimize();
})

// {string} placeholder receives a string parameter passed to the variable tree
When("Traverse the expanded tree {string}", async function (tree) {
    let depth = 0

    // Scroll the tree to the top
    await model.getTree(tree).scrollToTop();

    // Get the first `TreeItem` child node in the tree
    let RootNode = await model.getTree(tree).firstChild("TreeItem"); 

    // If the root node exists, recursively expand its child nodes
    if (RootNode) {
        await expandChild(RootNode, depth);
    } else {
        throw Error(`There are currently no tree nodes in the ${tree} tree.`)
    }
});

Given("Open Explorer", async function () {
    // If there is currently an explorer window open, use the current window directly
    if (await model.getWindow("Window").exists()) {
        await model.getWindow("Window").restore()
    }else{
        await Util.launchProcess("explorer");
    }
    if (!await model.getWindow("Window").exists(5))
    {
        throw Error("Explorer did not start properly")
    }
});

Then("Attach the results", async function () {
    let report = "";
    for(let row of result){
        let rowString = '\t'.repeat(row.depth)+row.name+'\n';
        report += rowString;
    }

    // Add the value of `report` to the test report
    this.attach(report);
});

/**
 * expandChild(node: IWinControl, depth: number): Promise<void>
 * @param: {IWinControl} node Current recursive item. It could be any type control.
 *      The control node currently being traversed can be any control type;
 * @param: {number} depth Curren depth in recursion. Recursion will stop when reaching `MAX_DEPTH`.
 *      The depth of the current recursion, after reaching the maximum depth MAX_DEPTH, the recursion will stop;
 * 
 * @return: Promise<void> Async function but nothing return. All controls which access in recursion was recorded on global variable `result`. 
 *      An asynchronous function that does not return any value, all traversed node information will be recorded in the global variable `result`.
 */
async function expandChild(node, depth) {
    await node.expand();  // Expand target node
    await node.highlight(1000);  // Highlight target node
    let nodeName = await node.name();
    result.push({ name: nodeName, depth: depth});
    await Util.delay(100); // Extend based on the response time after expanding the node

    // Whether there is a child node, if so, recursively enter the traversal of the child node
    // But no child node is not necessarily a leaf node
    const childNode = await node.firstChild("TreeItem");
    if (childNode && depth + 1 < MAX_DEPTH) {
        await expandChild(childNode, depth + 1);
    }
    // After jumping out of the traversal of the child node, continue the traversal of the next sibling node
    // End without next sibling
    const nextNode = await node.next();
    if (nextNode) {
        await expandChild(nextNode, depth);
    } else {
        return;
    }
}