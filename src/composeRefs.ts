import React from "react";
import { resolveRefs } from "./resolveRefs";

export function composeRefs<V>(
  ...refs: React.ForwardedRef<V>[]
): React.RefCallback<V> {
  return (value: V) => {
    resolveRefs(value, ...refs);
  };
}
