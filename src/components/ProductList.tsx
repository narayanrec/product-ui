import type { Product } from "../types";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
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
              <span className="font-medium text-gray-800">{product.name}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                ID: {product.id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
