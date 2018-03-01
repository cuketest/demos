# language: zh-CN
功能: 多个github仓库查看
查看不同用户名下的github仓库

  场景: 订阅多个github仓库
    假如认证用户登录
    当订阅不同用户下的github仓库:
      | owner        | project |
      | imtesteruser | abc     |
      | cuketest     | demos   |
    那么订阅列表中应该包含这些项目