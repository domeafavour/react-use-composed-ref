import React from "react";
import { resolveRef } from "./resolveRef";

export function resolveRefs<V>(
  value: V,
  ...refs: React.ForwardedRef<V>[]
): (() => void)[] {
  const cleanups: (() => void)[] = [];

  refs.forEach((ref) => {
    const cleanup = resolveRef(value, ref);
    if (cleanup) {
      cleanups.push(cleanup);
    }
  });

  return cleanups;
}
