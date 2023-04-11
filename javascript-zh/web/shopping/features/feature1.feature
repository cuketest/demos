# language: zh-CN
功能: Web自动化测试
Web样例，模拟常用的web场景

  场景: 购物车结算
    假如打开浏览器并导航到"https://cuketest.github.io/apps/shopping-cart/"
    当点击添加到购物车按钮
    那么此时按钮文字应该为"Sold Out"
    而且弹出账单 "Total: $4.99"

  场景: 添加多种商品并验证价格
    假如打开浏览器并导航到"https://cuketest.github.io/apps/shopping-cart/"
    当添加1件"40oz Bottle"到购物车
    当添加3件"6 Pack"到购物车
    当添加2件"30 Pack"到购物车
    那么验证购物车总价符合预期