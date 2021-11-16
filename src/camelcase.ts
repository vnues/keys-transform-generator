import camelCase from "camelcase";
import mapObject from "map-obj";

import { CamelCaseKeysWithOptions, CamelCaseOptions } from "@src/types";

export function camelcaseKeys<
  T extends Record<string, any> | readonly any[],
  Options extends CamelCaseOptions = CamelCaseOptions
>(input: T, options?: Options): CamelCaseKeysWithOptions<T, Options> {
  options = { deep: true, exclude: [], ...options } as Options;
  if (Array.isArray(input as readonly any[])) {
    return input.map((item: T) => camelcaseKeys<T, Options>(item, options));
  }
  return mapObject(
    input as Record<string, any>,
    (key: string, val: any) => [
      matches(options!.exclude!, key) ? key : camelCase(key),
      val,
    ],
    options
  ) as CamelCaseKeysWithOptions<T, Options>;
}

function matches(
  patterns: ReadonlyArray<string | RegExp>,
  value: string
): boolean {
  return patterns.some((pattern: string | RegExp) => {
    return typeof pattern === "string"
      ? pattern === value
      : pattern.test(value);
  });
}
