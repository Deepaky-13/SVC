import { useState } from "react";
import customFetch from "../../utils/customFetch";

const UserForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    await customFetch.post("/users", {
      username: form.username,
      password: form.password,
      role: form.role,
    });

    setForm({
      username: "",
      password: "",
      role: "",
    });

    onSuccess();
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5">
        Create New User
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex flex-col">
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            placeholder="Enter username"
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 rounded-lg text-sm sm:text-base transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
      >
        Create User
      </button>
    </form>
  );
};

export default UserForm;
