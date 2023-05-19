//   RMIT University Vietnam
//   Course: COSC2430 Web Programming
//   Semester: 2023A
//   Assessment: Assignment 2
//   Author:
//     1. Tran Manh Cuong (s3974735)
//     2. Truong Quang Bao Loc (s3965528)
//     3. Nguyen Van Khai (s3979259)
//     4. Truong Tuong Hao (s3979259)
//     5. Huynh Nguyen Thien Minh (s3978742)
const btn = document.querySelector("nav .container-lg button");
const nav = document.querySelector("nav .container-lg .hamburger");


btn.addEventListener("click", () => { 
    nav.classList.toggle("dropdown-nav")
});

const plus = document.querySelector('.plus');
const minus = document.querySelector('.minus');
const num = document.querySelector('.num');

let a = 1;

plus.addEventListener('click', () => {
    a++;
    a = (a < 10) ? "0" + a : a ;
    num.innerText = a;
    console.log(a)
})

minus.addEventListener('click', () => {
    if (a > 1) {
        a--;
        a = (a < 10) ? "0" + a : a ;
        num.innerText = a; 
    }
})
