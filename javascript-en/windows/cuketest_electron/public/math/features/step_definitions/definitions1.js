const { Given, When, Then } = require('cucumber');
//// 你的步骤定义 /////



Given("初始值设为{int}", async function (num) {
	this.sum = num;
});

When("现在再加{int}", async function (num) {
	this.sum += num;
});

Then("结果为{int}", async function (num) {
	if (this.sum != num) {
		throw new Error('预期值为 ' + num +
			' 但是实际结果为 ' + this.sum + '.');
	}
}); 

