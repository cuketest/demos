var { Given, When, Then } = require('cucumber')
var got = require('got')
var assert = require('assert')
var { userinfo, username } = require('../../config')
const util = require('util');
let base_url = 'https://api.github.com'

Given("认证用户登录", async function () {
    let response = await got.get(base_url, userinfo)
    return assert.equal(response.statusCode, 200);

});
async function searchRepo(repo) {
    let search_url = base_url + '/search/repositories?q=' + repo;
    global.search_res = await got.get(search_url, userinfo);
}
When("搜索关键字{string}", async function (repo) {
    await searchRepo(repo);
});


Given("匿名用户登录", async function () {
    return true;
});

Then("服务器响应状态码应该为{int}", async function (statusCode) {

    return assert.equal(search_res.statusCode, statusCode)
});

Then("至少有{int}条结果", async function (count) {
    let res = search_res.body
    return assert.ok(res.total_count >= count)
});

async function listMyRepos() {
    let response = await got.get(base_url + '/user/repos', userinfo)
    return response;
}

When("查看我github仓库信息", async function () {
    let response = await listMyRepos();
    this.attach(util.inspect(response, { depth: null }));

});

async function myReposIncludes(repo) {
    let response = await listMyRepos();
    let res = response.body;
    let arr = res.map((r) => r.name);
    if(arr.indexOf(repo) === -1){
        throw `Can not find repository name ${repo}`;
    }
    return arr;
}

Then("github仓库中应该包含{string}", async function (repo) {
    let repoList = await myReposIncludes(repo);
    this.attach(util.inspect(repoList))
});

async function createNewRepo(repo) {
    let postData = userinfo;
    postData['body'] = {
        'name': repo
    };
    postData['json'] = userinfo.json;
    postData['auth'] = userinfo.auth;
    let response = await got.post(base_url + '/user/repos', postData);
    return response;
}

When("创建github仓库{string}", async function (reponame) {
    let response = await createNewRepo(reponame)
    this.attach(util.inspect(response, {depth:null}));
});

Given("我的github仓库中包含{string}", async function (repo) {
    await listMyRepos();
    return await myReposIncludes(repo)
});

async function watchTheRepository(repo, user = username) {
    let watch_url = base_url + '/repos/' + user + '/' + repo + '/subscription';

    let response = await got.put(watch_url, userinfo);
    return response;
}
When("订阅github仓库{string}", async function (repo) {

    return await watchTheRepository(repo)
});
async function assertAsWatcher(repo) {
    let watch_url = base_url + '/repos/' + username + '/' + repo + '/subscribers';
    let response = await got.get(watch_url, userinfo);
    let res = response.body;
    let arr = res.map((r) => r.login);
    return assert.ok(arr.indexOf(username) > -1);
}

Then("github仓库{string}应该显示为订阅者", async function (repo) {

    return await assertAsWatcher(repo)

});

async function deleteRepo(repo) {
    let delete_url = base_url + '/repos/' + username + '/' + repo;
    let response = await got.delete(delete_url, userinfo)
    return response;
}

Then("删除代码仓库{string}", async function (repo) {
    let response = await deleteRepo(repo)
    let statusCode = response.statusCode;
    return assert.equal(statusCode, 204)

});

 Given("订阅不同用户下的github仓库:", async function (table) {

    global.repotable = table;
    let infos = table.hashes();
    for (let i = 0; i < infos.length; i++) {
        let info = infos[i];
        await watchTheRepository(info.project, info.owner)
    }

});



Then("订阅列表中应该包含这些项目", async function () {
    let mywatch_list_url = base_url + '/users/' + username + '/subscriptions';
    let response = await got.get(mywatch_list_url, userinfo)
    let results = response.body;
    let res = []
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let arr = []
        arr.push(result.owner.login)
        arr.push(result.name)
        res.push(arr)
    }
    let table = repotable.rows()
    for (let i = 0; i < table.length; i++) {

        assert.ok(res.some((val) => {
            let result = false;
            if (val.values == table[i].values) {
                result = true;
            }
            return result
        }))
    }
});

