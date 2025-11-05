import { describe, it, expect, vi } from 'vitest';
import { resolveRefs } from './resolveRefs';

describe('resolveRefs', () => {
  it('should return empty array when no refs provided', () => {
    const value = 'test-value';
    const cleanups = resolveRefs(value);
    
    expect(cleanups).toEqual([]);
  });

  it('should return empty array when all refs are null', () => {
    const value = 'test-value';
    const cleanups = resolveRefs(value, null, null, null);
    
    expect(cleanups).toEqual([]);
  });

  it('should call all ref callbacks with value', () => {
    const value = 'test-value';
    const ref1 = vi.fn();
    const ref2 = vi.fn();
    const ref3 = vi.fn();
    
    resolveRefs(value, ref1, ref2, ref3);
    
    expect(ref1).toHaveBeenCalledWith(value);
    expect(ref2).toHaveBeenCalledWith(value);
    expect(ref3).toHaveBeenCalledWith(value);
  });

  it('should set all RefObjects current property', () => {
    const value = 'test-value';
    const ref1 = { current: null };
    const ref2 = { current: null };
    const ref3 = { current: null };
    
    resolveRefs(value, ref1, ref2, ref3);
    
    expect(ref1.current).toBe(value);
    expect(ref2.current).toBe(value);
    expect(ref3.current).toBe(value);
  });

  it('should collect cleanup functions from ref callbacks', () => {
    const value = 'test-value';
    const cleanup1 = vi.fn();
    const cleanup2 = vi.fn();
    const cleanup3 = vi.fn();
    
    const ref1 = vi.fn(() => cleanup1);
    const ref2 = vi.fn(() => cleanup2);
    const ref3 = vi.fn(() => cleanup3);
    
    const cleanups = resolveRefs(value, ref1, ref2, ref3);
    
    expect(cleanups).toHaveLength(3);
    expect(cleanups).toEqual([cleanup1, cleanup2, cleanup3]);
  });

  it('should only collect cleanup functions that are returned', () => {
    const value = 'test-value';
    const cleanup1 = vi.fn();
    const cleanup3 = vi.fn();
    
    const ref1 = vi.fn(() => cleanup1);
    const ref2 = vi.fn(() => undefined);
    const ref3 = vi.fn(() => cleanup3);
    
    const cleanups = resolveRefs(value, ref1, ref2, ref3);
    
    expect(cleanups).toHaveLength(2);
    expect(cleanups).toEqual([cleanup1, cleanup3]);
  });

  it('should handle mixed ref types', () => {
    const value = 'test-value';
    const cleanup1 = vi.fn();
    
    const refCallback1 = vi.fn(() => cleanup1);
    const refObject = { current: null };
    const refCallback2 = vi.fn();
    
    const cleanups = resolveRefs(value, refCallback1, refObject, null, refCallback2);
    
    expect(refCallback1).toHaveBeenCalledWith(value);
    expect(refObject.current).toBe(value);
    expect(refCallback2).toHaveBeenCalledWith(value);
    expect(cleanups).toHaveLength(1);
    expect(cleanups[0]).toBe(cleanup1);
  });

  it('should handle DOM elements', () => {
    const element = document.createElement('div');
    const ref1 = { current: null };
    const ref2 = { current: null };
    const cleanup = vi.fn();
    const ref3 = vi.fn(() => cleanup);
    
    const cleanups = resolveRefs(element, ref1, ref2, ref3);
    
    expect(ref1.current).toBe(element);
    expect(ref2.current).toBe(element);
    expect(ref3).toHaveBeenCalledWith(element);
    expect(cleanups).toHaveLength(1);
    expect(cleanups[0]).toBe(cleanup);
  });

  it('should execute all collected cleanup functions', () => {
    const value = 'test-value';
    const cleanup1 = vi.fn();
    const cleanup2 = vi.fn();
    const cleanup3 = vi.fn();
    
    const ref1 = vi.fn(() => cleanup1);
    const ref2 = vi.fn(() => cleanup2);
    const ref3 = vi.fn(() => cleanup3);
    
    const cleanups = resolveRefs(value, ref1, ref2, ref3);
    
    cleanups.forEach(cleanup => cleanup());
    
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(cleanup2).toHaveBeenCalledTimes(1);
    expect(cleanup3).toHaveBeenCalledTimes(1);
  });
});
