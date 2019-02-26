# language: zh-CN
功能: 同时自动化desktop,mobile,web
Outlook 应用分为移动端，Windows端和web端。
Jason在Windows端给Carol发送邮件，Carol手机端收到邮件后回复Jason。
之后Carol在web端给Jason发送一封带有附件的邮件。

  @desktop
  场景: Jason使用PC端Mail给Carol发送邮件索要文档
    假如打开Outlook桌面客户端
    当点击新建邮件
    并且在收件人，主题，收件内容中输入对应的信息
    同时点击发送邮件

  @mobile
  场景: Carol手机端回复Jason稍后发送
    假如打开手机端Outlook
    当打开收件箱窗口
    同时打开未读邮件
    同时答复框内回复对应内容并发送

  @web
  场景: Carol使用web端回复Jason
    假如用户Carol登录Outlook web页面
    当打开收件箱并打开最新一次的邮件
    那么回复Jason邮件并上传相关文档