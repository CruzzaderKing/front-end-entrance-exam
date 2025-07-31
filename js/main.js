/* jshint esversion: 6 */
import "../css/style.scss";

document.querySelectorAll(".ripple-container").forEach((container) => {
  container.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

document.querySelectorAll("h1, h2, h3, p, span, li").forEach((el) => {
  el.setAttribute("contenteditable", "true");
});

document
  .querySelectorAll("[contenteditable]:not([data-id])")
  .forEach((el, index) => {
    const tag = el.tagName.toLowerCase();

    let text = el.innerText
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    if (!text || text.length < 2) text = "text";

    const dataId = `${tag}-${text}-${index}`;
    el.setAttribute("data-id", dataId);
  });

document.querySelectorAll("[contenteditable][data-id]").forEach((el) => {
  const key = "editable-" + el.dataset.id;

  const saved = localStorage.getItem(key);
  if (saved !== null) {
    el.innerText = saved;
  }

  el.addEventListener("blur", () => {
    localStorage.setItem(key, el.innerText);
  });

  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      el.blur();
    }
  });
});
