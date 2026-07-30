import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import Usuarios from "../pages/Usuarios";
import Libros from "../pages/Libros";
import Prestamos from "../pages/Prestamos";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="libros" element={<Libros />} />
        <Route path="prestamos" element={<Prestamos />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;