import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ProductList from "./ProductList";

afterEach(cleanup);

describe("ProductList", () => {
  it("shows an empty state when there are no products", () => {
    render(<ProductList products={[]} />);

    expect(screen.getByText("Current Inventory (0)")).toBeInTheDocument();
    expect(
      screen.getByText("No inventory items tracked yet."),
    ).toBeInTheDocument();
  });

  it("renders each product and the inventory count", () => {
    render(
      <ProductList
        products={[
          { id: 1, name: "Mechanical Keyboard" },
          { id: 2, name: "Wireless Mouse" },
        ]}
      />,
    );

    expect(screen.getByText("Current Inventory (2)")).toBeInTheDocument();
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("ID: 1")).toBeInTheDocument();
    expect(screen.getByText("ID: 2")).toBeInTheDocument();
  });
});
