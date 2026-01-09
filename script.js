
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