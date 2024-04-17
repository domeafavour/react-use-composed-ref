# React `useComposedRef` Hook

## Usage

```tsx
// AutoFocusInput.tsx
import React, { useRef, useEffect } from 'react';
import { useComposedRef } from 'react-use-composed-ref';

export const AutoFocusInput = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const composedRef = useComposedRef(inputRef, ref);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={composedRef} {...props} />;
});
```
