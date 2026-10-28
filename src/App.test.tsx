import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("loads inventory and refreshes it after creating a product", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 1, name: "Mouse" }])),
      )
      .mockResolvedValueOnce(new Response(null, { status: 201 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { id: 1, name: "Mouse" },
            { id: 2, name: "Mechanical Keyboard" },
          ]),
        ),
      );

    render(<App />);

    expect(await screen.findByText("Mouse")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Product Name"), {
      target: { value: "Mechanical Keyboard" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    expect(
      await screen.findByText("Mechanical Keyboard"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Product Name")).toHaveValue("");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/products",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Mechanical Keyboard" }),
      }),
    );
    await waitFor(() => {
      expect(screen.getByText("Current Inventory (2)")).toBeInTheDocument();
    });
  });

  it("shows a creation error and keeps the entered name when creation fails", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));

    render(<App />);
    fireEvent.change(screen.getByLabelText("Product Name"), {
      target: { value: "Mechanical Keyboard" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    expect(
      await screen.findByText("Failed to create product."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Product Name")).toHaveValue(
      "Mechanical Keyboard",
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
