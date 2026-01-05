import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

const UserList = ({ refresh }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    customFetch.get("/users").then((res) => setUsers(res.data || []));
  }, [refresh]);

  const toggleActive = async (u) => {
    await customFetch.put(`/users/${u.id}`, {
      role: u.role,
      active: u.active ? 0 : 1,
    });

    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          User Management
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {users.length} {users.length === 1 ? "user" : "users"} total
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                User
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-3 sm:px-6 py-2 sm:py-4">
                  <span className="text-gray-900 font-medium text-xs sm:text-base break-words">
                    {u.username}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4">
                  <span
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === "Admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                  <button
                    onClick={() => toggleActive(u)}
                    className={`inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer hover:shadow-md ${
                      u.active
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {u.active ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">
                      No users found
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Create your first user to get started
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

export default UserList;
