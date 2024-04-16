import type React from 'react';

export function isRefCallback<T>(ref: unknown): ref is React.RefCallback<T> {
  return typeof ref === 'function';
}
