import { describe, it, expect, vi } from 'vitest';
import type React from 'react';
import { composeRefs } from './composeRefs';

describe('composeRefs', () => {
  it('should return a ref callback function', () => {
    const composedRef = composeRefs();
    
    expect(typeof composedRef).toBe('function');
  });

  it('should call all ref callbacks when invoked', () => {
    const ref1 = vi.fn() as React.RefCallback<string>;
    const ref2 = vi.fn() as React.RefCallback<string>;
    const ref3 = vi.fn() as React.RefCallback<string>;
    
    const composedRef = composeRefs<string>(ref1, ref2, ref3);
    const value = 'test-value';
    
    composedRef(value);
    
    expect(ref1).toHaveBeenCalledWith(value);
    expect(ref2).toHaveBeenCalledWith(value);
    expect(ref3).toHaveBeenCalledWith(value);
  });

  it('should set all RefObjects current property when invoked', () => {
    const ref1: React.RefObject<string> = { current: null };
    const ref2: React.RefObject<string> = { current: null };
    const ref3: React.RefObject<string> = { current: null };
    
    const composedRef = composeRefs<string>(ref1, ref2, ref3);
    const value = 'test-value';
    
    composedRef(value);
    
    expect(ref1.current).toBe(value);
    expect(ref2.current).toBe(value);
    expect(ref3.current).toBe(value);
  });

  it('should handle mixed ref types', () => {
    const refCallback = vi.fn() as React.RefCallback<string>;
    const refObject: React.RefObject<string> = { current: null };
    
    const composedRef = composeRefs<string>(refCallback, refObject, null);
    const value = 'test-value';
    
    composedRef(value);
    
    expect(refCallback).toHaveBeenCalledWith(value);
    expect(refObject.current).toBe(value);
  });

  it('should return cleanup function when any ref returns cleanup', () => {
    const cleanup1 = vi.fn();
    const ref1 = vi.fn(() => cleanup1) as React.RefCallback<string>;
    const ref2: React.RefObject<string> = { current: null };
    
    const composedRef = composeRefs<string>(ref1, ref2);
    const value = 'test-value';
    
    const cleanup = composedRef(value);
    
    expect(typeof cleanup).toBe('function');
  });

  it('should return undefined when no ref returns cleanup', () => {
    const ref1 = vi.fn() as React.RefCallback<string>;
    const ref2: React.RefObject<string> = { current: null };
    
    const composedRef = composeRefs<string>(ref1, ref2);
    const value = 'test-value';
    
    const cleanup = composedRef(value);
    
    expect(cleanup).toBeUndefined();
  });

  it('should call all cleanup functions when cleanup is invoked', () => {
    const cleanup1 = vi.fn();
    const cleanup2 = vi.fn();
    const cleanup3 = vi.fn();
    
    const ref1 = vi.fn(() => cleanup1) as React.RefCallback<string>;
    const ref2 = vi.fn(() => cleanup2) as React.RefCallback<string>;
    const ref3 = vi.fn(() => cleanup3) as React.RefCallback<string>;
    
    const composedRef = composeRefs<string>(ref1, ref2, ref3);
    const value = 'test-value';
    
    const cleanup = composedRef(value) as (() => void) | undefined;
    
    expect(cleanup).toBeDefined();
    if (cleanup) cleanup();
    
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(cleanup2).toHaveBeenCalledTimes(1);
    expect(cleanup3).toHaveBeenCalledTimes(1);
  });

  it('should call only returned cleanup functions', () => {
    const cleanup1 = vi.fn();
    const cleanup3 = vi.fn();
    
    const ref1 = vi.fn(() => cleanup1) as React.RefCallback<string>;
    const ref2 = vi.fn(() => undefined) as React.RefCallback<string>;
    const ref3 = vi.fn(() => cleanup3) as React.RefCallback<string>;
    
    const composedRef = composeRefs<string>(ref1, ref2, ref3);
    const value = 'test-value';
    
    const cleanup = composedRef(value) as (() => void) | undefined;
    
    expect(cleanup).toBeDefined();
    if (cleanup) cleanup();
    
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(cleanup3).toHaveBeenCalledTimes(1);
  });

  it('should handle DOM element refs', () => {
    const element = document.createElement('div');
    const ref1: React.RefObject<HTMLDivElement> = { current: null };
    const ref2: React.RefObject<HTMLDivElement> = { current: null };
    
    const composedRef = composeRefs<HTMLDivElement>(ref1, ref2);
    
    composedRef(element);
    
    expect(ref1.current).toBe(element);
    expect(ref2.current).toBe(element);
  });

  it('should work with React ref pattern: set element then null', () => {
    const cleanup = vi.fn();
    const ref1 = vi.fn(() => cleanup) as React.RefCallback<HTMLDivElement>;
    const ref2: React.RefObject<HTMLDivElement> = { current: null };
    
    const composedRef = composeRefs<HTMLDivElement>(ref1, ref2);
    const element = document.createElement('div');
    
    // Mount: set element
    const cleanupFn = composedRef(element) as (() => void) | undefined;
    expect(ref1).toHaveBeenCalledWith(element);
    expect(ref2.current).toBe(element);
    
    // Unmount: call cleanup
    if (cleanupFn) cleanupFn();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple invocations with different values', () => {
    const ref1: React.RefObject<string | null> = { current: null };
    const ref2: React.RefObject<string | null> = { current: null };
    
    const composedRef = composeRefs<string | null>(ref1, ref2);
    
    composedRef('value1');
    expect(ref1.current).toBe('value1');
    expect(ref2.current).toBe('value1');
    
    composedRef('value2');
    expect(ref1.current).toBe('value2');
    expect(ref2.current).toBe('value2');
    
    composedRef(null);
    expect(ref1.current).toBe(null);
    expect(ref2.current).toBe(null);
  });

  it('should handle cleanup lifecycle with multiple invocations', () => {
    const cleanup1 = vi.fn();
    const cleanup2 = vi.fn();
    
    let callCount = 0;
    const ref = vi.fn(() => {
      callCount++;
      return callCount === 1 ? cleanup1 : cleanup2;
    }) as React.RefCallback<string>;
    
    const composedRef = composeRefs<string>(ref);
    
    // First invocation
    const firstCleanup = composedRef('value1') as (() => void) | undefined;
    expect(ref).toHaveBeenCalledWith('value1');
    
    // Second invocation
    const secondCleanup = composedRef('value2') as (() => void) | undefined;
    expect(ref).toHaveBeenCalledWith('value2');
    
    // Call cleanups
    if (firstCleanup) firstCleanup();
    expect(cleanup1).toHaveBeenCalledTimes(1);
    
    if (secondCleanup) secondCleanup();
    expect(cleanup2).toHaveBeenCalledTimes(1);
  });

  it('should work with empty refs array', () => {
    const composedRef = composeRefs();
    const value = 'test-value';
    
    const cleanup = composedRef(value);
    
    expect(cleanup).toBeUndefined();
  });
});
