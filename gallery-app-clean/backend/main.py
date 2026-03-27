from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import users, photos

# Tạo bảng trong database nếu chưa có
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gallery App")

# Cho phép React (localhost:5173) gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phục vụ file ảnh đã upload qua URL /uploads/...
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Đăng ký các router
app.include_router(users.router)
app.include_router(photos.router)


@app.get("/")
def root():
    return {"message": "Gallery App API đang chạy"}
