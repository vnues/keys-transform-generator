# vuex-setup-helpers

Vuex4没有实现在Vue组合api中使用的辅助工具函数如`（mapState,mapGetters,mapMutations,mapAction）`

> `@tencent/vuex-setup-helpers`能够让你在Vue的组合api中轻松使用的辅助工具hooks


## 安装

```shell
$ npm install @tencent/vuex-setup-helpers
```

## 基本用法

### 手动传入store

```ts
import { useStore } from 'vuex';
import { useState,useGetters,useMutations,useActions } from '@tencent/vuex-setup-helpers';

const store =useStore();
// 使用useState获取state
const { count } = useState(store,['count']);
// 使用useGetters获取getters
const { sum } = useGetters(store,['sum']);
// 使用useMutations获取mutations
const { increment } = useMutations(store,['increment']);
// 使用useActions获取actions
const { getData } = useActions(store,['getData']);

```

### 无需传入store

> 会自动获取全局的$store


```ts
import { useState,useGetters,useMutations,useActions } from '@tencent/vuex-setup-helpers';

// 使用useState获取state
const { count } = useState(['count']);
// 使用useGetters获取getters
const { sum } = useGetters(['sum']);
// 使用useMutations获取mutations
const { increment } = useMutations(['increment']);
// 使用useActions获取actions
const { getData } = useActions(['getData']);

```


## 命名空间


### 写法一

```ts
import { useStore } from 'vuex';
import { useNamespacedState,useNamespacedMutations } from '@tencent/vuex-setup-helpers';

const { name } = useNamespacedState('foo',['name']);
const { add } = useNamespacedMutations('foo',['add']);
```

### 写法二

> 借助useNamespacedHelpers

```ts
const { useState, useMutations} = useNamespacedHelpers('foo');
const {name} =  useState(['name']);
const {add} = useMutations(['add']);
```