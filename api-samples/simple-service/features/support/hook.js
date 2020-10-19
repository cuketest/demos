const { Util } = require('leanpro.common');
const { AfterAll } = require('cucumber');
const { BeforeAll } = require('cucumber');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

BeforeAll(async function () {
    let text = fs.readFileSync(__dirname+'\\..\\..\\data_origin.json', {encoding: "utf-8"});
    fs.writeFileSync(__dirname +'\\..\\..\\data.json', text);
    subprocess = child_process.spawn(path.join(__dirname, '../../', 'node_modules\\.bin\\json-server.cmd'), ['data.json'], { detached: true })
    // If want disable the command prompt, instead below code of above.
    // this.subprocess = child_process.spawn('npm.cmd', ['run', 'json-server'])

    this.subprocess = subprocess;
})
AfterAll(async function (){
})