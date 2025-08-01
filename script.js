// تحقق من تسجيل الدخول
if(location.pathname.endsWith('profile.html')){
  const user = localStorage.getItem('authUser');
  const pass = localStorage.getItem('authPass');
  if(!user || !pass){
    location.href = 'index.html';
  }
}

// تعريف المستخدم الحالي من التخزين المحلي
let currentUser = {
  username: localStorage.getItem('authUser') || '',
  password: localStorage.getItem('authPass') || '',
  profileImage: localStorage.getItem('profileImage') || 'https://via.placeholder.com/100',
  maritalStatus: localStorage.getItem('maritalStatus') || ''
};

const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const showProfileDetailsBtn = document.getElementById('showProfileDetails');
const editProfileDetailsBtn = document.getElementById('editProfileDetails');
const profileContent = document.getElementById('profileContent');
const profileDetailsDiv = document.getElementById('profileDetails');
const profileEditDiv = document.getElementById('profileEdit');
const saveDetailsBtn = document.getElementById('saveDetailsBtn');
const profileImage = document.getElementById('profileImage');
const userDisplay = document.getElementById('userDisplay');
const maritalStatusDisplay = document.getElementById('maritalStatus');
const userNameDisplay = document.getElementById('userNameDisplay');
const passwordDisplay = document.getElementById('passwordDisplay');
const userNameEdit = document.getElementById('userNameEdit');
const passwordEdit = document.getElementById('passwordEdit');
const maritalStatusEdit = document.getElementById('maritalStatusEdit');
const addPostBtn = document.getElementById('addPostBtn');
const postInput = document.getElementById('postInput');
const postsList = document.getElementById('postsList');
const searchInput = document.getElementById('searchInput');

// اظهار اسم المستخدم والحالة الزوجية
function loadProfile(){
  userDisplay.textContent = currentUser.username;
  maritalStatusDisplay.textContent = currentUser.maritalStatus ? `الحالة الزوجية: ${currentUser.maritalStatus}` : '';
  userNameDisplay.textContent = currentUser.username;
  passwordDisplay.textContent = currentUser.password.replace(/./g, '*');
  userNameEdit.value = currentUser.username;
  passwordEdit.value = currentUser.password;
  maritalStatusEdit.value = currentUser.maritalStatus || '';
  profileImage.src = currentUser.profileImage;
}
loadProfile();

// التحكم بقائمة الإعدادات
settingsBtn.addEventListener('click', () => {
  if(settingsMenu.style.display === 'block'){
    settingsMenu.style.display = 'none';
    profileContent.style.display = 'none';
  } else {
    settingsMenu.style.display = 'block';
    profileContent.style.display = 'none';
  }
});

// عرض التفاصيل الشخصية
showProfileDetailsBtn.addEventListener('click', () => {
  profileDetailsDiv.classList.remove('hidden');
  profileEditDiv.classList.add('hidden');
  profileContent.style.display = 'block';
  settingsMenu.style.display = 'none';
});

// عرض تعديل التفاصيل
editProfileDetailsBtn.addEventListener('click', () => {
  profileEditDiv.classList.remove('hidden');
  profileDetailsDiv.classList.add('hidden');
  profileContent.style.display = 'block';
  settingsMenu.style.display = 'none';
});

// حفظ التعديلات
saveDetailsBtn.addEventListener('click', () => {
  const newUser = userNameEdit.value.trim();
  const newPass = passwordEdit.value.trim();
  const newStatus = maritalStatusEdit.value;

  if(newUser && newPass){
    currentUser.username = newUser;
    currentUser.password = newPass;
    currentUser.maritalStatus = newStatus;
    localStorage.setItem('authUser', newUser);
    localStorage.setItem('authPass', newPass);
    localStorage.setItem('maritalStatus', newStatus);
    loadProfile();
    alert('تم حفظ التعديلات!');
    profileContent.style.display = 'none';
  } else {
    alert('يرجى تعبئة اسم المستخدم وكلمة المرور.');
  }
});

// تغيير صورة الملف الشخصي
profileImage.addEventListener('click', () => {
  const newUrl = prompt('ادخل رابط صورة جديدة:', currentUser.profileImage);
  if(newUrl){
    currentUser.profileImage = newUrl;
    localStorage.setItem('profileImage', newUrl);
    loadProfile();
  }
});

// إدارة المنشورات
let posts = JSON.parse(localStorage.getItem('posts') || '[]');

function renderPosts(filter = ''){
  postsList.innerHTML = '';
  let filteredPosts = posts;
  if(filter){
    const f = filter.toLowerCase();
    filteredPosts = posts.filter(p => p.username.toLowerCase().includes(f) || p.content.toLowerCase().includes(f));
  }
  filteredPosts.forEach((post, index) => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
      <div class="username">${post.username}</div>
      <div class="content">${post.content}</div>
      <button class="action-btn" onclick="deletePost(${index})">حذف</button>
    `;
    postsList.appendChild(postEl);
  });
}
renderPosts();

// نشر منشور جديد
addPostBtn.addEventListener('click', () => {
  const content = postInput.value.trim();
  if(content){
    posts.unshift({ username: currentUser.username, content });
    localStorage.setItem('posts', JSON.stringify(posts));
    postInput.value = '';
    renderPosts(searchInput.value);
  } else {
    alert('اكتب شيئاً لنشره!');
  }
});

// حذف منشور
window.deletePost = function(index){
  if(confirm('هل أنت متأكد من حذف المنشور؟')){
    posts.splice(index,1);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts(searchInput.value);
  }
};

// بحث في المستخدمين والمنشورات
searchInput.addEventListener('input', () => {
  renderPosts(searchInput.value);
});
