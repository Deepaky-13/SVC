import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  console.log(user);

  // * Not logged in → don't show layout
  // if (!user) return <Outlet />;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
