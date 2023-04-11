const { Util } = require('leanpro.common');
const { AfterAll,BeforeAll } = require('cucumber');
const {readFileSync, writeFileSync} = require('fs');
const { type } = require('os');
const {join} = require('path');
const {spawn} = require('child_process');
const kill = require('kill-port');
const root = join(__dirname, '../../');

BeforeAll(async function () {
    // restore mock server data file
    let text = readFileSync(join(root, 'data_origin.json'), {encoding: "utf-8"});
    writeFileSync(join(root,'data.json'), text);
    if (isLinux()){ // Handle different between Linux and Windows
        spawn(join(root, 'node_modules/.bin/json-server'), ['data.json'], { detached: true, shell: false })
    }else{
        spawn(join(root, 'node_modules/.bin/json-server.cmd'), ['data.json'], { detached: true, shell: false })
    }
    // If want disable the command prompt, instead below code of above.
    // child_process.spawn('npm.cmd', ['run', 'json-server'])

})
AfterAll(async function () {
    kill('3000'); // 关闭json-server进程
    await Util.delay(1000);
})
function isLinux(){
    const osType = type();
    return osType === "Linux";     
}