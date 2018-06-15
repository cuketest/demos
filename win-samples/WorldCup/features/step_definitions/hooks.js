const { BeforeAll, Before, After, AfterAll } = require('cucumber')
const cuketest = require('cuketest')

BeforeAll(async function(){
    await cuketest.minimize();
})

AfterAll(async function(){
    await cuketest.maximize();
})