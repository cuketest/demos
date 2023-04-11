const { Util } = require('leanpro.common');
const { BeforeAll } = require('cucumber');
const CarRental = require('../step_definitions/car-rental.js');
const path = require("path");
BeforeAll(async function () {
    await CarRental.launcher(path.join(__dirname, "../../CarRental.jar"));
})