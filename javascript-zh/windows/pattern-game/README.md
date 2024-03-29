# 基于图像识别的游戏自动化样例
在这个项目中，针对一款Qt提供的桌面游戏QML样例，由于桌面游戏不适合面向对象自动化，因此采取的是图像识别的方式自动化，示例的编写过程可以在帮助中搜索**演练：创建消消乐游戏的图像自动化项目**。  

## 项目介绍
项目的目的是开始并自动完成一局同色消除游戏（same game），这个游戏可以在Qt4的Demo中找到，参考路径是`{QT4_PATH}\demos\declarative\samegame\release\samegame.exe`。这些Demo会随着Qt4安装而自动安装，因此如果环境中没有Qt4的运行环境，则应该先安装Qt4环境。  

## 知识点
在这个项目中你会掌握：
1. 如何添加图案对象`Pattern`，并在通过`Pattern`对象提供的方法完成自动化；
2. 不同类型对象（Windows控件对象、虚拟控件对象和图案对象等）的级联。

## 被测应用
可以从[https://download.qt.io/archive/qt/4.8/4.8.7/]下载Qt的安装包，根据自身环境选择不同编译版本。安装完毕后就可以在安装目录的`demos`文件夹下找到全部的Demo了，本样例的被测应用就位于`\demos\declarative\samegame`文件夹下。