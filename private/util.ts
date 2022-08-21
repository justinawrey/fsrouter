// Extracts the type of the value of a Map
export type MapValueType<A> = A extends Map<unknown, infer V> ? V : never;
