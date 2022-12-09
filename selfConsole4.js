/*
 * @Author: lzr lzr@email.com
 * @Date: 2022-12-06 14:56:06
 * @LastEditors: lzr lzr@email.com
 * @LastEditTime: 2022-12-06 16:27:31
 * @FilePath: /babel/selfConsole2.js
 * @Description: 更新需求，console换行打印
 * console.log('文件名（行号，列号）：', 1);
 * 转换为：
 * console.log('文件名（行号，列号）：');
 * console.log(1);
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
            return <div>
            <div>
              {[console.log('filename.js(11,22)'), console.log(111)]}</div>
              {console.error(4)}
            </div>
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
    if (path.node.isNew) {
      return;
    }
    const calleeName = generate(path.node.callee).code;
    if (targetCalleeName.includes(calleeName)) {
      const {
        line,
        column
      } = path.node.loc.start;

      const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true;

      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]))
        path.skip();
      } else {
        path.insertBefore(newNode);
      }
    }
  }
});

const {
  code,
  map
} = generate(ast);
console.log(code);
