import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

const RolesAndPermissionList = ({ refresh, onEdit }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    customFetch.get("/role-permissions").then((res) => {
      setData(res.data || []);
    });
  }, [refresh]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Assigned Permissions
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {data.length} {data.length === 1 ? "role" : "roles"} configured
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Sidebar Permissions
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr
                key={row.role}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-3 sm:px-6 py-2 sm:py-4">
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800">
                    {row.role}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {row.permissions && row.permissions.length > 0 ? (
                      row.permissions.map((p) => (
                        <span
                          key={p}
                          className="bg-gray-200 text-gray-800 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs sm:text-sm italic">
                        No permissions
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                  {row.role !== "Admin" ? (
                    <button
                      onClick={() => onEdit(row.role, row.permissions)}
                      className="cursor-pointer inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm transition-colors duration-200 hover:underline"
                    >
                      Edit
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm font-medium">
                      Full Access
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 sm:px-6 py-8 sm:py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                      <svg
                        className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">
                      No permissions assigned
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Create your first role permission assignment
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesAndPermissionList;
