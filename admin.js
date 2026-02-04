let imageURL = "";

upload.onclick = () => {
  cloudinary.openUploadWidget({
    cloudName: "YOUR_CLOUD_NAME",
    uploadPreset: "YOUR_UPLOAD_PRESET"
  }, (error, result) => {
    if (!error) {
      imageURL = result[0].secure_url;
      preview.src = imageURL;
    }
  });
};

function save() {
  if (!imageURL) {
    alert("請先上傳圖片");
    return;
  }

  db.collection("products").add({
    name: name.value,
    price: Number(price.value),
    category: category.value,
    tags: tags.value.split(",").map(t => t.trim()).filter(Boolean),
    soldout: soldout.checked,
    image: imageURL,
    created: new Date()
  });

  alert("商品已儲存");
}
