# keys-transform-generator

> 转换对象的 key，例如将 key 转化为驼峰形式，将 key 转化为下划线形式，适用于接口文档字段规范不统一的场景

## Install

```shell
npm install keys-transform-generator
```

## Usage

```ts
import { camelcaseKeys, snakecaseKeys } from '@src/index';
// 下划线转驼峰场景
const data = {
  foo_bar: 2,
  foo_gar: 3,
};
const options = { exclude: ['foo_gar'] as const };
const camelCaseData = camelcaseKeys<typeof data, typeof options>(data, options);

// 驼峰转下划线
const data = {
  fooBar: 2,
  fooGar: 3,
};
const options = { exclude: ['foo_gar'] as const };
const snakecaseData = snakecaseKeys<typeof data, typeof options>(data, options);
```

## Typescript Utils

### SnakeCasedDeep<T>

> 将接口的驼峰 key 转化为下划线

```ts
import { SnakeCasedDeep } from '@src/index';
// 用法
type RequestData = SnakeCasedDeep<DefaultRequestData>;
```

### CamelCasedDeep<T>

> 将接口的下划线 key 转化为驼峰

```ts
import { CamelCasedDeep } from '@src/index';

// 用法
type ResponseData = CamelCasedDeep<DefaultResponseData>;
```
