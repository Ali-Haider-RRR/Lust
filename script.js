let activeClasses = ["bg-blue-800", "p-1.5", "rounded-xl", "border-2", "border-solid"];
let homeLink = document.querySelector(".home");
let productLink = document.querySelector(".product");
function setActive(activeElement, inactiveElement) {
    activeClasses.forEach(val => {
        activeElement.classList.add(val);
        inactiveElement.classList.remove(val);
    });
}
let currentPath = window.location.pathname;
if (currentPath.includes("product")) {
    setActive(productLink, homeLink);
} else {
    setActive(homeLink, productLink);
}