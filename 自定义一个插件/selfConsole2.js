/*
 * @Author: lzr lzr@email.com
 * @Date: 2022-12-06 14:56:06
 * @LastEditors: lzr lzr@email.com
 * @LastEditTime: 2022-12-06 14:59:56
 * @FilePath: /babel/selfConsole2.js
 * @Description: 用generator模块来简化CallExpression里的判断条件
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
    const calleeName = generate(path.node.callee).code;

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
