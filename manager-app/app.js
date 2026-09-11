// app.js
const form = document.querySelector('#movie-form');
const titleInput = document.querySelector('#title-input');
const directorInput = document.querySelector('#director-input');
const genreInput = document.querySelector('#genre-input');
const ratingInput = document.querySelector('#rating-input');
const submitBtn = document.querySelector('#submit-btn');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const tip = document.querySelector('#tip');
const searchInput = document.querySelector('#search-input');
const tbody = document.querySelector('#movie-tbody');

// 恢复
let movies = JSON.parse(localStorage.getItem('movies') || '[]');
const save = () => localStorage.setItem('movies', JSON.stringify(movies));
let editingId = null; // 正在编辑的电影 id，null 表示新增模式

// 列表由数组动态渲染：先改数组，再调 render
const render = () => {
  tbody.innerHTML = '';
  const keyword = searchInput.value.trim().toLowerCase();
  const shown = movies.filter(m =>
    keyword === '' ||
    m.title.toLowerCase().includes(keyword) ||
    m.director.toLowerCase().includes(keyword)
  );
  if (shown.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = '没有符合条件的电影';
    td.className = 'empty';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  shown.forEach(movie => {
    const tr = document.createElement('tr');
    [movie.title, movie.director, movie.genre, String(movie.rating)].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    const opTd = document.createElement('td');
    const editBtn = document.createElement('span');
    editBtn.textContent = '编辑';
    editBtn.className = 'edit';
    editBtn.addEventListener('click', () => startEdit(movie.id));
    const delBtn = document.createElement('span');
    delBtn.textContent = '删除';
    delBtn.className = 'del';
    delBtn.addEventListener('click', () => removeMovie(movie.id));
    opTd.append(editBtn, delBtn);
    tr.appendChild(opTd);
    tbody.appendChild(tr);
  });
};

const startEdit = (id) => {
  const movie = movies.find(m => m.id === id);
  if (!movie) return;
  editingId = id;
  titleInput.value = movie.title;
  directorInput.value = movie.director;
  genreInput.value = movie.genre;
  ratingInput.value = movie.rating;
  submitBtn.textContent = '保存修改';
  cancelEditBtn.style.display = '';
  tip.textContent = '';
};

const exitEdit = () => {
  editingId = null;
  form.reset();
  submitBtn.textContent = '添加';
  cancelEditBtn.style.display = 'none';
  tip.textContent = '';
};

const removeMovie = (id) => {
  movies = movies.filter(m => m.id !== id);
  save();
  if (editingId === id) exitEdit();
  render();
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const director = directorInput.value.trim();
  const genre = genreInput.value.trim();
  const rating = Number(ratingInput.value);
  // 输入校验与页面错误提示
  if (title === '') {
    tip.textContent = '片名不能为空';
    return;
  }
  if (director === '') {
    tip.textContent = '导演不能为空';
    return;
  }
  if (ratingInput.value === '' || Number.isNaN(rating) || rating < 0 || rating > 10) {
    tip.textContent = '评分必须是 0~10 的数字';
    return;
  }
  if (editingId === null) {
    movies.push({ id: Date.now(), title, director, genre, rating });
  } else {
    const movie = movies.find(m => m.id === editingId);
    if (movie) Object.assign(movie, { title, director, genre, rating });
    exitEdit();
  }
  save();
  tip.textContent = '';
  form.reset();
  render();
});

cancelEditBtn.addEventListener('click', exitEdit);

searchInput.addEventListener('input', render);

render();
