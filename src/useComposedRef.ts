import React, { useMemo } from "react";
import { composeRefs } from "./composeRefs";

export function useComposedRef<T>(
  ...refs: ReadonlyArray<React.Ref<T>>
): React.RefCallback<T> {
  return useMemo(() => composeRefs(...refs), refs /** React.DependencyList */);
}
