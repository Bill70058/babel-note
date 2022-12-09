## babel插件

### plugin使用

```json
{
  "plugins": ["pluginA", ["pluginB"], ["pluginC", {/* options */}]]
}
```
如果需要传参就用数组格式，第二个元素为参数。

### plugin格式
babel plugin有两种

> 返回对象的函数

第一种是一个函数返回一个对象的格式，对象里有 visitor、pre、post、inherits、manipulateOptions 等属性

```ts
export default function(api, options, dirname) {
  return {
    inherits: parentPlugin,
    manipulateOptions(options, parserOptions) {
        options.xxx = '';
    },
    pre(file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(file) {
      console.log(this.cache);
    }
  };
} 
```

插件函数有 3 个参数，api、options、dirname。

插件做的事情就是通过 api 拿到 types、template 等，通过 state.opts 拿到参数，然后通过 path 来修改 AST。可以通过 state 放一些遍历过程中共享的数据，通过 file 放一些整个插件都能访问到的一些数据，除了这两种之外，还可以通过 this 来传递本对象共享的数据

> 对象

插件的第二种格式就是直接写一个对象，不用函数包裹，这种方式用于不需要处理参数的情况

```ts
export default plugin =  {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
};
```

### preset

plugin 是单个转换功能的实现，当 plugin 比较多或者 plugin 的 options 比较多的时候就会导致使用成本升高。这时候可以封装成一个 preset，用户可以通过 preset 来批量引入 plugin 并进行一些配置。preset 就是对 babel 配置的一层封装。

#### 阶段总结
preset就是一套方案，包含许多插件

### ConfigItem
@babel/core 的包提供了 createConfigItem 的 api，用于创建配置项。我们之前都是字面量的方式创建的，当需要把配置抽离出去时，可以使用 createConfigItem

```ts
const pluginA = createConfigItem('pluginA');
const presetB = createConfigItem('presetsB', { options: 'bbb'})

export default obj = {
      plugins: [ pluginA ],
      presets: [ presetB ]
  }
}
```

### 顺序
1. 先应用plugin，再应用preset
2. plugin从签到后，preset从后到前

### 名字
babel 对插件名字的格式有一定的要求，比如最好包含 babel-plugin，如果不包含的话也会自动补充

规则比较多，总结一下就是 babel 希望插件名字中能包含 babel plugin，这样写 plugin 的名字的时候就可以简化，然后 babel 自动去补充。所以我们写的 babel 插件最好是 babel-plugin-xx 和 @scope/babel-plugin-xx 这两种，就可以简单写为 xx 和 @scope/xx。

写 babel 内置的 plugin 和 preset 的时候也可以简化，比如 @babel/preset-env 可以直接写@babel/env，babel 会自动补充为 @babel/preset-env。