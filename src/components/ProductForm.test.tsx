import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductForm from "./ProductForm";

afterEach(cleanup);

describe("ProductForm", () => {
  it("reports the entered product name when submitted", () => {
    const onCreate = vi.fn();
    const onNameChange = vi.fn();
    render(
      <ProductForm
        name="Mechanical Keyboard"
        loading={false}
        onNameChange={onNameChange}
        onCreate={onCreate}
      />,
    );

    fireEvent.submit(screen.getByRole("button", { name: "Add Product" }));

    expect(onCreate).toHaveBeenCalledWith("Mechanical Keyboard");
  });

  it("does not submit a blank product name", () => {
    const onCreate = vi.fn();
    render(
      <ProductForm
        name="  "
        loading={false}
        onNameChange={vi.fn()}
        onCreate={onCreate}
      />,
    );

    fireEvent.submit(screen.getByRole("button", { name: "Add Product" }));

    expect(onCreate).not.toHaveBeenCalled();
  });

  it("disables submission while saving", () => {
    render(
      <ProductForm
        name="Keyboard"
        loading
        onNameChange={vi.fn()}
        onCreate={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Saving Item..." })).toBeDisabled();
  });
});
