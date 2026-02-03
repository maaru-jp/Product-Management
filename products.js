import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("product-list");

const snap = await getDocs(collection(db, "products"));
snap.forEach(doc => {
  const p = doc.data();
  const div = document.createElement("div");
  div.innerHTML = `
    <img src="${p.images[0]}" width="150">
    <h3>${p.name}</h3>
    <p>NT$${p.price}</p>
    <button onclick="addToCart('${doc.id}')">加入購物車</button>
  `;
  list.appendChild(div);
});
