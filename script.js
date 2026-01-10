
(() => {
  const cartCountEl = document.querySelector("[data-cart-count]");
  const toast = document.getElementById("toast");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  let count = 0;
  let toastTimer = null;

  function showToast() {
    if (!toast) return;
    toast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 2000);
  }

  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      count += 1;
      if (cartCountEl) cartCountEl.textContent = String(count);
      showToast();

      cartCountEl?.classList.add('animate-pulse');
      setTimeout(() => cartCountEl?.classList.remove('animate-pulse'), 600);
    });
  });
})();


document.getElementById('year').textContent = new Date().getFullYear();

const input = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearSearch');
const cards = Array.from(document.querySelectorAll('[data-product-card]'));
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

function normalize(s) { return (s || '').toLowerCase().trim(); }

function applyFilter() {
  const q = normalize(input.value);
  clearBtn.classList.toggle('hidden', q.length === 0);

  let shown = 0;
  for (const card of cards) {
    const hay = normalize(card.getAttribute('data-search'));
    const match = q === '' || hay.includes(q);
    card.classList.toggle('hidden', !match);
    if (match) shown += 1;
  }

  resultsCount.textContent = String(shown);
  noResults.classList.toggle('hidden', shown !== 0);
}

input.addEventListener('input', applyFilter);
clearBtn.addEventListener('click', () => {
  input.value = '';
  input.focus();
  applyFilter();
});
applyFilter();

