const uploadToCloudinary = async (file) => {
    if (!file) {
        return null;
    }
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "konvo_unsigned"); 
    data.append("cloud_name", "dfdstompf"); 

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dfdstompf/image/upload", {
            method: "POST",
            body: data,
        });
        const result = await res.json();
        if (result.secure_url) {
            return result.secure_url;
        } else {
            throw new Error(result.error?.message || "Upload failed");
        }
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return null;
    }
};

export default uploadToCloudinary; 