import React from "react";
import { resolveRefs } from "./resolveRefs";

export function composeRefs<V>(
  ...refs: React.ForwardedRef<V>[]
): React.RefCallback<V> {
  return (value: V) => {
    const cleanups = resolveRefs(value, ...refs);

    // Return cleanup function if there are any cleanup functions to call
    if (cleanups.length > 0) {
      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    }
  };
}
