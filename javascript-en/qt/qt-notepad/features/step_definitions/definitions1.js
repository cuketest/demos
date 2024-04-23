const assert = require('assert');
const { AfterAll } = require('cucumber');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Image } = require('leanpro.visual');
const { WinAuto } = require('leanpro.win');
const { Util, RunSettings } = require('leanpro.common');
const {platform} = require('os')
const {join, dirname} = require('path')
const {existsSync} = require('fs')

//Set the timeout duration to 60 seconds.
setDefaultTimeout(60 * 1000); 

// Specify the minimum interval between automated operation method calls as 500 milliseconds to slow down the automation speed, and output the report information for each automation operation in the output panel
RunSettings.slowMo = 500

// Load the UI model file of the Qt application
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");

// After all test scenarios are executed, close the tested application.
AfterAll(async function () {
    await model.getApplication("notepad").quit()
})
//// Your step definition. /////

Given("Open the Qt Notepad application", async function () {
    // Launch the Qt application file "notepad"
    /**
     * Note 1: The launchQtProcessAsync() method takes an array containing paths to executable files for different platforms.
     *   CukeTest will automatically choose the available path to launch the application.
     **/

    await QtAuto.launchQtProcessAsync([
        join(dirname(process.execPath), '\\bin\\notepad.exe'),
        "/usr/lib/cuketest/bin/notepad"
    ]);
    //Wait for the Qt application "notepad."
    await model.getApplication("notepad").exists(10);
});

When("Enter text in the notepad", async function (docstring) {
    //click "textEdit"
    await model.getEdit("textEdit").click(140, 40);
    //Set the control value to "Hello World!"
    await model.getEdit("textEdit").set(docstring);
});

When("Click on Save", async function () {
    //click "Save"
    await model.getButton("Save").click();
});

When("Save in the file dialog as {string} in the project path", async function (relativePath) {
    /**
     * Note 2: Use the Node.js core library path to concatenate paths, avoiding issues with path separators.
     * (On Windows, the path separator is a backslash '\', while on Linux it is a forward slash '/')
     **/
    const fullpath = join(process.cwd(), relativePath)
    //Set the control value to the full file path.
    /**
     * Note 3: For branching operations based on different platforms, you can use the os.platform() method to obtain system information,
     * and then proceed with platform-specific branching.
     */
    if(platform == 'win32'){
        const modelWin = await WinAuto.loadModel(__dirname + "/model1.tmodel");
        await modelWin.getEdit("File_name:1").exists(10)
        await modelWin.getEdit("File_name:1").set(fullpath)
        await modelWin.getButton("Save3").click()
        if (await modelWin.getButton("Yes1").exists(1)){
            await modelWin.getButton("Yes1").click()
        }
    }else{
        await model.getEdit("fileNameEdit").set(fullpath);
        await Util.delay(500)
        //click "Save1"
        await model.getButton("Save1").click();
        // If the file exists, overwrite it.
        if (await model.getButton("Yes").exists(1)) {
            await model.getButton("Yes").click()
        }
    }

    // Save the path to the context for other steps to use
    this.fullpath = fullpath
});

Then("The file should be saved successfully", async function () {
    
    // Get the fullpath passed from the previous step and check if it exists
    assert(existsSync(this.fullpath))
});

When("Open the font settings interface", async function () {
    
    // Take a screenshot of the notepad editing area and create an image object
    let screen1 = await model.getEdit("textEdit").takeScreenshot();
    this.controlImage = await Image.fromData(screen1);
    this.attach(screen1, 'image/png')
    //click "Font"
    await model.getButton("Font").click();
});

// {string} placeholder receives a string type parameter which is passed to the font variable
When("Select {string} from the Font dropdown", async function (font) {
    //Select the font list item.
    const data = await model.getList("FontListView").data()
    if(data.indexOf(font) == -1) font = "Times New Roman"
    
    // Save the font variable to the context for other steps to use
    this.font = font;
    await model.getList("FontListView").select(font);
});

// {string} placeholder receives a string type parameter which is passed to the style variable
When("Select {string} from the Style dropdown", async function (style) {

    //Select the list item "Italic."
    this.style = style;
    await model.getList("StyleListView").select(style);
});

// {string} placeholder receives a string type parameter which is passed to the size variable
When("Select {string} from the Size dropdown", async function (size) {
    //Select the list item "12."
    this.fontSize = size;
    await model.getList("SizeListView").select(size);
});

When("Complete the font settings", async function () {
    //click "OK"
    await model.getButton("OK").click();

    // Take a control screenshot and add it to the report
    const sc = await model.getWindow("Notepad1").takeScreenshot()
    this.attach(sc, 'image/png')
});

Then("The font should be set successfully", async function () {
    // Build the expected font attribute value string for property checking
    const fontFamily = this.font;
    const fontSize = this.fontSize;
    const fontWeight = -1;
    const fontStyle = 5;
    const letterSpacing = 50;
    const underline = 1;
    const strikeout = 0;
    const overline = 0;
    const outline = 0;
    const shadow = 0;
    const style = this.style;

    // Linux systems do not include style information
    const styleSuffix = (platform == 'win32') ? `,${style}` : '';
    const fontString = `${fontFamily},${fontSize},${fontWeight},${fontStyle},${letterSpacing},${underline},${strikeout},${overline},${outline},${shadow}${styleSuffix}`;
    
    // Add fontString value to the test report
    this.attach(`Font attribute value is: ${fontString}`);
    await model.getEdit("textEdit").checkProperty("font", fontString);

    // Attach the combined screenshot before and after modifying the font to the report
    let screen2 = await model.getEdit("textEdit").takeScreenshot();
    let modelImage = await Image.fromData(screen2);
    let combinedImage = this.controlImage.drawImage(modelImage, this.controlImage.width + 10, 0);
    this.attach(await combinedImage.getData(), 'image/png');
});