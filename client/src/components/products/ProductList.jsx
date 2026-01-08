import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import customFetch from "../../utils/customFetch";

export default function ProductList({ onEdit, refresh }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await customFetch.get("/products");
      setRows(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const toggleStatus = async (row) => {
    await customFetch.patch(`/products/${row.id}/status`, {
      active: row.active ? 0 : 1,
    });
    fetchProducts();
  };

  if (loading) {
    return (
      <p className="py-10 text-center text-gray-500 animate-pulse">
        Loading products...
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100">
      {/* HEADER */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Product Management
        </h2>
        <p className="text-sm text-gray-500">{rows.length} products</p>
      </div>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full table-auto text-center">
          <thead className="bg-gray-10 sticky top-0 z-10">
            <tr className="text-center text-sm text-gray-700 border-b">
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3 text-center">Barcode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y text-center">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            )}

            {rows.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{row.category_name}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {row.name}
                </td>
                <td className="px-4 py-3">{row.brand}</td>

                <td className="px-4 py-3">
                  {row.barcode && (
                    <div className="flex flex-col items-center">
                      <Barcode
                        value={row.barcode}
                        format="CODE128"
                        width={1.2}
                        height={36}
                        displayValue={false}
                      />
                      <span className="text-xs mt-1 text-gray-500">
                        {row.barcode}
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {row.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="px-3 py-1.5 text-sm cursor-pointer rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(row)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition cursor-pointer ${
                      row.active
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {row.active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
