## babel学习笔记

### 历史
babel 最开始叫 6to5，顾名思义是 es6 转 es5，但是后来随着 es 标准的演进，有了 es7、es8 等， 6to5 的名字已经不合适了，所以改名为了 babel。

### ast标准
这里提一下js怎么在浏览器中运行，主要依赖于浏览器引擎
- SpiderMonkey：第一款JavaScript引擎，由Brenden Eich(即JavaScript作者)
- Chakra：微软开发，用于IE浏览器
- JavaScriptCore：WebKit中的JavaScript引擎，Apple公司开发
- V8：Google开发的强大JavaScript引擎，也帮助Google Chrome从众多浏览器中脱颖而出

js执行标准：

1. js代码通过解析(parse)
2. 生成ast
3. 转换为字节码(bytecode)
4. 转换为机器码(MachineCode)

具体运行流程：

1. 代码被解析 
2. V8引擎内部帮我们创建一个对象(Global Object window)
3. 运行js，Js引擎内部有一个上下文执行栈，执行代码的时候会调用栈
4. 执行过的函数AO会弹出栈

### 回到ast标准上
- SpiderMonkey具备早期的ast标准
- 基于SpiderMonkey编写了Esprima引擎，形成Estree标准
- 基于Esprima编写的Espree引擎继续使用Estree标准
- 基于Espree编写的Acorn引擎，可通过插件扩展语法支持
- 基于Acorn编写的Babylon引擎继承Acorn并对Ast节点与属性做扩展

其实现在 babel parser 的代码里已经看不到 acorn 的依赖了，因为在 babel4 以后，babel 直接 fork 了 acorn 的代码来修改，而不是引入 acorn 包再通过插件扩展的方式。但是，原理还是一样的

所以可以说，目前的ast标准是根据Acorn做出了扩展来的

### 作用
编译器的作用是高级语言转换为机器可读的低级语言，而bebel是个转译器，高级语言转换为另一种高级语言，主要用 babel 来做 3 种事情
> 转译 esnext、typescript、flow 等到目标环境支持的 js

用来把代码中的 esnext 的新的语法、typescript 和 flow 的语法转成基于目标环境支持的语法的实现。并且还可以把目标环境不支持的 api 进行 polyfill
> 一些特定用途的代码转换

babel 是一个转译器，暴露了很多 api，用这些 api 可以完成代码到 AST 的解析、转换、以及目标代码的生成。

开发者可以用它来来完成一些特定用途的转换，比如函数插桩（函数中自动插入一些代码，例如埋点代码）、自动国际化等。这些都是后面的实战案例。

现在比较流行的小程序转译工具 taro，就是基于 babel 的 api 来实现的。

> 代码的静态分析

对代码进行 parse 之后，能够进行转换，是因为通过 AST 的结构能够理解代码。理解了代码之后，除了进行转换然后生成目标代码之外，也同样可以用于分析代码的信息，进行一些检查