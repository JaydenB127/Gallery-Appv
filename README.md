# 📷 Gallery App
**Web Demo :

Ứng dụng thư viện ảnh cá nhân cho phép người dùng tải ảnh lên, xem và quản lý ảnh của mình.

## 🚀 Tính năng

- Đăng ký / Đăng nhập tài khoản
- Upload ảnh lên thư viện
- Xem danh sách ảnh dạng lưới
- Xem chi tiết từng ảnh
- Chỉnh sửa tên và mô tả ảnh
- Xóa ảnh
- Tìm kiếm ảnh theo tên

## 🛠️ Công nghệ sử dụng

| Phần | Công nghệ |
|------|-----------|
| Backend | FastAPI (Python) |
| Frontend | ReactJS + Vite |
| Database | SQLite |
| Auth | JWT Token |

## 📁 Cấu trúc project

```
gallery-app-clean/
├── backend/
│   ├── main.py           # Khởi động app, CORS, routes
│   ├── models.py         # Cấu trúc bảng database
│   ├── schemas.py        # Validate dữ liệu
│   ├── auth.py           # JWT, hash password
│   ├── database.py       # Kết nối SQLite
│   ├── requirements.txt  # Thư viện Python
│   └── routers/
│       ├── users.py      # API đăng ký, đăng nhập
│       └── photos.py     # API quản lý ảnh
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        ├── api/
        │   └── axios.js        # Cấu hình Axios + token
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Gallery.jsx
        │   └── PhotoDetail.jsx
        └── components/
            └── PhotoCard.jsx
```

## ⚙️ Cài đặt và chạy

### Yêu cầu
- Python 3.8+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend chạy tại: `http://localhost:8000`

Swagger API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## 📌 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/login` | Đăng nhập |
| GET | `/photos/` | Danh sách ảnh |
| POST | `/photos/upload` | Upload ảnh |
| GET | `/photos/{id}` | Chi tiết ảnh |
| PUT | `/photos/{id}` | Sửa tên/mô tả |
| DELETE | `/photos/{id}` | Xóa ảnh |
| GET | `/photos/search?q=` | Tìm kiếm ảnh |

## 🗄️ Cấu trúc dữ liệu

**User**
- id, username, email, password

**Photo**
- id, title, description, image_url, uploaded_at, user_id
