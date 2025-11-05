import { render } from "@testing-library/react";
import React, { useEffect, useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useComposedRef } from "./useComposedRef";

describe("useComposedRef.test", () => {
  it("should work with multiple refs", () => {
    const cleanup = vi.fn();
    const refCallback = vi.fn(() => cleanup);
    function Comp() {
      const inputRef = useRef<HTMLInputElement | null>(null);
      useEffect(() => {
        inputRef.current?.focus();
      }, []);
      const ref = useComposedRef(inputRef, refCallback);
      return <input data-testid="input" ref={ref} />;
    }

    const result = render(<Comp />);
    expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    // focused
    expect(result.getByTestId("input")).toBe(document.activeElement);
    result.unmount();
    // cleaned up
    expect(cleanup).toHaveBeenCalled();
  });
});
