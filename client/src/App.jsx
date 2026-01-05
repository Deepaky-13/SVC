import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./utils/protectetRoutes";
import LoginPage from "./pages/LoginPage";

// PAGES
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

import CategoryPage from "./pages/category/CategoryPage";
import ProductPage from "./pages/products/ProductPage";
import PurchasePage from "./pages/purchase/PurchasePage";
import StockPage from "./pages/stock/StockPage";

import SalesPage from "./pages/sales/SalesPage";
import SalesDetailsPage from "./components/sales/SalesDetails";

import ServicePage from "./pages/service/ServicePage";
import ServiceDetails from "./components/service/ServiceDetails";

// import CustomerPage from "./pages/customer/CustomerPage";
// import CustomerDetailsPage from "./pages/customer/CustomerDetailsPage";
import RolesAndPermissionPage from "./pages/roles&permissions/RolesAndPermissionPage";
import UserPage from "./pages/users/UserPage";

/* ================= ROUTER ================= */

const router = createBrowserRouter([
  /* ---------------- LOGIN (NO LAYOUT) ---------------- */
  {
    path: "/login",
    element: <LoginPage />,
  },

  /* ---------------- MAIN APP ---------------- */
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      /* DEFAULT */
      {
        index: true,
        element: (
          <ProtectedRoute permission="dashboard_view">
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      /* DASHBOARD */
      {
        path: "dashboard",
        element: (
          <ProtectedRoute permission="dashboard_view">
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      /* SETTINGS */
      {
        path: "settings",
        element: (
          <ProtectedRoute permission="settings_view">
            <Settings />
          </ProtectedRoute>
        ),
      },

      /* ACCESS CONTROL */
      {
        path: "access-control",
        element: (
          <ProtectedRoute permission="access_manage">
            <RolesAndPermissionPage />
          </ProtectedRoute>
        ),
      },

      /* USERS */
      {
        path: "users",
        element: (
          <ProtectedRoute permission="users_manage">
            <UserPage />
          </ProtectedRoute>
        ),
      },

      /* CATEGORIES */
      {
        path: "categories",
        element: (
          <ProtectedRoute permission="categories_view">
            <CategoryPage />
          </ProtectedRoute>
        ),
      },

      /* PRODUCTS */
      {
        path: "products",
        element: (
          <ProtectedRoute permission="products_view">
            <ProductPage />
          </ProtectedRoute>
        ),
      },

      /* PURCHASES */
      {
        path: "purchases",
        element: (
          <ProtectedRoute permission="purchases_view">
            <PurchasePage />
          </ProtectedRoute>
        ),
      },

      /* STOCK */
      {
        path: "stocks",
        element: (
          <ProtectedRoute permission="stocks_view">
            <StockPage />
          </ProtectedRoute>
        ),
      },

      /* SALES */
      {
        path: "sales",
        element: (
          <ProtectedRoute permission="sales_view">
            <SalesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sales/:id",
        element: (
          <ProtectedRoute permission="sales_view">
            <SalesDetailsPage />
          </ProtectedRoute>
        ),
      },

      /* SERVICES */
      {
        path: "services",
        element: (
          <ProtectedRoute permission="services_view">
            <ServicePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "services/:id",
        element: (
          <ProtectedRoute permission="services_view">
            <ServiceDetails />
          </ProtectedRoute>
        ),
      },

      /* CUSTOMERS */
      // {
      //   path: "customers",
      //   element: (
      //     <ProtectedRoute permission="customers_view">
      //       <CustomerPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "customers/:id",
      //   element: (
      //     <ProtectedRoute permission="customers_view">
      //       <CustomerDetailsPage />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },

  /* ---------------- FALLBACK ---------------- */
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

/* ================= APP ================= */

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
