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
const inputs = document.querySelectorAll(".input");

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}

inputs.forEach((input) => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

var fileTag = document.getElementById("filetag");
var preview = document.getElementById("preview");

fileTag.addEventListener("change", function () {
    changeImage(this);
});

function changeImage(input) {
    var reader;

    if (input.files && input.files[0]) {
        reader = new FileReader();

        reader.onload = function (e) {
            preview.setAttribute("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
