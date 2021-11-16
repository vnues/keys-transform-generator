import { CamelCase, CamelCasedPropertiesDeep, SnakeCase, SnakeCasedPropertiesDeep } from 'type-fest';

/**
Return a default type if input type is nil.
@template T - Input type.
@template U - Default type.
*/
export type WithDefault<T, U extends T> = T extends undefined | null ? U : T;

export type EmptyTuple = [];

/**
Append a segment to dot-notation path.
*/
export type AppendPath<S extends string, Last extends string> = S extends '' ? Last : `${S}.${Last}`;

/**
Check if an element is included in a tuple.
@template List - List of values.
@template Target - Target to search.
*/
type Includes<List extends readonly unknown[], Target> = List extends undefined
  ? false
  : List extends Readonly<EmptyTuple>
  ? false
  : List extends readonly [infer First, ...infer Rest]
  ? First extends Target
    ? true
    : Includes<Rest, Target>
  : boolean;

/**
Convert keys of an object to camelcase strings.
*/
export interface CamelCaseOptions {
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
}

type CamelCaseKeys<
  T extends Record<string, any> | readonly any[],
  Deep extends boolean,
  Exclude extends readonly unknown[],
  Path extends string = '',
> = T extends readonly any[]
  ? // Handle arrays or tuples.
    {
      [P in keyof T]: CamelCaseKeys<T[P], Deep, Exclude>;
    }
  : T extends Record<string, any>
  ? // Handle objects.
    {
      // P是在keyof T 并且这个P(T的key)是string类型 我们把他断言成布尔类型
      // T & string 这是排除 symbol 和 number 类型
      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
      // as [Includes<Exclude, P> 在input是新语法 在Typescript4.1新增的
      // Until now, mapped types could only produce new object types with keys that you provided them; however, lots of the time you want to be able to create new keys, or filter out keys, based on the inputs.
      [P in keyof T & string as [Includes<Exclude, P>] extends [true] ? P : CamelCase<P>]: [Deep] extends [true]
        ? T[P] extends Record<string, any>
          ? CamelCaseKeys<T[P], Deep, Exclude, AppendPath<Path, P>>
          : T[P]
        : T[P];
    }
  : // Return anything else as-is.
    T;

export type CamelCaseKeysWithOptions<
  T extends Record<string, any> | readonly any[],
  Options extends CamelCaseOptions = CamelCaseOptions,
> = CamelCaseKeys<
  T,
  // 根据不同的参数返回不同结果的TS类型
  WithDefault<Options['deep'], false>,
  WithDefault<Options['exclude'], EmptyTuple>
>;

type SnakeCaseKeys<
  T extends Record<string, any> | readonly any[],
  Deep extends boolean,
  Exclude extends readonly unknown[],
  Path extends string = '',
> = T extends readonly any[]
  ? // Handle arrays or tuples.
    {
      [P in keyof T]: SnakeCaseKeys<T[P], Deep, Exclude>;
    }
  : T extends Record<string, any>
  ? // Handle objects.
    {
      // P是在keyof T 并且这个P(T的key)是string类型 我们把他断言成布尔类型
      // T & string 这是排除 symbol 和 number 类型
      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
      // as [Includes<Exclude, P> 在input是新语法 在Typescript4.1新增的
      // Until now, mapped types could only produce new object types with keys that you provided them; however, lots of the time you want to be able to create new keys, or filter out keys, based on the inputs.
      [P in keyof T & string as [Includes<Exclude, P>] extends [true] ? P : SnakeCase<P>]: [Deep] extends [true]
        ? T[P] extends Record<string, any>
          ? SnakeCaseKeys<T[P], Deep, Exclude, AppendPath<Path, P>>
          : T[P]
        : T[P];
    }
  : // Return anything else as-is.
    T;

export interface SnakeCaseOptions {
  /**
  Recurse nested objects and objects in arrays.
  @default true
  */
  readonly deep?: boolean;
  /**
  Exclude keys from being snakeCased.
  @default []
  */
  readonly exclude?: ReadonlyArray<string | RegExp>;
}

export type SnakeCaseWithOptions<
  T extends Record<string, any> | readonly any[],
  Options extends SnakeCaseOptions,
> = SnakeCaseKeys<T, WithDefault<Options['deep'], false>, WithDefault<Options['exclude'], EmptyTuple>>;

export type SnakeCasedDeep<T> = SnakeCasedPropertiesDeep<T>;

export type CamelCasedDeep<T> = CamelCasedPropertiesDeep<T>;
