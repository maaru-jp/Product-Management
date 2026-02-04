
let list = [];
function addProduct(){
  const n = name.value;
  const p = price.value;
  list.push({name:n,price:p});
  output.textContent = JSON.stringify(list,null,2);
}
