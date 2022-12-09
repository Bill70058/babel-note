/*
 * @Author: lzr lzr@email.com
 * @Date: 2022-12-06 14:56:06
 * @LastEditors: lzr lzr@email.com
 * @LastEditTime: 2022-12-06 15:14:31
 * @FilePath: /babel/selfConsole2.js
 * @Description: 通过path自带toString方法转换generate的code，path 有一个 toString 的 api，就是把 AST 打印成代码输出的
 */
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');

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
  sourceType: 'unambiguous',
  plugins: ['jsx']
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

traverse(ast, {
  CallExpression(path, state) {
    const calleeName = path.get('callee').toString()

    if (targetCalleeName.includes(calleeName)) {
      const {
        line,
        column
      } = path.node.loc.start;
      path.node.arguments.unshift(types.stringLiteral(`filename2: (${line}, ${column})`))
    }
  }
});

const {
  code,
  map
} = generate(ast);
console.log(code);
