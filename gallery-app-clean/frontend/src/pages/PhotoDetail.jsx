import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    api.get(`/photos/${id}`)
      .then((res) => {
        setPhoto(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
      })
      .catch(() => navigate("/gallery"));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/photos/${id}`, { title, description });
      setPhoto((prev) => ({ ...prev, title, description }));
      setEditing(false);
    } catch {
      alert("Cập nhật thất bại");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    try {
      await api.delete(`/photos/${id}`);
      navigate("/gallery");
    } catch {
      alert("Xóa thất bại");
    }
  };

  if (!photo) return <p>Đang tải...</p>;

  return (
    <div className="detail-container">
      <button onClick={() => navigate("/gallery")} className="back-btn">← Quay lại</button>

      <img
        src={`http://localhost:8000${photo.image_url}`}
        alt={photo.title}
        className="detail-image"
      />

      {editing ? (
        <div className="edit-form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên ảnh" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả" />
          <div className="edit-actions">
            <button onClick={handleUpdate} className="save-btn">Lưu</button>
            <button onClick={() => setEditing(false)} className="cancel-btn">Huỷ</button>
          </div>
        </div>
      ) : (
        <div className="detail-info">
          <h2>{photo.title}</h2>
          <p>{photo.description || "Không có mô tả"}</p>
          <p className="upload-date">
            Tải lên: {new Date(photo.uploaded_at).toLocaleString("vi-VN")}
          </p>
          <div className="detail-actions">
            <button onClick={() => setEditing(true)} className="edit-btn">✏️ Chỉnh sửa</button>
            <button onClick={handleDelete} className="delete-btn">🗑️ Xóa ảnh</button>
          </div>
        </div>
      )}
    </div>
  );
}
