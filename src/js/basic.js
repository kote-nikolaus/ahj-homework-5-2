/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint-disable no-shadow */

class Article {
  constructor(name, price, id) {
    this.name = name;
    this.price = price;
    this.id = id;
    this.HTML = this.createHTML();
  }

  createHTML() {
    const articleHTML = document.createElement('div');
    articleHTML.className = 'article';
    articleHTML.dataset.id = this.id;
    articleHTML.innerHTML = `<div class='article-name'>${this.name}</div>
    <div class='article-price'>${this.price}</div>
    <button class='article-button edit-button'></button>
    <button class='article-button delete-button'></button>`;
    return articleHTML;
  }
}

const articlesList = document.getElementById('articles-box');
const addButton = document.getElementById('add-button');
const modal = document.getElementById('modal');
const name = document.getElementById('name');
const price = document.getElementById('price');
const assortment = [];

const errorMessages = {
  name: {
    valueMissing: 'Введите название товара',
  },
  price: {
    valueMissing: 'Вы забыли указать стоимость',
    rangeUnderflow: 'Стоимость не может быть нулевой или отрицательной',
    badInput: 'Вы не перепутали название со стоимостью?',
  },
};

function closeModal(e) {
  e.preventDefault();
  modal.classList.remove('modal-active');
}

function openModal(e) {
  e.preventDefault();
  modal.classList.add('modal-active');

  if (e.currentTarget.classList.contains('add-button')) {
    name.value = '';
    price.value = '';
    modal.dataset.id = '-1';
  } else {
    const articleToEdit = e.currentTarget.closest('div');
    name.value = articleToEdit.querySelector('.article-name').textContent;
    price.value = articleToEdit.querySelector('.article-price').textContent;
    modal.dataset.id = articleToEdit.dataset.id;
  }

  const closeButton = document.getElementById('cancel-button');
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('submit', saveInfo);
}

addButton.addEventListener('click', openModal);

function showError() {
  Object.keys(modal.elements).forEach((el) => {
    if (!modal[el].validity.valid) {
      modal[el].classList.add('invalid');
      const errorType = Object.keys(ValidityState.prototype).find((key) => modal[el].validity[key]);
      modal[el].setCustomValidity(errorMessages[modal[el].id][errorType]);
      modal[el].reportValidity();
    }
  });
}

function addArticle(name, price) {
  const article = new Article(name, price, assortment.length);
  assortment.push(article);
  articlesList.appendChild(article.HTML);
  const editButton = article.HTML.querySelector('.edit-button');
  editButton.addEventListener('click', openModal);
  const deleteButton = article.HTML.querySelector('.delete-button');
  deleteButton.addEventListener('click', removeArticle);
}

function saveInfo(e) {
  e.preventDefault();
  name.setCustomValidity('');
  name.classList.remove('invalid');
  price.setCustomValidity('');
  price.classList.remove('invalid');
  const isValid = modal.checkValidity();
  if (isValid) {
    if (modal.dataset.id !== '-1') {
      const articleToEdit = assortment[modal.dataset.id];
      articleToEdit.name = name.value;
      articleToEdit.price = price.value;
      articlesList.removeChild(articleToEdit.HTML);
      articleToEdit.HTML = articleToEdit.createHTML();
      articlesList.appendChild(articleToEdit.HTML);
      const editButton = articleToEdit.HTML.querySelector('.edit-button');
      editButton.addEventListener('click', openModal);
      const deleteButton = articleToEdit.HTML.querySelector('.delete-button');
      deleteButton.addEventListener('click', removeArticle);
    } else {
      addArticle(name.value, Number(price.value));
    }
    closeModal(e);
  } else {
    showError();
  }
}

function removeArticle(e) {
  alert('Удалить товар?');
  const articleToRemove = e.currentTarget.closest('div');
  articlesList.removeChild(articleToRemove);
  assortment.splice(articleToRemove.dataset.id, 1);
}
