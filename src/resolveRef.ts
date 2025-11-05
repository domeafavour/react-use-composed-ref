import type React from "react";
import { isRefCallback } from "./isRefCallback";

export function resolveRef<V>(value: V, ref: React.ForwardedRef<V>): void | (() => void) {
  if (!ref) {
    return;
  }
  if (isRefCallback(ref)) {
    const cleanup = ref(value);
    // If the ref callback returns a cleanup function, return it
    if (typeof cleanup === 'function') {
      return cleanup;
    }
  } else {
    ref.current = value;
  }
}
