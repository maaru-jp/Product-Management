
const box = document.getElementById("products");
PRODUCTS.forEach(p=>{
  const d = document.createElement("div");
  d.innerHTML = `${p.name} $${p.price} <button onclick="add(${p.id})">加入</button>`;
  box.appendChild(d);
});
function add(id){
  let c = JSON.parse(localStorage.getItem("cart")||"[]");
  c.push(id);
  localStorage.setItem("cart",JSON.stringify(c));
  alert("已加入");
}
