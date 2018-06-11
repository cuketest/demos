const {setDefaultTimeout, BeforeAll,Before,After,AfterAll} = require('cucumber')

const cuketest = require('cuketest')

setDefaultTimeout(function(){
    return 60*1000;
})


BeforeAll(async function(){
    await cuketest.minimize();
})


AfterAll(async function(){
    await cuketest.maximize();
})