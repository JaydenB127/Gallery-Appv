import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import PhotoDetail from "./pages/PhotoDetail";
import "./App.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/gallery" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery" element={<PrivateRoute><Gallery /></PrivateRoute>} />
        <Route path="/photos/:id" element={<PrivateRoute><PhotoDetail /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
