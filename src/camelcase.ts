import mapObject from 'map-obj';
import camelCase from 'camelcase';
import QuickLru from 'quick-lru';
import { CamelCaseKeysWithOptions, CamelCaseOptions } from '@src/types';

const has = (array: ReadonlyArray<string | RegExp>, key: string) =>
  array.some((x) => {
    if (typeof x === 'string') {
      return x === key;
    }

    x.lastIndex = 0;
    return x.test(key);
  });

const cache = new QuickLru({ maxSize: 100000 });

// Reproduces behavior from `map-obj`
const isObject = (value: Record<string, any> | readonly any[]) =>
  typeof value === 'object' &&
  value !== null &&
  !(value instanceof RegExp) &&
  !(value instanceof Error) &&
  !(value instanceof Date);

const camelCaseConvert = <
  T extends Record<string, any> | readonly any[] = any,
  Options extends CamelCaseOptions = CamelCaseOptions
>(
  input: T,
  options?: Options
): CamelCaseKeysWithOptions<T, Options> => {
  // 边界处理
  if (!isObject(input)) {
    return input as CamelCaseKeysWithOptions<T, Options>;
  }

  if (!options) {
    options = {
      deep: false,
      pascalCase: false,
    } as Options;
  }

  const { exclude, pascalCase, stopPaths, deep } = options!;

  const stopPathsSet = new Set(stopPaths);

  const makeMapper =
    (parentPath: string | undefined): any =>
    (key: string, value: any) => {
      if (deep && isObject(value)) {
        const path = parentPath === undefined ? key : `${parentPath}.${key}`;

        if (!stopPathsSet.has(path)) {
          value = mapObject(value, makeMapper(path));
        }
      }

      if (!(exclude && has(exclude, key))) {
        const cacheKey = pascalCase ? `${key}_` : key;

        if (cache.has(cacheKey)) {
          key = cache.get(cacheKey) as string;
        } else {
          const returnValue = camelCase(key, { pascalCase });

          if (key.length < 100) {
            // Prevent abuse
            cache.set(cacheKey, returnValue);
          }

          key = returnValue;
        }
      }

      return [key, value];
    };

  return mapObject(input, makeMapper(undefined)) as CamelCaseKeysWithOptions<
    T,
    Options
  >;
};

export function camelcaseKeys<
  T extends Record<string, any> | readonly any[],
  Options extends CamelCaseOptions = CamelCaseOptions
>(input: T, options?: Options): CamelCaseKeysWithOptions<T, Options> {
  if (Array.isArray(input as readonly any[])) {
    return input.map((item: T) => camelCaseConvert<T, Options>(item, options));
  }

  return camelCaseConvert<T, Options>(input, options);
}
