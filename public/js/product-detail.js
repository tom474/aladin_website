const btn = document.querySelector("nav .container-lg button");
const nav = document.querySelector("nav .container-lg .hamburger");

btn.addEventListener("click", () => {
  nav.classList.toggle("dropdown-nav");
});

const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const num = document.querySelector(".num");

let a = 1;

plus.addEventListener("click", () => {
  a++;
  a = a < 10 ? "0" + a : a;
  num.innerText = a;
  console.log(a);
});

minus.addEventListener("click", () => {
  if (a > 1) {
    a--;
    a = a < 10 ? "0" + a : a;
    num.innerText = a;
  }
});
