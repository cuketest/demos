const { Util } = require('leanpro.common');
const { BeforeAll } = require('cucumber');
BeforeAll(async function () {
    Util.launchProcess("dirview.exe");
})