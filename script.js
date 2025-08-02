// تخزين بيانات وهمية للاختبار
let usersDB = [
  { username: "user1", password: "123456", profileImage: "default-profile.png" },
  { username: "user2", password: "abcdef", profileImage: "default-profile.png" },
];

let loggedUser = null;
let posts = [];

// --- صفحة تسجيل الدخول ---
if (document.getElementById("loginForm")) {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = usersDB.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      // حفظ المستخدم في localStorage
      localStorage.setItem("loggedUser", JSON.stringify(user));
      window.location.href = "profile.html";
    } else {
      loginError.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة";
    }
  });
}

// --- صفحة الملف الشخصي ---
if (document.getElementById("settingsBtn")) {
  loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (!loggedUser) {
    // إذا لم يكن هناك مستخدم مسجل دخول يعيد للتسجيل
    window.location.href = "index.html";
  } else {
    // تعيين البيانات في الصفحة
    document.getElementById("profileUsername").textContent = loggedUser.username;
    document.getElementById("profilePassword").value = loggedUser.password;
    document.getElementById("profileName").textContent = loggedUser.username;
    document.getElementById("profileImage").src = loggedUser.profileImage;

    // زر إظهار وإخفاء كلمة المرور
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");
    togglePasswordBtn.addEventListener("click", () => {
      const passInput = document.getElementById("profilePassword");
      if (passInput.type === "password") {
        passInput.type = "text";
        togglePasswordBtn.textContent = "إخفاء";
      } else {
        passInput.type = "password";
        togglePasswordBtn.textContent = "اظهار";
      }
    });

    // فتح وإغلاق الإعدادات
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsPanel = document.getElementById("settingsPanel");

    settingsBtn.addEventListener("click", () => {
      settingsPanel.classList.toggle("hidden");
    });

    // تعديل المعلومات
    const editForm = document.getElementById("editForm");
    editForm.usernameInput = document.getElementById("editUsername");
    editForm.passwordInput = document.getElementById("editPassword");

    // تعبية الحقول بالتفاصيل الحالية
    editForm.usernameInput.value = loggedUser.username;
    editForm.passwordInput.value = loggedUser.password;

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newUsername = editForm.usernameInput.value.trim();
      const newPassword = editForm.passwordInput.value.trim();

      if (newUsername && newPassword) {
        loggedUser.username = newUsername;
        loggedUser.password = newPassword;

        // تحديث البيانات في قاعدة المستخدمين
        const userIndex = usersDB.findIndex(
          (u) => u.username === loggedUser.username
        );
        if (userIndex !== -1) {
          usersDB[userIndex] = loggedUser;
        }

        // حفظ التغييرات
        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

        // تحديث الواجهة
        document.getElementById("profileUsername").textContent = newUsername;
        document.getElementById("profilePassword").value = newPassword;
        document.getElementById("profileName").textContent = newUsername;

        alert("تم تعديل المعلومات بنجاح");
      }
    });

    // رفع صورة البروفايل
    const profileImageInput = document.getElementById("profileImageInput");
    const profileImage = document.getElementById("profileImage");

    profileImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        profileImage.src = event.target.result;
        loggedUser.profileImage = event.target.result;
        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      };
      reader.readAsDataURL(file);
    });

    // زر النشر والمنشورات
    const postBtn = document.getElementById("postBtn");
    const postContent = document.getElementById("postContent");
    const postMediaInput = document.getElementById("postMediaInput");
    const postsContainer = document.getElementById("postsContainer");

    function renderPosts() {
      postsContainer.innerHTML = "";
      posts.forEach((post, index) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // رأس المنشور: صورة + اسم المستخدم
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("post-header");
        const img = document.createElement("img");
        img.src = loggedUser.profileImage;
        const usernameSpan = document.createElement("span");
        usernameSpan.classList.add("post-username");
        usernameSpan.textContent = loggedUser.username;
        headerDiv.appendChild(img);
        headerDiv.appendChild(usernameSpan);

        // محتوى المنشور
        const contentP = document.createElement("p");
        contentP.classList.add("post-content");
        contentP.textContent = post.content;

        // عرض الصور أو الفيديوهات
        let mediaElement = null;
        if (post.media && post.media.length > 0) {
          post.media.forEach((mediaUrl) => {
            if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
              const video = document.createElement("video");
              video.src = mediaUrl;
              video.controls = true;
              video.classList.add("post-media");
              postDiv.appendChild(video);
            } else {
              const imgMedia = document.createElement("img");
              imgMedia.src = mediaUrl;
              imgMedia.classList.add("post-media");
              postDiv.appendChild(imgMedia);
            }
          });
        }

        // أضف المحتوى بعد الوسائط
        postDiv.appendChild(headerDiv);
        postDiv.appendChild(contentP);

        // إجراءات اللايك والتعديل والحذف والتعليقات
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("post-actions");

        // زر اللايك
        const likeBtn = document.createElement("button");
        likeBtn.textContent = `👍 ${post.likes}`;
        likeBtn.classList.add("action-btn");
        likeBtn.addEventListener("click", () => {
          post.likes++;
          renderPosts();
        });

        // زر تعديل المنشور
        const editBtn = document.createElement("button");
        editBtn.textContent = "تعديل";
        editBtn.classList.add("action-btn");
        editBtn.addEventListener("click", () => {
          const newContent = prompt("عدل منشورك:", post.content);
          if (newContent !== null) {
            post.content = newContent;
            renderPosts();
          }
        });

        // زر حذف المنشور
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "حذف";
        deleteBtn.classList.add("action-btn");
        deleteBtn.addEventListener("click", () => {
          if (confirm("هل تريد حذف المنشور؟")) {
            posts.splice(index, 1);
            renderPosts();
          }
        });

        actionsDiv.appendChild(likeBtn);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        postDiv.appendChild(actionsDiv);

        // التعليقات
        const commentsDiv = document.createElement("div");
        commentsDiv.classList.add("comments");

        post.comments.forEach((comment) => {
          const commentP = document.createElement("p");
          commentP.classList.add("comment");
          commentP.textContent = comment;
          commentsDiv.appendChild(commentP);
        });

        // مربع إضافة تعليق جديد
        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "أضف تعليق...";
        commentInput.classList.add("comment-input");

        commentInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter" && commentInput.value.trim() !== "") {
            post.comments.push(commentInput.value.trim());
            commentInput.value = "";
            renderPosts();
          }
        });

        commentsDiv.appendChild(commentInput);
        postDiv.appendChild(commentsDiv);

        postsContainer.appendChild(postDiv);
      });
    }

    // إضافة منشور جديد
    postBtn.addEventListener("click", () => {
      const content = postContent.value.trim();
      if (!content) {
        alert("الرجاء كتابة نص المنشور");
        return;
      }

      const mediaFiles = postMediaInput.files;
      const mediaUrls = [];

      if (mediaFiles.length > 0) {
        const readers = [];
        let filesProcessed = 0;

        // قراءة الملفات ثم النشر
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i];
          const reader = new FileReader();

          reader.onload = function (event) {
            mediaUrls.push(event.target.result);
            filesProcessed++;
            if (filesProcessed === mediaFiles.length) {
              posts.unshift({
                content: content,
                media: mediaUrls,
                likes: 0,
                comments: [],
              });
              postContent.value = "";
              postMediaInput.value = "";
              renderPosts();
            }
          };

          reader.readAsDataURL(file);
        }
      } else {
        posts.unshift({
          content: content,
          media: [],
          likes: 0,
          comments: [],
        });
        postContent.value = "";
        postMediaInput.value = "";
        renderPosts();
      }
    });

    renderPosts();
  }
}
