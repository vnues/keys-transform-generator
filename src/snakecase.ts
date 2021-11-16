import mapObject from "map-obj";
import { snakeCase } from "snake-case";
import { SnakeCaseOptions, SnakeCaseWithOptions } from "@src/types";

export function snakecaseKeys<
  T extends Record<string, any> | readonly any[],
  Options extends SnakeCaseOptions = SnakeCaseOptions
>(input: T, options?: Options): SnakeCaseWithOptions<T, Options> {
  options = { deep: true, exclude: [], ...options } as Options;
  if (Array.isArray(input as readonly any[])) {
    return input.map((item: T) => snakecaseKeys<T, Options>(item, options));
  }
  return mapObject(
    input as Record<string, any>,
    (key: string, val: any) => [
      matches(options!.exclude!, key) ? key : snakeCase(key),
      val,
    ],
    options
  ) as SnakeCaseWithOptions<T, Options>;
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
