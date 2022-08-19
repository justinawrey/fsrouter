// Extracts the type of the value of a Map
type MapValueType<A> = A extends Map<unknown, infer V> ? V : never;

export type { MapValueType };
