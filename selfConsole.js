/*
 * @Author: lzr lzr@email.com
 * @Date: 2022-12-06 14:28:16
 * @LastEditors: lzr lzr@email.com
 * @LastEditTime: 2022-12-06 14:40:00
 * @FilePath: /babel/selfConsole.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const parser = require('@babel/parser');
// 因为 @babel/parser 等包都是通过 es module 导出的，所以通过 commonjs 的方式引入有的时候要取 default 属性。
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// const sourceCode = `console.log(1);`;
const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser.parse(sourceCode, {
  // 自动判断包是es module 还是commonjs
  sourceType: 'unambiguous',
  // 解析第二段代码需要开启jsx插件
  plugins: ['jsx']
});

traverse(ast, {
  CallExpression(path, state) {
    // 判断当 callee 部分是成员表达式，并且是 console.xxx 时，那在参数中插入文件名和行列号，行列号从 AST 的公共属性 loc 上取
    if (types.isMemberExpression(path.node.callee) &&
      path.node.callee.object.name === 'console' && ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
    ) {
      const {
        line,
        column
      } = path.node.loc.start;
      path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
    }
  }
});

const {
  code,
  map
} = generate(ast);
console.log(code);
