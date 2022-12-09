/*
 * @Author: lzr lzr@email.com
 * @Date: 2022-12-06 16:41:04
 * @LastEditors: lzr lzr@email.com
 * @LastEditTime: 2022-12-06 16:48:14
 * @FilePath: /babel/tackPackagePlugin.js
 * @Description: 通过引用core编译代码将自定义的代码改造成插件形式
 */
const {
  transformFileSync
} = require('@babel/core');
const insertParametersPlugin = require('./parameters-insert-plugin');
const path = require('path');

const {
  code
} = transformFileSync(path.join(__dirname, './sourceCode.js'), {
  plugins: [insertParametersPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx']
  }
});

console.log(code);
