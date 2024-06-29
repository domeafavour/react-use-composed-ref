import type React from "react";
import { isRefCallback } from "./isRefCallback";

export function resolveRef<V>(value: V, ref: React.ForwardedRef<V>) {
  if (!ref) {
    return value;
  }
  if (isRefCallback(ref)) {
    ref(value);
  } else {
    ref.current = value;
  }
  return value;
}
