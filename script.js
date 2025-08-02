let authUser = localStorage.getItem('authUser') || 'User1';
let authPass = localStorage.getItem('authPass') || '1234';
let profileImage = localStorage.getItem('profileImage') || '';
let posts = JSON.parse(localStorage.getItem('posts') || '[]');

const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const showDetails = document.getElementById('showDetails');
const showEdit = document.getElementById('showEdit');
const detailsContent = document.getElementById('detailsContent');
const editContent = document.getElementById('editContent');
const detailUsername = document.getElementById('detailUsername');
const detailPassword = document.getElementById('detailPassword');
const editUsername = document.getElementById('editUsername');
const editPassword = document.getElementById('editPassword');
const saveEditBtn = document.getElementById('saveEditBtn');

const profilePic = document.getElementById('profilePic');
const profilePicInput = document.getElementById('profilePicInput');
const displayUsername = document.getElementById('displayUsername');

const postText = document.getElementById('postText');
const postMedia = document.getElementById('postMedia');
const addPostBtn = document.getElementById('addPostBtn');
const postsList = document.getElementById('postsList');
const searchInput = document.getElementById('searchInput');

function renderProfile() {
  displayUsername.textContent = authUser;
  profilePic.style.backgroundImage = profileImage
    ? `url('${profileImage}')`
    : `url('https://via.placeholder.com/120?text=User')`;
}

settingsBtn.addEventListener('click', () => {
  settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
});

showDetails.addEventListener('click', () => {
  detailUsername.textContent = authUser;
  detailPassword.textContent = authPass.replace(/./g, '*');
  detailsContent.classList.remove('hidden');
  editContent.classList.add('hidden');
});

showEdit.addEventListener('click', () => {
  editUsername.value = authUser;
  editPassword.value = authPass;
  editContent.classList.remove('hidden');
  detailsContent.classList.add('hidden');
});

saveEditBtn.addEventListener('click', () => {
  const u = editUsername.value.trim();
  const p = editPassword.value.trim();
  if (u && p) {
    authUser = u;
    authPass = p;
    localStorage.setItem('authUser', u);
    localStorage.setItem('authPass', p);
    renderProfile();
    alert('تم حفظ التعديلات!');
    editContent.classList.add('hidden');
  }
});

profilePic.addEventListener('click', () => {
  profilePicInput.click();
});

profilePicInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImage = reader.result;
      localStorage.setItem('profileImage', profileImage);
      renderProfile();
    };
    reader.readAsDataURL(file);
  }
});

function renderPosts(filter = '') {
  postsList.innerHTML = '';
  const f = filter.toLowerCase();
  posts
    .filter(
      p =>
        p.username.toLowerCase().includes(f) ||
        (p.content && p.content.toLowerCase().includes(f))
    )
    .forEach(p => {
      const d = document.createElement('div');
      d.className = 'post';
      d.innerHTML = `
        <div class="post-author">${p.username}</div>
        <div class="post-content">${p.content}</div>
        ${
          p.media
            ? p.mediaType === 'image'
              ? `<img src="${p.media}">`
              : `<video src="${p.media}" controls></video>`
            : ''
        }
      `;
      postsList.appendChild(d);
    });
}

addPostBtn.addEventListener('click', () => {
  const t = postText.value.trim();
  const f = postMedia.files[0];
  if (!t && !f) {
    alert('اكتب شيئًا أو أضف وسائط');
    return;
  }
  const newPost = {
    username: authUser,
    content: t,
    media: null,
    mediaType: null
  };
  if (f) {
    const reader = new FileReader();
    reader.onload = () => {
      newPost.media = reader.result;
      newPost.mediaType = f.type.startsWith('image') ? 'image' : 'video';
      posts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));
      postText.value = '';
      postMedia.value = '';
      renderPosts(searchInput.value);
    };
    reader.readAsDataURL(f);
  } else {
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    postText.value = '';
    postMedia.value = '';
    renderPosts(searchInput.value);
  }
});

searchInput.addEventListener('input', () => {
  renderPosts(searchInput.value);
});

renderProfile();
renderPosts();
