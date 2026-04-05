import path from "path";
import fs from "fs";

export const deleteImage = (imagePath) => {
    if (imagePath && imagePath !== "/images/default.jpg") {
        const relativeImagePath = imagePath.startsWith("/")
            ? imagePath.slice(1)
            : imagePath;

        const fullPath = path.join(process.cwd(), "public", relativeImagePath);

        fs.unlink(fullPath, (err) => {
            if (err) {
            console.log("Image deletion error:", err.message);
            }
        });
    }
}
