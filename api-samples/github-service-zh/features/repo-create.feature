# language: zh-CN
功能: 创建github仓库
用个人账户登录成功后创建新的代码库

  场景: 创建一个新的代码库
    假设认证用户登录
    当创建github仓库"monkey"
    当查看我github仓库信息
    那么github仓库中应该包含"monkey"