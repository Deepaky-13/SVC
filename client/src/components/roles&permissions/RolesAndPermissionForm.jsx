import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

const SIDEBAR_PERMISSIONS = [
  { key: "dashboard_view", label: "Dashboard" },
  { key: "users_manage", label: "Users" },
  { key: "access_manage", label: "Access Control" },
  { key: "settings_view", label: "Settings" },
];

const ROLES = ["Admin", "Staff"];

const RolesAndPermissionForm = ({
  editRole,
  editPermissions,
  clearEdit,
  onSuccess,
}) => {
  const [role, setRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (editRole) {
      setRole(editRole);
      setSelectedPermissions(editPermissions);
    }
  }, [editRole, editPermissions]);

  const togglePermission = (key) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (!role) return alert("Select role");
    if (role === "Admin") return alert("Admin has full access");

    await customFetch.post("/role-permissions", {
      role,
      permissions: selectedPermissions,
    });

    onSuccess();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
        {editRole ? "Edit Sidebar Permissions" : "Assign Sidebar Permissions"}
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {/* ROLE SELECTION */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Select Role
          </label>
          <select
            value={role}
            disabled={!!editRole}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* PERMISSIONS */}
        {role && role !== "Admin" && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Sidebar Permissions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIDEBAR_PERMISSIONS.map((p) => (
                <label
                  key={p.key}
                  className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(p.key)}
                    onChange={() => togglePermission(p.key)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    {p.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN INFO */}
        {role === "Admin" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <p className="text-sm text-blue-800 font-medium">
              ✓ Admin role has full access to all sidebar features
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            Save Permissions
          </button>

          {editRole && (
            <button
              onClick={clearEdit}
              className="border border-gray-300 hover:bg-gray-50 cursor-pointer text-gray-700 font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors duration-200 text-sm sm:text-base"
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
