import React from "react";
import { resolveRef } from "./resolveRef";

export function resolveRefs<V>(value: V, ...refs: React.ForwardedRef<V>[]) {
  return refs.reduce(resolveRef, value);
}
