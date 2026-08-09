import os
import uuid


class ImageService:

    UPLOAD_DIR = "uploads/donations"

    @staticmethod
    def save_image(
        image_data: bytes,
        original_filename: str
    ) -> str:

        os.makedirs(
            ImageService.UPLOAD_DIR,
            exist_ok=True
        )

        extension = os.path.splitext(
            original_filename
        )[1].lower()

        filename = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            ImageService.UPLOAD_DIR,
            filename
        )

        with open(file_path, "wb") as buffer:
            buffer.write(image_data)

        return {
    "file_path": file_path,
    "image_url": f"/uploads/donations/{filename}"
}