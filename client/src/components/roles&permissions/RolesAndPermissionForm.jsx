import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

const SIDEBAR_PERMISSIONS = [
  { key: "dashboard_view", label: "Dashboard" },
  { key: "users_manage", label: "Users" },
  { key: "access_manage", label: "Access Control" },
  { key: "settings_view", label: "Settings" },
  { key: "categories_view", label: "Categories" },
  { key: "products_view", label: "Products" },
  { key: "purchases_view", label: "Purchases" },
  { key: "stocks_view", label: "Stocks" },
  { key: "sales_view", label: "Sales" },
  { key: "services_view", label: "Services" },
  { key: "customers_view", label: "Customers" },
];

const RolesAndPermissionForm = ({
  editUserId,
  editPermissions,
  clearEdit,
  onSuccess,
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState("");

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    customFetch.get("/users").then((res) => {
      setUsers(res.data || []);
    });
  }, []);

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (editUserId) {
      setSelectedUser(editUserId);
      setSelectedPermissions(editPermissions || []);
    }
  }, [editUserId, editPermissions]);

  /* ================= USER CHANGE ================= */
  const handleUserChange = (userId) => {
    setSelectedUser(userId);
    setSelectedPermissions([]);

    const user = users.find((u) => u.id === userId);
    setSelectedUserRole(user?.role || "");
  };

  /* ================= TOGGLE PERMISSION ================= */
  const togglePermission = (key) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!selectedUser) return alert("Select user");

    if (selectedUserRole === "Admin") {
      return alert("Admin user already has full access");
    }

    await customFetch.post("/user-permissions", {
      userId: selectedUser,
      permissions: selectedPermissions,
    });

    onSuccess();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
        {editUserId ? "Edit User Permissions" : "Assign User Permissions"}
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {/* USER SELECTION */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Select User
          </label>
          <select
            value={selectedUser}
            disabled={!!editUserId}
            onChange={(e) => handleUserChange(e.target.value)}
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* ADMIN INFO */}
        {selectedUserRole === "Admin" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <p className="text-sm text-blue-800 font-medium">
              ✓ Admin user has full access to all sidebar features
            </p>
          </div>
        )}

        {/* PERMISSIONS */}
        {selectedUser && selectedUserRole !== "Admin" && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Sidebar Permissions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIDEBAR_PERMISSIONS.map((p) => (
                <label
                  key={p.key}
                  className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(p.key)}
                    onChange={() => togglePermission(p.key)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    {p.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md"
          >
            Save Permissions
          </button>

          {editUserId && (
            <button
              onClick={clearEdit}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesAndPermissionForm;
