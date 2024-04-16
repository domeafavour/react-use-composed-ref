import React, { useMemo } from 'react';
import { composeRefs } from './composeRefs';

export function useComposedRef<T>(...refs: React.Ref<T>[]) {
  return useMemo(() => composeRefs(...refs), []);
}
