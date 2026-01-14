document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'cartItems';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const money = (n) => '$' + (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function totalQty(items) {
    return items.reduce((a, it) => a + (it.qty || 0), 0);
  }

  function updateBadges() {
    const items = loadCart();
    const qty = totalQty(items);
    $$('[data-cart-count]').forEach(el => (el.textContent = String(qty)));
  }

  $$('[id="year"]').forEach(el => (el.textContent = new Date().getFullYear()));

  function parsePrice(text) {
    return Number((text || '').replace(/[^0-9.]/g, '')) || 0;
  }

  function addCardToCart(cardEl) {
    if (!cardEl) return;

    const name = cardEl.querySelector('h3')?.textContent?.trim() || 'Product';
    const image = cardEl.querySelector('img')?.getAttribute('src') || '';
    const priceText = cardEl.querySelector('.text-2xl')?.textContent?.trim() || '0';
    const price = parsePrice(priceText);

    const id = cardEl.getAttribute('data-id') || (name + '|' + image + '|' + price);

    const items = loadCart();
    const idx = items.findIndex(x => String(x.id) === String(id));

    if (idx >= 0) items[idx].qty = (items[idx].qty || 1) + 1;
    else items.push({ id, name, image, price, qty: 1 });

    saveCart(items);
    updateBadges();
  }

  function addToCartFromButton(btn) {
    const card = btn.closest('[data-product-card]') || btn.closest('article');
    addCardToCart(card);
  }

  const toast = $('#toast');
  const toastMessage = $('#toastMessage');
  const closeToastBtn = $('#closeToastBtn');
  let toastTimer = null;

  function hideToast() {
    if (!toast) return;
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }

  function showToast(message = 'Added to cart') {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;

    if (toastTimer) clearTimeout(toastTimer);

    toast.classList.remove('hidden');
    requestAnimationFrame(() => toast.classList.add('show'));

    toastTimer = setTimeout(hideToast, 2500);
  }

  closeToastBtn?.addEventListener('click', hideToast);
  toast?.addEventListener('click', hideToast);

  $$('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCartFromButton(btn);
      showToast('Item added to cart!');
    });
  });

  const input = $('#searchInput');
  const clearBtn = $('#clearSearch');
  const resultsCount = $('#resultsCount');
  const noResults = $('#noResults');
  const cards = $$('[data-product-card]');

  function normalize(s) { return (s || '').toLowerCase().trim(); }

  function applyFilter() {
    if (!input) return;
    const q = normalize(input.value);
    clearBtn?.classList.toggle('hidden', q.length === 0);

    let shown = 0;
    for (const card of cards) {
      const hay = normalize(card.getAttribute('data-search'));
      const match = q === '' || hay.includes(q);
      card.classList.toggle('hidden', !match);
      if (match) shown += 1;
    }

    if (resultsCount) resultsCount.textContent = String(shown);
    noResults?.classList.toggle('hidden', shown !== 0);
  }

  input?.addEventListener('input', applyFilter);
  clearBtn?.addEventListener('click', () => {
    if (!input) return;
    input.value = '';
    input.focus();
    applyFilter();
  });
  if (input) applyFilter();

  (function initModal() {
    const modal = $('#productModal');
    if (!modal) return;

    const modalTitle = $('#modalTitle');
    const modalImg = $('#modalImg');
    const modalDesc = $('#modalDesc');
    const modalPrice = $('#modalPrice');
    const modalOldPrice = $('#modalOldPrice');
    const modalAddBtn = $('#modalAddToCart');

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

      const remove = [];
      toEl.classList.forEach(c => { if (gradientPatterns.some(rx => rx.test(c))) remove.push(c); });
      remove.forEach(c => toEl.classList.remove(c));

      fromEl.classList.forEach(c => { if (gradientPatterns.some(rx => rx.test(c))) toEl.classList.add(c); });
      ensure.forEach(c => toEl.classList.add(c));
    }

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
        oldPrice: oldEl ? oldEl.textContent.trim() : '',
        priceEl,
        addBtnEl: card.querySelector('[data-add-to-cart]')
      };
    }

    function openModal(card) {
      activeCard = card;
      const p = extractProduct(card);

      if (modalTitle) modalTitle.textContent = p.name;
      if (modalImg) {
        modalImg.src = p.img;
        modalImg.alt = p.imgAlt || p.name;
      }
      if (modalDesc) modalDesc.textContent = p.desc;
      if (modalPrice) modalPrice.textContent = p.price;

      if (modalOldPrice) {
        if (p.oldPrice) {
          modalOldPrice.textContent = p.oldPrice;
          modalOldPrice.classList.remove('hidden');
        } else {
          modalOldPrice.textContent = '';
          modalOldPrice.classList.add('hidden');
        }
      }

      copyGradientClasses(p.priceEl, modalPrice, ['bg-clip-text', 'text-transparent']);
      copyGradientClasses(p.addBtnEl, modalAddBtn);

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

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-add-to-cart]')) return;

      const card = e.target.closest('[data-product-card]');
      if (!card) return;

      openModal(card);
    });

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-close]')) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    modalAddBtn?.addEventListener('click', () => {
      if (!activeCard) return;
      addCardToCart(activeCard);
      showToast('Item added to cart!');
      closeModal();
    });
  })();

  function toggleSection(containerId, btnId, sectionId) {
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
  }

  window.toggleSection = toggleSection;
  window.toggleCards = () => toggleSection('container-card', 'toggleBtn', 'C1');
  window.toggleCards2 = () => toggleSection('container-card2', 'toggleBtn2', 'C2');
  window.toggleCards3 = () => toggleSection('container-card3', 'toggleBtn3', 'C3');
  window.toggleCards4 = () => toggleSection('container-card4', 'toggleBtn4', 'C4');

  const cartList = $('#cartList');
  if (cartList) {
    const emptyCart = $('#emptyCart');
    const clearCartBtn = $('#clearCartBtn');

    const subtotalEl = $('#subtotal');
    const shippingEl = $('#shipping');
    const taxEl = $('#tax');
    const totalEl = $('#total');

    const payBtn = $('#payBtn');
    const payError = $('#payError');

    const onlineBox = $('#onlineBox');
    const onlineFields = $('#onlineFields');
    const cardFields = $('#cardFields');
    const walletFields = $('#walletFields');
    const onlineHint = $('#onlineHint');

    const cardNumber = $('#cardNumber');
    const cardExpiry = $('#cardExpiry');
    const cardCvv = $('#cardCvv');
    const walletNumber = $('#walletNumber');

    const thanksModal = $('#thanksModal');
    const thanksPanel = $('#thanksPanel');
    const closeThanksBtn = $('#closeThanksBtn');

    let selectedOnlineMethod = null;

    function setError(msg) {
      if (!payError) return;
      if (!msg) {
        payError.classList.add('hidden');
        payError.textContent = '';
        return;
      }
      payError.textContent = msg;
      payError.classList.remove('hidden');
    }

    function calcTotals(items) {
      const subtotal = items.reduce((a, it) => a + (Number(it.price) || 0) * (it.qty || 0), 0);
      const shipping = items.length ? 0 : 0;
      const tax = subtotal * 0.0;
      const total = subtotal + shipping + tax;
      return { subtotal, shipping, tax, total };
    }

    function renderCart() {
      const items = loadCart();
      updateBadges();

      const t = calcTotals(items);
      subtotalEl && (subtotalEl.textContent = money(t.subtotal));
      shippingEl && (shippingEl.textContent = money(t.shipping));
      taxEl && (taxEl.textContent = money(t.tax));
      totalEl && (totalEl.textContent = money(t.total));

      if (!items.length) {
        cartList.innerHTML = '';
        emptyCart?.classList.remove('hidden');
        if (payBtn) payBtn.textContent = 'Place Order';
        return;
      }

      emptyCart?.classList.add('hidden');

      cartList.innerHTML = items.map(it => {
        const lineTotal = (Number(it.price) || 0) * (it.qty || 0);
        const safeName = (it.name || 'Product').replaceAll('"', '&quot;');
        return `
          <div class="p-5 flex gap-4 items-start">
            <div class="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-white/5 grid place-items-center flex-shrink-0">
              <img src="${it.image || ''}" alt="${safeName}" class="w-full h-full object-cover" onerror="this.style.display='none'">
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-black text-lg truncate">${it.name || 'Product'}</div>
                  <div class="text-white/60 text-sm mt-0.5">${money(Number(it.price) || 0)}</div>
                </div>

                <button class="text-white/50 hover:text-white transition" data-action="remove" data-id="${it.id}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>

              <div class="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <div class="inline-flex items-center rounded-2xl border border-white/12 bg-white/5 overflow-hidden">
                  <button class="px-4 py-2 hover:bg-white/10 transition cursor-pointer" data-action="dec" data-id="${it.id}">-</button>
                  <div class="px-4 py-2 font-bold min-w-12 text-center">${it.qty || 1}</div>
                  <button class="px-4 py-2 hover:bg-white/10 transition cursor-pointer" data-action="inc" data-id="${it.id}">+</button>
                </div>

                <div class="font-black text-white/90">
                  <span class="text-white/50 font-semibold mr-2">Total:</span>${money(lineTotal)}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      const payMode = document.querySelector('input[name="payMode"]:checked')?.value || 'cod';
      if (payBtn) payBtn.textContent = payMode === 'online' ? 'Pay Now' : 'Place Order';
    }

    function updateQty(id, delta) {
      const items = loadCart();
      const idx = items.findIndex(x => String(x.id) === String(id));
      if (idx === -1) return;

      items[idx].qty = (items[idx].qty || 1) + delta;
      if (items[idx].qty <= 0) items.splice(idx, 1);

      saveCart(items);
      renderCart();
    }

    function removeItem(id) {
      const items = loadCart().filter(x => String(x.id) !== String(id));
      saveCart(items);
      renderCart();
    }

    cartList.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'inc') updateQty(id, +1);
      if (action === 'dec') updateQty(id, -1);
      if (action === 'remove') removeItem(id);
    });

    clearCartBtn?.addEventListener('click', () => {
      saveCart([]);
      renderCart();
    });

    function resetOnlineUI() {
      selectedOnlineMethod = null;
      $$('[data-method]').forEach(b => b.classList.remove('active'));
      onlineFields?.classList.add('hidden');
      cardFields?.classList.add('hidden');
      walletFields?.classList.add('hidden');
      if (cardNumber) cardNumber.value = '';
      if (cardExpiry) cardExpiry.value = '';
      if (cardCvv) cardCvv.value = '';
      if (walletNumber) walletNumber.value = '';
      if (onlineHint) onlineHint.textContent = 'Select a method to enter details';
    }

    $$('input[name="payMode"]').forEach(r => {
      r.addEventListener('change', () => {
        setError('');
        const mode = document.querySelector('input[name="payMode"]:checked')?.value || 'cod';

        if (mode === 'online') {
          onlineBox?.classList.remove('hidden');
          if (payBtn) payBtn.textContent = 'Pay Now';
        } else {
          onlineBox?.classList.add('hidden');
          if (payBtn) payBtn.textContent = 'Place Order';
          resetOnlineUI();
        }
      });
    });

    $$('[data-method]').forEach(btn => {
      btn.addEventListener('click', () => {
        setError('');

        $$('[data-method]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        selectedOnlineMethod = btn.getAttribute('data-method');
        onlineFields?.classList.remove('hidden');

        if (selectedOnlineMethod === 'card') {
          cardFields?.classList.remove('hidden');
          walletFields?.classList.add('hidden');
          if (onlineHint) onlineHint.textContent = 'Enter card details';
        } else {
          cardFields?.classList.add('hidden');
          walletFields?.classList.remove('hidden');
          if (onlineHint) onlineHint.textContent = 'Enter account / mobile number';
        }
      });
    });

    function openThanks() {
      if (!thanksModal || !thanksPanel) return;
      thanksModal.classList.remove('hidden');
      requestAnimationFrame(() => thanksPanel.classList.add('show'));
    }

    function closeThanks() {
      if (!thanksModal || !thanksPanel) return;
      thanksPanel.classList.remove('show');
      setTimeout(() => thanksModal.classList.add('hidden'), 200);
    }

    closeThanksBtn?.addEventListener('click', closeThanks);

    thanksModal?.addEventListener('click', (e) => {
      const backdrop = thanksModal.firstElementChild;
      if (e.target === backdrop) closeThanks();
    });

    payBtn?.addEventListener('click', () => {
      setError('');

      const items = loadCart();
      if (!items.length) {
        setError('Your cart is empty.');
        return;
      }

      const mode = document.querySelector('input[name="payMode"]:checked')?.value || 'cod';

      if (mode === 'online') {
        if (!selectedOnlineMethod) {
          setError('Please select an online payment method.');
          return;
        }

        if (selectedOnlineMethod === 'card') {
          const cn = (cardNumber?.value || '').replace(/\s+/g, '').trim();
          const ex = (cardExpiry?.value || '').trim();
          const cv = (cardCvv?.value || '').trim();

          if (cn.length < 12 || ex.length < 4 || cv.length < 3) {
            setError('Please enter valid card details.');
            return;
          }
        } else {
          const wn = (walletNumber?.value || '').trim();
          if (wn.length < 10) {
            setError('Please enter a valid account / mobile number.');
            return;
          }
        }
      }

      saveCart([]);
      resetOnlineUI();
      renderCart();
      openThanks();
    });

    renderCart();
  }

  updateBadges();
});