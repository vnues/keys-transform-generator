import { CamelCase, PascalCase, SnakeCase } from 'type-fest';

/**
Return a default type if input type is nil.
@template T - Input type.
@template U - Default type.
*/
export type WithDefault<T, U extends T> = T extends undefined | null ? U : T;

export type EmptyTuple = [];

/**
Check if an element is included in a tuple.
TODO: Remove this once https://github.com/sindresorhus/type-fest/pull/217 is merged.
*/
export type IsInclude<
  List extends readonly unknown[],
  Target
> = List extends undefined
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
export type AppendPath<S extends string, Last extends string> = S extends ''
  ? Last
  : `${S}.${Last}`;
/**
Convert keys of an object to camelcase strings.
*/
export type CamelCaseKeys<
  T extends Record<string, any> | readonly any[],
  Deep extends boolean,
  IsPascalCase extends boolean,
  Exclude extends readonly unknown[],
  StopPaths extends readonly string[],
  Path extends string = ''
> = T extends readonly any[]
  ? // Handle arrays or tuples.
    {
      [P in keyof T]: CamelCaseKeys<
        T[P],
        Deep,
        IsPascalCase,
        Exclude,
        StopPaths
      >;
    }
  : T extends Record<string, any>
  ? // Handle objects.
    {
      [P in keyof T & string as [IsInclude<Exclude, P>] extends [true]
        ? P
        : [IsPascalCase] extends [true]
        ? PascalCase<P>
        : CamelCase<P>]: [IsInclude<StopPaths, AppendPath<Path, P>>] extends [
        true
      ]
        ? T[P]
        : [Deep] extends [true]
        ? CamelCaseKeys<
            T[P],
            Deep,
            IsPascalCase,
            Exclude,
            StopPaths,
            AppendPath<Path, P>
          >
        : T[P];
    }
  : // Return anything else as-is.
    T;
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

export type CamelCaseKeysWithOptions<
  T extends Record<string, any> | readonly any[],
  Options extends CamelCaseOptions = CamelCaseOptions
> = CamelCaseKeys<
  T,
  // 根据不同的参数返回不同结果的TS类型
  WithDefault<Options['deep'], false>,
  WithDefault<Options['pascalCase'], false>,
  WithDefault<Options['exclude'], EmptyTuple>,
  WithDefault<Options['stopPaths'], EmptyTuple>
>;

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

type SnakeCaseKeys<
  T extends Record<string, any> | readonly any[],
  Deep extends boolean,
  Exclude extends readonly unknown[],
  Path extends string = ''
> = T extends readonly any[]
  ? // Handle arrays or tuples.
    {
      [P in keyof T]: SnakeCaseKeys<T[P], Deep, Exclude>;
    }
  : T extends Record<string, any>
  ? // Handle objects.
    {
      [P in keyof T & string as [Includes<Exclude, P>] extends [true]
        ? P
        : SnakeCase<P>]: [Deep] extends [true]
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
  Options extends SnakeCaseOptions
> = SnakeCaseKeys<
  T,
  WithDefault<Options['deep'], true>,
  WithDefault<Options['exclude'], EmptyTuple>
>;
