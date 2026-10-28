interface ProductFormProps {
  name: string;
  loading: boolean;
  onNameChange: (name: string) => void;
  onCreate: (name: string) => void;
}

export default function ProductForm({
  name,
  loading,
  onNameChange,
  onCreate,
}: ProductFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    onCreate(name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="product-name"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
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
  );
}
