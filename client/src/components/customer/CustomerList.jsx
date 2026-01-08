import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

export default function CategoryList({ refresh }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    customFetch
      .get("/categories")
      .then((res) => {
        setCategories(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) {
    return (
      <div className="mt-4 text-sm text-gray-500">Loading categories...</div>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {categories.length === 0 ? (
        <div className="p-4 text-sm text-gray-500 text-center">
          No categories found
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {categories.map((c, index) => (
            <li
              key={c.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{index + 1}.</span>
                <span className="text-sm font-medium text-gray-800">
                  {c.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
