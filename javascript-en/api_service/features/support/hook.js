const { Util } = require('leanpro.common');
const { AfterAll,BeforeAll } = require('cucumber');
const {readFileSync, writeFileSync} = require('fs');
const {join} = require('path');
const {spawn} = require('child_process');
const kill = require('kill-port');
const root = join(__dirname, '../../');
let subprocess;
BeforeAll(async function () {
    let text = readFileSync(join(root, 'data_origin.json'), {encoding: "utf-8"});
    writeFileSync(join(root,'data.json'), text);
    let subprocess = spawn(join(root, 'node_modules\\.bin\\json-server.cmd'), ['data.json'], { detached: true,shell:false })
    // If want disable the command prompt, instead below code of above.
    // child_process.spawn('npm.cmd', ['run', 'json-server'])

    await Util.delay(2000)
})
AfterAll(async function () {
    kill('3000'); // kill json-server process
    await Util.delay(1000);
})