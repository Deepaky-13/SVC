import { useState } from "react";
import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const { refreshAuth } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await customFetch.post("/auth/login", form);
      navigate("/dashboard");
      await refreshAuth();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Welcome to SVC</h1>

        <form onSubmit={submit}>
          {error && <p className="error">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>

      {/* Floating squares */}
      <ul className="bg-bubbles">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>
    </div>
  );
};

export default LoginPage;
