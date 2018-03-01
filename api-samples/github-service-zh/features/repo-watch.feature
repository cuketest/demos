# language: zh-CN
功能: 订阅github仓库
订阅并删除

  场景: 订阅github仓库
    假如认证用户登录
    并且我的github仓库中包含"monkey"
    当订阅github仓库"monkey"
    那么github仓库"monkey"应该显示为订阅者
    并且删除代码仓库"monkey"