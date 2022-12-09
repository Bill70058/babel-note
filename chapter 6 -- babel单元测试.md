## babel的单元测试

### 测试方式
有三种测试方式，前面两种用到jest
1. AST测试，判断ast修改的对不对
2. 生成代码的快照测试，每次测试记录下快照，后面之前的对比下
3. babel提供的babel-plugin-tester

### babel-plugin-tester

babel-plugin-tester 就是对比生成的代码的方式来实现的。

可以直接对比输入输出的字符串，也可以对比文件，还可以对比快照：
```ts
import pluginTester from 'babel-plugin-tester';
import xxxPlugin from '../xxx-plugin';

pluginTester({
  plugin: xxxPlugin,
  fixtures: path.join(__dirname, '__fixtures__'), // 保存测试点的地方
  tests: {
    'case1:xxxxxx': '"hello";', // 输入输出都是同个字符串
    'case2:xxxxxx': { // 指定输入输出的字符串
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    'case3:xxxxxx': { // 指定输入输出的文件，和真实输出对比
      fixture: 'changed.js',
      outputFixture: 'changed-output.js',
    },
    'case4:xxxxxx': { // 指定输入字符串，输出到快照文件中，对比测试
      code: `
        function sayHi(person) {
          return 'Hello ' + person + '!'
        }
      `,
      snapshot: true,
    },
  },
});
```

这三种方式本质上都一样，但是根据情况，如果比较少的内容可以直接对比字符串，内容比较多的时候可以使用快照测试，或者指定输出内容，然后对比测试