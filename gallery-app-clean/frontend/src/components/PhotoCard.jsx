import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PhotoCard({ photo, onRefresh }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation(); // Không mở detail khi click xóa
    if (!window.confirm("Xóa ảnh này?")) return;
    try {
      await api.delete(`/photos/${photo.id}`);
      onRefresh();
    } catch {
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="photo-card" onClick={() => navigate(`/photos/${photo.id}`)}>
      <img
        src={`http://localhost:8000${photo.image_url}`}
        alt={photo.title}
        className="card-image"
      />
      <div className="card-info">
        <p className="card-title">{photo.title}</p>
        <button className="card-delete-btn" onClick={handleDelete}>🗑️</button>
      </div>
    </div>
  );
}
