const box = document.getElementById("products");
const filter = document.getElementById("categoryFilter");

let products = [];

db.collection("products").onSnapshot(snapshot => {
  products = [];
  const categories = new Set();

  snapshot.forEach(doc => {
    const p = doc.data();
    products.push(p);
    categories.add(p.category);
  });

  filter.innerHTML = '<option value="">全部分類</option>';
  categories.forEach(c => {
    filter.innerHTML += `<option value="${c}">${c}</option>`;
  });

  render();
});

filter.addEventListener("change", render);

function render() {
  box.innerHTML = "";

  products
    .filter(p => !filter.value || p.category === filter.value)
    .forEach(p => {
      const el = document.createElement("div");
      el.innerHTML = `
        <img src="${p.image}" width="120"><br>
        <strong>${p.name}</strong><br>
        $${p.price}<br>
        ${p.soldout ? "🔴 已售完" : "🟢 可購買"}<br>
        ${p.tags.map(t => `#${t}`).join(" ")}
        <hr>
      `;
      box.appendChild(el);
    });
}
