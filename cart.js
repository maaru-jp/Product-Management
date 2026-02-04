
function checkout(){
  const cart = JSON.parse(localStorage.getItem("cart")||"[]");
  const text = cart.join(",");
  location.href = "https://line.me/R/oaMessage/@YOUR_LINE_ID/?訂單:"+text;
}
