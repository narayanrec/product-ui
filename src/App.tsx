import { useCallback, useEffect, useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import type { Product } from "./types";

const API_URL = "http://localhost:8080/products";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to retrieve items.");
    return response.json();
  }, []);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((data) => {
        if (!active) return;
        setProducts(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Server connection offline.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [fetchProducts]);

  const handleCreateProduct = async (name: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to create product.");

      setNewProductName("");
      setProducts(await fetchProducts());
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create product.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-8">
        {/* Header Block */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Product Dashboard
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Manage your catalog items in real-time
          </p>
        </div>

        {/* Global Error Notice Bar */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        <ProductForm
          name={newProductName}
          loading={loading}
          onNameChange={setNewProductName}
          onCreate={handleCreateProduct}
        />

        <ProductList products={products} />
      </div>
    </div>
  );
}
