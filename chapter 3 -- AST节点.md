## babel的ast节点

### 常见AST
> Literal

Literal 是字面量的意思，比如 let name = 'guang'中，'guang'就是一个字符串字面量 StringLiteral，相应的还有数字字面量 NumericLiteral，布尔字面量 BooleanLiteral，字符串字面量 StringLiteral，正则表达式字面量 RegExpLiteral 等

- StringLiteral: 字符串
- TemplateLiteral：模板
- NumbericLiteral：数字
- RegExpLiteral： 正则
- BooleanLiteral： 布尔
- BigintLiteral： 大数值的字面量(例：1.232434n)
- NummLiteral: null字面量 

> Identifier

Identifer 是标识符的意思，变量名、属性名、参数名等各种声明和引用的名字，都是Identifer。我们知道，JS 中的标识符只能包含字母或数字或下划线（“_”）或美元符号（“$”），且不能以数字开头。这是 Identifier 的词法特点

> Statement

statement 是语句，它是可以独立执行的单位，比如 break、continue、debugger、return 或者 if 语句、while 语句、for 语句，还有声明语句，表达式语句等。我们写的每一条可以独立执行的代码都是语句。
语句是代码执行的最小单位，可以说，代码是由语句（Statement）构成的。

> Declaration

声明语句是一种特殊的语句，它执行的逻辑是在作用域内声明一个变量、函数、class、import、export 等。

声明语句用于定义变量，这也是代码中一个基础组成部分。

> Expression

expression 是表达式，特点是执行完以后有返回值，这是和语句 (statement) 的区别。

常见表达式：
```javascript
[1,2,3]
a = 1
1 + 2;
-1;
function(){};
() => {};
class{};
a;
this;
super;
a::b;
```
判断 AST 节点是不是某种类型要看它是不是符合该种类型的特点，比如语句的特点是能够单独执行，表达式的特点是有返回值。

> Class

class 的语法也有专门的 AST 节点来表示。

整个 class 的内容是 ClassBody，属性是 ClassProperty，方法是ClassMethod（通过 kind 属性来区分是 constructor 还是 method）

> Modules

es module 是语法级别的模块规范，所以也有专门的 AST 节点

> import

import 有 3 种语法：
named import：
```ts
import {c, d} from 'c';
```
default import:
```ts
import a from 'a'
```
namespaced import:
```ts
import * as b from 'b'
```

这 3 种语法都对应 ImportDeclaration 节点，但是 specifiers 属性不同，分别对应 ImportSpicifier、ImportDefaultSpecifier、ImportNamespaceSpcifier

> export

export 也有3种语法：

named export：
```ts
export { b, d};
```

default export：

```ts
export default a;
```

all export：
```ts
export * from 'c';
```
分别对应 ExportNamedDeclaration、ExportDefaultDeclaration、ExportAllDeclaration 的 AST

> Program & Directive

program 是代表整个程序的节点，它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合。还有 directives 属性，存放 Directive 节点，比如"use strict" 这种指令会使用 Directive 节点表示

> File & Comment

babel 的 AST 最外层节点是 File，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点。

注释分为块注释和行内注释，对应 CommentBlock 和 CommentLine 节点。

### ast公共属性
每种 AST 都有自己的属性，但是它们也有一些公共的属性

- type: AST节点类型
- start、end、loc：

start 和 end 代表该节点在源码中的开始和结束下标。而 loc 属性是一个对象，有 line 和 column 属性分别记录开始和结束的行列号

- leadingComments、innerComments、trailingComments： 

表示开始的注释、中间的注释、结尾的注释，每个 AST 节点中都可能存在注释，而且可能在开始、中间、结束这三种位置，想拿到某个 AST 的注释就通过这三个属性。



### 友链
- ast可视化工具[axtexplorer.net](https://link.juejin.cn/?target=https%3A%2F%2Fastexplorer.net%2F)
- [全部ast](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbabel%2Fbabel%2Fblob%2Fmain%2Fpackages%2Fbabel-parser%2Fast%2Fspec.md)
- [typescript类型定义](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbabel%2Fbabel%2Fblob%2Fmain%2Fpackages%2Fbabel-types%2Fsrc%2Fast-types%2Fgenerated%2Findex.ts)