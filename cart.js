let cart=JSON.parse(localStorage.getItem("cart"))||[];
function addToCart(id){const i=cart.find(x=>x.id===id);if(i)i.qty++;else cart.push({id,qty:1});localStorage.setItem("cart",JSON.stringify(cart));}
function checkout(){let t="🛒 MAARU 訂單送出\n";cart.forEach(c=>t+=`商品 ${c.id} x${c.qty}\n`);location.href="https://line.me/R/oaMessage/@YOUR_LINE_ID/?text="+encodeURIComponent(t);}