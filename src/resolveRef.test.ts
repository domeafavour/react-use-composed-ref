import { describe, it, expect, vi } from 'vitest';
import { resolveRef } from './resolveRef';

describe('resolveRef', () => {
  it('should do nothing when ref is null', () => {
    const value = 'test-value';
    const result = resolveRef(value, null);
    expect(result).toBeUndefined();
  });

  it('should do nothing when ref is undefined', () => {
    const value = 'test-value';
    const result = resolveRef(value, null);
    expect(result).toBeUndefined();
  });

  it('should call ref callback with value', () => {
    const value = 'test-value';
    const refCallback = vi.fn();
    
    resolveRef(value, refCallback);
    
    expect(refCallback).toHaveBeenCalledWith(value);
    expect(refCallback).toHaveBeenCalledTimes(1);
  });

  it('should return cleanup function when ref callback returns a function', () => {
    const value = 'test-value';
    const cleanup = vi.fn();
    const refCallback = vi.fn(() => cleanup);
    
    const result = resolveRef(value, refCallback);
    
    expect(refCallback).toHaveBeenCalledWith(value);
    expect(result).toBe(cleanup);
  });

  it('should not return cleanup when ref callback returns undefined', () => {
    const value = 'test-value';
    const refCallback = vi.fn(() => undefined);
    
    const result = resolveRef(value, refCallback);
    
    expect(refCallback).toHaveBeenCalledWith(value);
    expect(result).toBeUndefined();
  });

  it('should set ref.current when ref is a RefObject', () => {
    const value = 'test-value';
    const refObject = { current: null };
    
    resolveRef(value, refObject);
    
    expect(refObject.current).toBe(value);
  });

  it('should update ref.current when value changes', () => {
    const refObject = { current: null };
    
    resolveRef('first-value', refObject);
    expect(refObject.current).toBe('first-value');
    
    resolveRef('second-value', refObject);
    expect(refObject.current).toBe('second-value');
  });

  it('should handle DOM element refs', () => {
    const element = document.createElement('div');
    const refObject = { current: null };
    
    resolveRef(element, refObject);
    
    expect(refObject.current).toBe(element);
  });

  it('should handle cleanup function with DOM element', () => {
    const element = document.createElement('div');
    const cleanup = vi.fn();
    const refCallback = vi.fn(() => cleanup);
    
    const result = resolveRef(element, refCallback);
    
    expect(refCallback).toHaveBeenCalledWith(element);
    expect(result).toBe(cleanup);
    
    // Verify cleanup can be called
    if (result) {
      result();
      expect(cleanup).toHaveBeenCalledTimes(1);
    }
  });
});