function toggleCards() {
    const container = document.getElementById('container-card');
 const btn = event.currentTarget;
    if (container.classList.contains('hidden')) {
      container.classList.remove('hidden');
      btn.textContent = "Show Less items";
    } else {
      container.classList.add('hidden');
      btn.textContent = "Show all items";
    }
  }

  function toggleCards2() {
    const container = document.getElementById('container-card2');
 const btn = event.currentTarget;
    if (container.classList.contains('hidden')) {
      container.classList.remove('hidden');
      btn.textContent = "Show Less items";
    } else {
      container.classList.add('hidden');
      btn.textContent = "Show all items";
    }
  }

  function toggleCards3() {
    const container = document.getElementById('container-card3');
 const btn = event.currentTarget;
    if (container.classList.contains('hidden')) {
      container.classList.remove('hidden');
      btn.textContent = "Show Less items";
    } else {
      container.classList.add('hidden');
      btn.textContent = "Show all items";
    }
  }

  function toggleCards4() {
    const container = document.getElementById('container-card4');
 const btn = event.currentTarget;
    if (container.classList.contains('hidden')) {
      container.classList.remove('hidden');
      btn.textContent = "Show Less items";
    } else {
      container.classList.add('hidden');
      btn.textContent = "Show all items";
    }
  }

  
  (function () {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImg = document.getElementById('modalImg');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalOldPrice = document.getElementById('modalOldPrice');
    const modalAddBtn = document.getElementById('modalAddToCart');

    let activeCard = null;

    function extractProduct(card) {
      const titleEl = card.querySelector('h3');
      const imgEl = card.querySelector('img');
      const descEl = card.querySelector('p');
      const priceEl = card.querySelector('.text-2xl');
      const oldEl = card.querySelector('.line-through');

      return {
        name: titleEl ? titleEl.textContent.trim() : 'Product',
        img: imgEl ? imgEl.getAttribute('src') : '',
        imgAlt: imgEl ? (imgEl.getAttribute('alt') || '') : '',
        desc: descEl ? descEl.textContent.trim() : '',
        price: priceEl ? priceEl.textContent.trim() : '',
        oldPrice: oldEl ? oldEl.textContent.trim() : ''
      };
    }

    function openModal(card) {
      activeCard = card;
      const p = extractProduct(card);

      modalTitle.textContent = p.name;
      modalImg.src = p.img;
      modalImg.alt = p.imgAlt || p.name;
      modalDesc.textContent = p.desc;
      modalPrice.textContent = p.price;

      if (p.oldPrice) {
        modalOldPrice.textContent = p.oldPrice;
        modalOldPrice.classList.remove('hidden');
      } else {
        modalOldPrice.textContent = '';
        modalOldPrice.classList.add('hidden');
      }

      modal.classList.remove('hidden');
      requestAnimationFrame(() => modal.classList.add('modal-open'));
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('modal-open');
      setTimeout(() => modal.classList.add('hidden'), 180);
      document.body.style.overflow = '';
      activeCard = null;
    }

    // Card click -> open modal (but ignore Add to cart click)
    document.addEventListener('click', function (e) {
      const addBtn = e.target.closest('[data-add-to-cart]');
      if (addBtn) return;

      const card = e.target.closest('[data-product-card]');
      if (!card) return;

      openModal(card);
    });

    // Close modal (backdrop or X)
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) closeModal();
    });

    // ESC close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    // Modal Add -> trigger original button click (same side-cart effect)
    modalAddBtn.addEventListener('click', function () {
      if (!activeCard) return;
      const originalAdd = activeCard.querySelector('[data-add-to-cart]');
      if (originalAdd) originalAdd.click();
      closeModal();
    });

    // Show all / Show less
    window.toggleCards = function () {
      const container = document.getElementById('container-card');
      const btn = document.getElementById('toggleBtn');
      const isHidden = container.classList.contains('hidden');

      if (isHidden) {
        container.classList.remove('hidden');
        btn.innerHTML = '<i class="fa-solid fa-layer-group"></i><span>Show less</span><i class="fa-solid fa-chevron-up text-sm opacity-90"></i>';
      } else {
        container.classList.add('hidden');
        btn.innerHTML = '<i class="fa-solid fa-layer-group"></i><span>Show all items</span><i class="fa-solid fa-chevron-down text-sm opacity-90"></i>';
        const section = document.getElementById('C1');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  })();
   (function () {
    // ---- Modal init guard (taake multiple sections me script duplicate ho to bhi issue na ho)
    if (!window.__productModalInit) {
      window.__productModalInit = true;

      const modal = document.getElementById('productModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalImg = document.getElementById('modalImg');
      const modalDesc = document.getElementById('modalDesc');
      const modalPrice = document.getElementById('modalPrice');
      const modalOldPrice = document.getElementById('modalOldPrice');
      const modalAddBtn = document.getElementById('modalAddToCart');

      let activeCard = null;

      function extractProduct(card) {
        const titleEl = card.querySelector('h3');
        const imgEl = card.querySelector('img');
        const descEl = card.querySelector('p');
        const priceEl = card.querySelector('.text-2xl');
        const oldEl = card.querySelector('.line-through');

        return {
          name: titleEl ? titleEl.textContent.trim() : 'Product',
          img: imgEl ? imgEl.getAttribute('src') : '',
          imgAlt: imgEl ? (imgEl.getAttribute('alt') || '') : '',
          desc: descEl ? descEl.textContent.trim() : '',
          price: priceEl ? priceEl.textContent.trim() : '',
          oldPrice: oldEl ? oldEl.textContent.trim() : ''
        };
      }

      function openModal(card) {
        if (!modal) return;

        activeCard = card;
        const p = extractProduct(card);

        modalTitle.textContent = p.name;
        modalImg.src = p.img;
        modalImg.alt = p.imgAlt || p.name;
        modalDesc.textContent = p.desc;
        modalPrice.textContent = p.price;

        if (p.oldPrice) {
          modalOldPrice.textContent = p.oldPrice;
          modalOldPrice.classList.remove('hidden');
        } else {
          modalOldPrice.textContent = '';
          modalOldPrice.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        requestAnimationFrame(() => modal.classList.add('modal-open'));
        document.body.style.overflow = 'hidden';
      }

      function closeModal() {
        if (!modal) return;
        modal.classList.remove('modal-open');
        setTimeout(() => modal.classList.add('hidden'), 180);
        document.body.style.overflow = '';
        activeCard = null;
      }

      // Card click -> open modal (but ignore Add-to-cart click)
      document.addEventListener('click', function (e) {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (addBtn) return;

        const card = e.target.closest('[data-product-card]');
        if (!card) return;

        openModal(card);
      });

      // Close modal (backdrop or X)
      modal && modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-modal-close]')) closeModal();
      });

      // ESC close
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal();
      });

      // Modal Add -> trigger original button click (same side-cart effect)
      modalAddBtn && modalAddBtn.addEventListener('click', function () {
        if (!activeCard) return;
        const originalAdd = activeCard.querySelector('[data-add-to-cart]');
        if (originalAdd) originalAdd.click();
        closeModal();
      });
    }

    // ---- ToggleCards2 (Watches)
    window.toggleCards2 = function () {
      const container = document.getElementById('container-card2');
      const btn = document.getElementById('toggleBtn2');
      if (!container || !btn) return;

      const isHidden = container.classList.contains('hidden');

      if (isHidden) {
        container.classList.remove('hidden');
        btn.innerHTML = '<i class="fa-solid fa-layer-group"></i><span>Show less</span><i class="fa-solid fa-chevron-up text-sm opacity-90"></i>';
      } else {
        container.classList.add('hidden');
        btn.innerHTML = '<i class="fa-solid fa-layer-group"></i><span>Show all items</span><i class="fa-solid fa-chevron-down text-sm opacity-90"></i>';
        const section = document.getElementById('C2');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  })();

   (function () {
    if (window.__shopUIInit) return;
    window.__shopUIInit = true;

    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImg = document.getElementById('modalImg');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalOldPrice = document.getElementById('modalOldPrice');
    const modalAddBtn = document.getElementById('modalAddToCart');

    let activeCard = null;

    const gradientPatterns = [
      /^bg-gradient-to-/,
      /^from-/,
      /^to-/,
      /^hover:from-/,
      /^hover:to-/
    ];

    function copyGradientClasses(fromEl, toEl, ensure = []) {
      if (!fromEl || !toEl) return;

      // remove existing gradient classes from target
      const remove = [];
      toEl.classList.forEach(c => { if (gradientPatterns.some(rx => rx.test(c))) remove.push(c); });
      remove.forEach(c => toEl.classList.remove(c));

      // add gradient classes from source
      fromEl.classList.forEach(c => { if (gradientPatterns.some(rx => rx.test(c))) toEl.classList.add(c); });

      // ensure required classes
      ensure.forEach(c => toEl.classList.add(c));
    }

    function extractProduct(card) {
      const titleEl = card.querySelector('h3');
      const imgEl = card.querySelector('img');
      const descEl = card.querySelector('p');
      const priceEl = card.querySelector('.text-2xl'); // your main price span
      const oldEl = card.querySelector('.line-through');

      return {
        name: titleEl ? titleEl.textContent.trim() : 'Product',
        img: imgEl ? imgEl.getAttribute('src') : '',
        imgAlt: imgEl ? (imgEl.getAttribute('alt') || '') : '',
        desc: descEl ? descEl.textContent.trim() : '',
        price: priceEl ? priceEl.textContent.trim() : '',
        oldPrice: oldEl ? oldEl.textContent.trim() : '',
        priceEl,
        addBtnEl: card.querySelector('[data-add-to-cart]')
      };
    }

    function openModal(card) {
      if (!modal) return;
      activeCard = card;

      const p = extractProduct(card);

      modalTitle.textContent = p.name;
      modalImg.src = p.img;
      modalImg.alt = p.imgAlt || p.name;
      modalDesc.textContent = p.desc;
      modalPrice.textContent = p.price;

      if (p.oldPrice) {
        modalOldPrice.textContent = p.oldPrice;
        modalOldPrice.classList.remove('hidden');
      } else {
        modalOldPrice.textContent = '';
        modalOldPrice.classList.add('hidden');
      }

      // Theme: price gradient + button gradient same as card
      copyGradientClasses(p.priceEl, modalPrice, ['bg-clip-text', 'text-transparent']);
      copyGradientClasses(p.addBtnEl, modalAddBtn);

      modal.classList.remove('hidden');
      requestAnimationFrame(() => modal.classList.add('modal-open'));
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('modal-open');
      setTimeout(() => modal.classList.add('hidden'), 180);
      document.body.style.overflow = '';
      activeCard = null;
    }

    // Card click -> modal (but ignore Add-to-cart click)
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-add-to-cart]')) return;

      const card = e.target.closest('[data-product-card]');
      if (!card) return;

      openModal(card);
    });

    // Close modal: backdrop or X
    modal && modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) closeModal();
    });

    // ESC close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal();
    });

    // Modal Add -> trigger original Add-to-cart (same side cart effect)
    modalAddBtn && modalAddBtn.addEventListener('click', function () {
      if (!activeCard) return;
      const originalAdd = activeCard.querySelector('[data-add-to-cart]');
      if (originalAdd) originalAdd.click();
      closeModal();
    });

    // One generic toggle for all sections
    window.toggleSection = function (containerId, btnId, sectionId) {
      const container = document.getElementById(containerId);
      const btn = document.getElementById(btnId);
      if (!container || !btn) return;

      const isHidden = container.classList.contains('hidden');

      if (isHidden) {
        container.classList.remove('hidden');
        btn.innerHTML = '<i class="fa-solid fa-layer-group"></i><span>Show less</span><i class="fa-solid fa-chevron-up text-sm opacity-90"></i>';
        btn.setAttribute('aria-expanded', 'true');
      } else {
        container.classList.add('hidden');
        btn.innerHTML = '<i class="fa-solid fa-layer-group"></i><span>Show all items</span><i class="fa-solid fa-chevron-down text-sm opacity-90"></i>';
        btn.setAttribute('aria-expanded', 'false');

        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  })();