const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.getElementById('modal-cart');
const modalClose = document.querySelector('.modal-close');


const openModal = () => {
  modalCart.classList.add('show');
  
};

modalCart.addEventListener('click', event => {
  const target = event.target;
  if (!target.closest('.modal') || target.closest('.modal-close')) {
    closeModal();
  }
});

const closeModal = () => {
  modalCart.classList.remove('show');
  
};

modalClose.addEventListener('click', closeModal);
buttonCart.addEventListener('click', openModal);

// scroll smooth

const scrollLink = document.querySelectorAll('a.scroll-link');

  scrollLink.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = link.getAttribute('href');
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  });

// goods 

const more = document.querySelector('.more');
const navigationLinks = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function() {
  const result = await fetch('db/db.json');
  if (!result.ok) {
    throw 'Ops, we have some problems' + ': ' + result.statusText;
  }
  return await result.json();
}

const createCard = ({ id, img, name, label, description, price }) => {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-sm-6';

  card.insertAdjacentHTML('afterbegin', 
  `
    <div class="goods-card">
    ${label ? `<span class="label">${label}</span>` :
      ''}
      <img src="db/${img}" alt="${name}" class="goods-image">
      <h3 class="goods-title">${name}</h3>
      <p class="goods-description">${description}</p>
      <button class="button goods-card-btn add-to-cart" data-id="${id}">
        <span class="button-price">$${price}</span>
      </button>
    </div>
  `);

  return card;
}

const renderCards = (data) => {
  longGoodsList.textContent = '';
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add('show-goods')
}

more.addEventListener('click', (event) => {
  event.preventDefault();
  getGoods().then(renderCards);
  
});

const filterCards = (field, value) => {
  getGoods()
    .then((data) => {
      const filteredGoods = data.filter((good) => {
      return good[field] === value;
      });
      return filteredGoods;
    })
  .then(renderCards);
};

navigationLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
    if (!link.dataset.field) {
      getGoods().then(renderCards);
    }
  })
});
