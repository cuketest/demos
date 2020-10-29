const { Util } = require('leanpro.common');
const { AfterAll } = require('cucumber');
const { BeforeAll } = require('cucumber');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const kill = require('kill-port');

BeforeAll(async function () {
    let text = fs.readFileSync(__dirname+'\\..\\..\\data_origin.json', {encoding: "utf-8"});
    fs.writeFileSync(__dirname +'\\..\\..\\data.json', text);
    child_process.spawn(path.join(__dirname, '../../', 'node_modules\\.bin\\json-server.cmd'), ['data.json'], { detached: true,shell:false })
    // If want disable the command prompt, instead below code of above.
    // child_process.spawn('npm.cmd', ['run', 'json-server'])

})
AfterAll(async function () {
    kill('3000'); // 关闭json-server进程
    await Util.delay(1000);
})