const uploadToCloudinary = async (file) => {
    if (!file) {
        console.log("No file provided to uploadToCloudinary");
        return null;
    }
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "konvo_unsigned"); 
    data.append("cloud_name", "dfdstompf"); 

    console.log("Uploading file to Cloudinary:", file);
    for (let pair of data.entries()) {
        console.log(pair[0]+ ':', pair[1]);
    }

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dfdstompf/image/upload", {
            method: "POST",
            body: data,
        });
        const result = await res.json();
        console.log("Cloudinary upload result:", result);
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