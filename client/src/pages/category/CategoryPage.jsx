import { useState } from "react";
import CategoryForm from "../../components/category/CategoryForm";
import CategoryList from "../../components/category/CategoryList";

export default function CategoryPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="mx-auto px-3 sm:px-6 py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Categories
        </h1>
        <p className="text-sm text-gray-500">Manage product categories</p>
      </div>

      {/* Form */}
      <CategoryForm onSuccess={() => setRefresh(!refresh)} />

      {/* List */}
      <CategoryList refresh={refresh} />
    </div>
  );
}
