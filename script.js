function login() {
  const user = document.getElementById("login-username").value;
  const pass = document.getElementById("login-password").value;
  if (user && pass) {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-page").style.display = "block";
    document.getElementById("username").textContent = user;
  } else {
    alert("رجاءً أدخل اسم المستخدم وكلمة المرور");
  }
}

function toggleSettings() {
  const menu = document.getElementById("settings-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function showInfo() {
  const username = document.getElementById("username").textContent;
  alert(`اسم المستخدم: ${username}\nكلمة المرور: ********`);
}

function showEdit() {
  const newUsername = prompt("اكتب اسم المستخدم الجديد:");
  const newPassword = prompt("اكتب كلمة المرور الجديدة:");

  if (newUsername) {
    document.getElementById("username").textContent = newUsername;
  }
  alert("تم تعديل البيانات (تعديل وهمي فقط)");
}

function uploadPic() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById("profile-pic").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function publishPost() {
  const text = document.getElementById("post-text").value;
  const mediaInput = document.getElementById("post-media");
  const files = mediaInput.files;

  if (!text && files.length === 0) {
    alert("اكتب شيئًا أو أضف صورة/فيديو");
    return;
  }

  const postDiv = document.createElement("div");
  postDiv.className = "post";
  if (text) postDiv.innerHTML += `<p>${text}</p>`;

  for (let file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const src = e.target.result;
      const media = file.type.startsWith("video")
        ? `<video src="${src}" controls width="100%"></video>`
        : `<img src="${src}" style="max-width:100%">`;
      postDiv.innerHTML += media;
    };
    reader.readAsDataURL(file);
  }

  postDiv.innerHTML += `<div class="actions"><span>👍 إعجاب</span><span>💬 تعليق</span></div>`;
  document.getElementById("posts").prepend(postDiv);

  document.getElementById("post-text").value = "";
  mediaInput.value = "";
}
