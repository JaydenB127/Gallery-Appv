import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PhotoCard from "../components/PhotoCard";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Load danh sách ảnh khi vào trang
  const fetchPhotos = async (q = "") => {
    try {
      const endpoint = q ? `/photos/search?q=${q}` : "/photos/";
      const res = await api.get(endpoint);
      setPhotos(res.data);
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    fetchPhotos(q);
  };

  // Xử lý upload ảnh
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    try {
      await api.post("/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setDescription("");
      setFile(null);
      fetchPhotos();
    } catch (err) {
      alert("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>📷 Thư viện ảnh của tôi</h2>
        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
      </div>

      {/* Form upload */}
      <form onSubmit={handleUpload} className="upload-form">
        <input
          placeholder="Tên ảnh *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Mô tả (tuỳ chọn)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Đang tải..." : "Upload ảnh"}
        </button>
      </form>

      {/* Tìm kiếm */}
      <input
        className="search-input"
        placeholder="🔍 Tìm kiếm theo tên ảnh..."
        value={search}
        onChange={handleSearch}
      />

      {/* Danh sách ảnh */}
      {photos.length === 0 ? (
        <p className="empty-msg">Chưa có ảnh nào. Hãy upload ảnh đầu tiên!</p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onRefresh={() => fetchPhotos(search)} />
          ))}
        </div>
      )}
    </div>
  );
}
