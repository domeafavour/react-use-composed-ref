# React `useComposedRef` Hook

A lightweight React hook for composing multiple refs into a single ref callback. Supports cleanup functions returned by ref callbacks.

## Installation

### npm

```bash
npm install react-use-composed-ref
```

### yarn

```bash
yarn add react-use-composed-ref
```

### pnpm

```bash
pnpm add react-use-composed-ref
```

## Features

- 🎯 Compose multiple refs (callback refs and RefObjects) into one
- 🧹 Automatically handles cleanup functions returned by ref callbacks
- 📦 Tiny bundle size with zero dependencies (except React peer dependency)
- 💪 Fully typed with TypeScript
- ✅ Thoroughly tested with Vitest

## Usage

### Basic Usage with `useComposedRef` Hook

```tsx
// AutoFocusInput.tsx
import React, { useRef, useEffect } from "react";
import { useComposedRef } from "react-use-composed-ref";

export const AutoFocusInput = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const composedRef = useComposedRef(inputRef, ref);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={composedRef} {...props} />;
});
```

### Cleanup Functions(React 19 Ref Cleanup Pattern)

The library automatically handles cleanup functions returned by ref callbacks, following React 19's ref cleanup pattern:

```tsx
import React from "react";
import { useComposedRef } from "react-use-composed-ref";

export const MyComponent = React.forwardRef((props, ref) => {
  const trackingRef = (element) => {
    if (element) {
      console.log("Element mounted:", element);

      // Return cleanup function
      return () => {
        console.log("Element unmounting:", element);
      };
    }
  };

  const composedRef = useComposedRef(trackingRef, ref);

  return <div ref={composedRef} {...props} />;
});
```

When a ref callback returns a cleanup function, it will be called when:

- The component unmounts
- The ref changes to a different element

## API

### `useComposedRef<T>(...refs: React.Ref<T>[]): React.RefCallback<T>`

A React hook that composes multiple refs into a single ref callback.

**Parameters:**

- `...refs`: Any number of refs (callback refs or RefObjects) to compose

**Returns:**

- A memoized ref callback that forwards the value to all provided refs

### `composeRefs<T>(...refs: React.ForwardedRef<T>[]): React.RefCallback<T>`

A utility function that composes multiple refs into a single ref callback.

**Parameters:**

- `...refs`: Any number of refs (callback refs or RefObjects) to compose

**Returns:**

- A ref callback that:
  - Forwards the value to all provided refs
  - Returns a cleanup function if any of the refs return cleanup functions

### `resolveRef<T>(value: T, ref: React.ForwardedRef<T>): void | (() => void)`

Resolves a single ref with a value.

**Parameters:**

- `value`: The value to assign to the ref
- `ref`: The ref to resolve (callback or RefObject)

**Returns:**

- The cleanup function if the ref callback returns one, otherwise `undefined`

### `resolveRefs<T>(value: T, ...refs: React.ForwardedRef<T>[]): (() => void)[]`

Resolves multiple refs with a value and collects cleanup functions.

**Parameters:**

- `value`: The value to assign to all refs
- `...refs`: The refs to resolve

**Returns:**

- An array of cleanup functions returned by ref callbacks

### `isRefCallback<T>(ref: React.ForwardedRef<T>): boolean`

Type guard to check if a ref is a callback ref.

**Parameters:**

- `ref`: The ref to check

**Returns:**

- `true` if the ref is a callback, `false` if it's a RefObject or null

## License

MIT
