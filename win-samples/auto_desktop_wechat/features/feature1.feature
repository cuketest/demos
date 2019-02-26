# language: zh-CN
功能: 自动化微信
自动抓取hacker news 保存为pdf并分享到微信群。

  @puppeteer
  场景: 使用puppeteer自动抓取Hacker News并保存为pdf
    假如使用puppeteer打开"https://news.ycombinator.com/"
    同时将当前页面内容保存为到PDF文件中

  @WeChat
  场景: Windows桌面微信发送群
    假如打开微信群,选择文档
    当打开pdf文件
    同时点击发送，发送给群友