
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
      
      // Add pulse animation to cart badge
      cartCountEl?.classList.add('animate-pulse');
      setTimeout(() => cartCountEl?.classList.remove('animate-pulse'), 600);
    });
  });
})();