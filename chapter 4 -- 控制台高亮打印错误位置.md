## Code-Frame和高亮打印原理

### 核心问题
1. 如何打印出标记相应位置代码的 code frame（就是上图的打印格式）
2. 如何实现语法高亮
3. 如何在控制台打印颜色

> code frame

实际就是一个拼接字符串的过程。

marker为`">"`标记，传入一段代码，标记开始和结束的行列号，那就能计算出显示标记的行是哪些，以及这些行的哪些列，然后依次对每一行代码做处理

**@babel/code-frame**的实现：

首先，分割字符串成每一行的数组，然后根据传入的位置计算出 marker（>） 所在的位置

然后对每一行做处理，如果本行有标记，则拼成 marker + gutter（行号） + 代码的格式，下面再打印一行 marker，最后的 marker 行打印 message。没有标记不处理。

最后打印出来就实现了code-frame的拼接

### 如何实现语法高亮

实现语法高亮，词法分析就足够了，babel 也是这么做的，@babel/highlight 包里面完成了高亮代码的逻辑

```ts
const a = 1;
const b = 2;
console.log(a + b);
```
被解析为token数组
```ts
[
  [ 'whitespace', '\n' ], [ 'keyword', 'const' ],
  [ 'whitespace', ' ' ],  [ 'name', 'a' ],
  [ 'whitespace', ' ' ],  [ 'punctuator', '=' ],
  [ 'whitespace', ' ' ],  [ 'number', '1' ],
  [ 'punctuator', ';' ],  [ 'whitespace', '\n' ],
  [ 'keyword', 'const' ], [ 'whitespace', ' ' ],
  [ 'name', 'b' ],        [ 'whitespace', ' ' ],
  [ 'punctuator', '=' ],  [ 'whitespace', ' ' ],
  [ 'number', '2' ],      [ 'punctuator', ';' ],
  [ 'whitespace', '\n' ], [ 'name', 'console' ],
  [ 'punctuator', '.' ],  [ 'name', 'log' ],
  [ 'bracket', '(' ],     [ 'name', 'a' ],
  [ 'whitespace', ' ' ],  [ 'punctuator', '+' ],
  [ 'whitespace', ' ' ],  [ 'name', 'b' ],
  [ 'bracket', ')' ],     [ 'punctuator', ';' ],
  [ 'whitespace', '\n' ]
]
```
一般来说词法分析就是有限状态自动机（DFA），这里实现比较简单

js-tokens 这个包暴露出来一个正则，一个函数，正则是用来识别 token 的，其中有很多个分组，而函数里面是对不同的分组下标返回了不同的类型，这样就能完成 token 的识别和分类

在 @babel/highlight 包里基于这个正则来匹配 token

有了分类之后，不同 token 显示不同颜色，建立个 map 就行了

#### 阶段总结
1. 通过词法分析将一串代码解析为一个二维数组
2. 二维数组的内容是词法的类型还有值
3. 再通过@babel/highlignt通过相同的正则匹配识别分类渲染不同颜色

### 如何在控制台打印颜色

控制台打印的是``ASCII``码，``chalk``（nodejs 的在终端打印颜色的库）的不同方法就是封装了这些 ASCII 码的颜色控制字符