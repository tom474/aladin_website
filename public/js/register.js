// Show/hide password button
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function (e) {
  // Toggle the type attribute
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);

  // Toggle the eye slash icon
  if (this.classList.contains("fa-eye")) {
    this.classList.remove("fa-eye");
    this.classList.add("fa-eye-slash");
  } else {
    this.classList.remove("fa-eye-slash");
    this.classList.add("fa-eye");
  }
});

// Set profile picture
const imgDiv = document.querySelector(".profile_pic");
const img = document.querySelector("#photo");
const file = document.querySelector("#file");

// Choose an image to upload
file.addEventListener("change", function () {
  const choosedFile = this.files[0];

  if (choosedFile) {
    const reader = new FileReader();

    // FileReader is a predefined function of JS
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });

    reader.readAsDataURL(choosedFile);
  }
});
