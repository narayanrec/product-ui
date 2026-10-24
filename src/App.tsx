import { useState, useEffect } from "react";

// Define structural layout for a product model mapping
interface Product {
  id?: number;
  name: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080/products";

  // 1. Fetch existing data records from your database on component initial load
  const fetchProducts = async () => {
    try {
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to retrieve items.");
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Server connection offline.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Post a fresh product payload back to the database
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProductName }),
      });

      if (!response.ok) throw new Error("Failed to create product.");

      setNewProductName("");
      // Refresh list immediately from server data trace
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
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

        {/* Product Creation Form */}
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="e.g., Mechanical Keyboard"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:indigo-500 sm:text-sm text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Saving Item..." : "Add Product"}
          </button>
        </form>

        {/* Dynamic Display Grid Matrix List */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Current Inventory ({products.length})
          </h2>
          {products.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No inventory items tracked yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="py-3 flex justify-between items-center text-sm"
                >
                  <span className="font-medium text-gray-800">
                    {product.name}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    ID: {product.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
