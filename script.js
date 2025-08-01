const user = localStorage.getItem('authUser');
if (!user) location.href = 'index.html';

document.getElementById('user').textContent = user;

const users = JSON.parse(localStorage.getItem('users')) || [];
const currentUser = users.find(u => u.username === user);
const postsKey = 'posts_' + user;
let posts = JSON.parse(localStorage.getItem(postsKey)) || [];

const profilePic = document.getElementById('profilePic');
const uploadPic = document.getElementById('uploadPic');
const savedPic = localStorage.getItem('profilePic_' + user);
if (savedPic) profilePic.style.backgroundImage = `url(${savedPic})`;

profilePic.onclick = () => uploadPic.click();
uploadPic.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result;
    profilePic.style.backgroundImage = `url(${url})`;
    localStorage.setItem('profilePic_' + user, url);
  };
  reader.readAsDataURL(file);
};

const settingsIcon = document.querySelector('.settings');
const settingsMenu = document.getElementById('settingsMenu');

settingsIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  const isVisible = settingsMenu.style.display === 'block';
  settingsMenu.style.display = isVisible ? 'none' : 'block';
});

document.addEventListener('click', function (event) {
  if (!settingsMenu.contains(event.target) && event.target !== settingsIcon) {
    settingsMenu.style.display = 'none';
  }
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';

  if (id === 'detailsSection') {
    document.getElementById('detailsUsername').textContent = currentUser.username;
    document.getElementById('detailsPassword').textContent = currentUser.password;
  }

  if (id === 'editSection') {
    document.getElementById('newUsername').value = currentUser.username;
    document.getElementById('newPassword').value = currentUser.password;
  }
}

function updateUser(e) {
  e.preventDefault();
  const newUsername = document.getElementById('newUsername').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();

  if (!newUsername || !newPassword) return alert('املأ كل الحقول');

  const index = users.findIndex(u => u.username === user);
  users[index] = { username: newUsername, password: newPassword };
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('authUser', newUsername);
  localStorage.setItem('posts_' + newUsername, JSON.stringify(posts));
  localStorage.removeItem(postsKey);

  alert('تم التحديث بنجاح!');
  location.reload();
}

// المنشورات
function addPost() {
  const text = document.getElementById('postText').value.trim();
  const fileInput = document.getElementById('postMedia');
  const file = fileInput.files[0];
  const newPost = {
    text,
    created: new Date().toISOString(),
    likes: 0,
    comments: []
  };

  const saveAndRender = () => {
    posts.push(newPost);
    localStorage.setItem(postsKey, JSON.stringify(posts));
    document.getElementById('postText').value = '';
    fileInput.value = '';
    renderPosts();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      newPost.media = reader.result;
      newPost.mediaType = file.type;
      saveAndRender();
    };
    reader.readAsDataURL(file);
  } else {
    if (!text) return alert('أدخل محتوى!');
    saveAndRender();
  }
}

function editPost(index) {
  const newText = prompt("اكتب النص الجديد:", posts[index].text);
  if (newText !== null) {
    posts[index].text = newText;
    localStorage.setItem(postsKey, JSON.stringify(posts));
    renderPosts();
  }
}

function deletePost(index) {
  if (confirm("هل تريد حذف هذا المنشور؟")) {
    posts.splice(index, 1);
    localStorage.setItem(postsKey, JSON.stringify(posts));
    renderPosts();
  }
}

function likePost(index) {
  posts[index].likes += 1;
  localStorage.setItem(postsKey, JSON.stringify(posts));
  renderPosts();
}

function addComment(index) {
  const commentInput = document.getElementById(`commentInput-${index}`);
  const commentText = commentInput.value.trim();
  if (!commentText) return;

  posts[index].comments.push({ user, text: commentText });
  localStorage.setItem(postsKey, JSON.stringify(posts));
  renderPosts();
}

function renderPosts() {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';
  posts.slice().reverse().forEach((p, i) => {
    const realIndex = posts.length - 1 - i;
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <div>${p.text}</div>
      ${p.media ? (p.mediaType.startsWith('image') ?
        `<img src="${p.media}">` :
        `<video src="${p.media}" controls></video>`) : ''
      }
      <div class="actions">
        <button onclick="likePost(${realIndex})">👍 إعجاب (${p.likes})</button>
        <button onclick="editPost(${realIndex})">✏️ تعديل</button>
        <button onclick="deletePost(${realIndex})">🗑️ حذف</button>
      </div>
      <div class="comments">
        <div>${p.comments.map(c => `<p><strong>${c.user}:</strong> ${c.text}</p>`).join('')}</div>
        <input type="text" id="commentInput-${realIndex}" placeholder="اكتب تعليقًا...">
        <button onclick="addComment(${realIndex})">💬 تعليق</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// البحث
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.oninput = () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = '';
  if (!query) {
    searchResults.style.display = 'none';
    return;
  }

  const matchedUsers = users.filter(u => u.username.toLowerCase().includes(query));
  const matchedPosts = posts.filter(p => p.text && p.text.toLowerCase().includes(query));

  matchedUsers.forEach(u => {
    const div = document.createElement('div');
    div.textContent = '👤 ' + u.username;
    searchResults.appendChild(div);
  });

  matchedPosts.forEach(p => {
    const div = document.createElement('div');
    div.textContent = '📝 ' + p.text.slice(0, 30) + '...';
    searchResults.appendChild(div);
  });

  searchResults.style.display = 'block';
};

document.addEventListener('click', (e) => {
  if (!searchResults.contains(e.target) && e.target !== searchInput) {
    searchResults.style.display = 'none';
  }
});

renderPosts();
