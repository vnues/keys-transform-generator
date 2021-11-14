import mapObj, { Mapper } from 'map-obj';
import camelCase from 'camelcase';
import QuickLru from 'quick-lru';
import { CamelCase, PascalCase } from 'type-fest';

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

export interface KeysTransformOptions {
  /**
		Recurse nested objects and objects in arrays.
		@default false
		*/
  readonly deep?: boolean;
  /**
		Exclude keys from being camel-cased.
		If this option can be statically determined, it's recommended to add `as const` to it.
		@default []
		*/
  readonly exclude?: ReadonlyArray<string | RegExp>;
  /**
		Exclude children at the given object paths in dot-notation from being camel-cased. For example, with an object like `{a: {b: '🦄'}}`, the object path to reach the unicorn is `'a.b'`.
		If this option can be statically determined, it's recommended to add `as const` to it.
		@default []
		@example
		```
		camelcaseKeys({
			a_b: 1,
			a_c: {
				c_d: 1,
				c_e: {
					e_f: 1
				}
			}
		}, {
			deep: true,
			stopPaths: [
				'a_c.c_e'
			]
		}),
		// {
		// 	aB: 1,
		// 	aC: {
		// 		cD: 1,
		// 		cE: {
		// 			e_f: 1
		// 		}
		// 	}
		// }
		```
		*/
  readonly stopPaths?: readonly string[];
  /**
		Uppercase the first character as in `bye-bye` → `ByeBye`.
		@default false
		*/
  readonly pascalCase?: boolean;
}

const camelCaseConvert = <
  T extends Record<string, any> | readonly any[],
  Options extends KeysTransformOptions = KeysTransformOptions,
>(
  input: T,
  options?: Options,
) => {
  if (!isObject(input)) {
    return input;
  }

  if (!options) {
    options = {
      deep: false,
      pascalCase: false,
    };
  }

  const { exclude, pascalCase, stopPaths, deep } = options!;

  const stopPathsSet = new Set(stopPaths);

  const makeMapper = (parentPath: string | undefined) => (key: string, value: any) => {
    if (deep && isObject(value)) {
      const path = parentPath === undefined ? key : `${parentPath}.${key}`;

      if (!stopPathsSet.has(path)) {
        value = mapObj(value, makeMapper(path) as any);
      }
    }

    if (!(exclude && has(exclude, key))) {
      const cacheKey = pascalCase ? `${key}_` : key;

      if (cache.has(cacheKey)) {
        key = cache.get(cacheKey);
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

  return mapObj(input, makeMapper(undefined) as any);
};

/**
Return a default type if input type is nil.
@template T - Input type.
@template U - Default type.
*/
type WithDefault<T, U extends T> = T extends undefined | void | null ? U : T;

type EmptyTuple = [];

/**
Check if an element is included in a tuple.
TODO: Remove this once https://github.com/sindresorhus/type-fest/pull/217 is merged.
*/
type IsInclude<List extends readonly unknown[], Target> = List extends undefined
  ? false
  : List extends Readonly<EmptyTuple>
  ? false
  : List extends readonly [infer First, ...infer Rest]
  ? First extends Target
    ? true
    : IsInclude<Rest, Target>
  : boolean;

/**
Append a segment to dot-notation path.
*/
type AppendPath<S extends string, Last extends string> = S extends '' ? Last : `${S}.${Last}`;
/**
Convert keys of an object to camelcase strings.
*/
type CamelCaseKeys<
  T extends Record<string, any> | readonly any[],
  Deep extends boolean,
  IsPascalCase extends boolean,
  Exclude extends readonly unknown[],
  StopPaths extends readonly string[],
  Path extends string = '',
> = T extends readonly any[]
  ? // Handle arrays or tuples.
    {
      [P in keyof T]: CamelCaseKeys<T[P], Deep, IsPascalCase, Exclude, StopPaths>;
    }
  : T extends Record<string, any>
  ? // Handle objects.
    {
      [P in keyof T & string as [IsInclude<Exclude, P>] extends [true]
        ? P
        : [IsPascalCase] extends [true]
        ? PascalCase<P>
        : CamelCase<P>]: [IsInclude<StopPaths, AppendPath<Path, P>>] extends [true]
        ? T[P]
        : [Deep] extends [true]
        ? CamelCaseKeys<T[P], Deep, IsPascalCase, Exclude, StopPaths, AppendPath<Path, P>>
        : T[P];
    }
  : // Return anything else as-is.
    T;

export default function camelcaseKeys<
  T extends Record<string, any> | readonly any[],
  Options extends KeysTransformOptions = KeysTransformOptions,
>(
  input: T,
  options: Options,
): CamelCaseKeys<
  T,
  // 根据不同的参数返回不同结果的TS类型
  WithDefault<Options['deep'], false>,
  WithDefault<Options['pascalCase'], false>,
  WithDefault<Options['exclude'], EmptyTuple>,
  WithDefault<Options['stopPaths'], EmptyTuple>
> {
  // if (Array.isArray(input)) {
  //   return Object.keys(input).map((key) => camelCaseConvert<T, Options>(input[key], options));
  // }

  return camelCaseConvert<T, Options>(input, options);
}
