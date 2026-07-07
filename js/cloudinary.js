const CLOUD_NAME = "gtkpnjs0";
const UPLOAD_PRESET = "ranger_uploads";

export async function uploadImage(file) {

    if (!file) return null;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (data.secure_url) {

        return data.secure_url;

    }

    throw new Error("Image upload failed.");

}