import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/photos", tags=["photos"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=schemas.PhotoOut)
async def upload_photo(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # Kiểm tra đúng định dạng ảnh
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file ảnh")

    # Lưu file với tên ngẫu nhiên để tránh trùng
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    image_url = f"/uploads/{filename}"

    photo = models.Photo(
        title=title,
        description=description,
        image_url=image_url,
        user_id=current_user.id,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.get("/", response_model=List[schemas.PhotoOut])
def get_photos(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return db.query(models.Photo).filter(models.Photo.user_id == current_user.id).all()


@router.get("/search", response_model=List[schemas.PhotoOut])
def search_photos(
    q: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Photo)
        .filter(
            models.Photo.user_id == current_user.id,
            models.Photo.title.ilike(f"%{q}%"),
        )
        .all()
    )


@router.get("/{photo_id}", response_model=schemas.PhotoOut)
def get_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    photo = db.query(models.Photo).filter(
        models.Photo.id == photo_id,
        models.Photo.user_id == current_user.id
    ).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    return photo


@router.put("/{photo_id}", response_model=schemas.PhotoOut)
def update_photo(
    photo_id: int,
    update_data: schemas.PhotoUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    photo = db.query(models.Photo).filter(
        models.Photo.id == photo_id,
        models.Photo.user_id == current_user.id
    ).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")

    if update_data.title is not None:
        photo.title = update_data.title
    if update_data.description is not None:
        photo.description = update_data.description

    db.commit()
    db.refresh(photo)
    return photo


@router.delete("/{photo_id}")
def delete_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    photo = db.query(models.Photo).filter(
        models.Photo.id == photo_id,
        models.Photo.user_id == current_user.id
    ).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")

    # Xóa file ảnh khỏi ổ đĩa
    filepath = photo.image_url.lstrip("/")
    if os.path.exists(filepath):
        os.remove(filepath)

    db.delete(photo)
    db.commit()
    return {"message": "Đã xóa ảnh thành công"}
