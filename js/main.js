/* jshint esversion: 6 */

import "../css/style.scss";


window.addEventListener("load", () => {
  document.body.style.visibility = "visible";
});

//Убираем HTML-теги и опасные символы
function sanitize(text) {
  return text
    .replace(/[<>]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Добавляем ripple-анимацию на все элементы с классом .ripple-container
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
    setTimeout(() => ripple.remove(), 600); // Удаляем ripple через 0.6s
  });
});

// Делаем все заголовки, параграфы, списки редактируемыми вручную
document.querySelectorAll("h1, h2, h3, p, span, li").forEach((el) => {
  el.setAttribute("contenteditable", "true");
});

// Назначаем уникальный data-id каждому редактируемому элементу
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

// Включаем автосохранение, защиту от XSS и завершение по Enter
document.querySelectorAll("[contenteditable][data-id]").forEach((el) => {
  const key = "editable-" + el.dataset.id;

  // Восстановление из localStorage при загрузке
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    el.innerText = sanitize(saved);
  }

  // Сохраняем в localStorage при потере фокуса
  el.addEventListener("blur", () => {
    localStorage.setItem(key, sanitize(el.innerText));

    // CSS-анимация сохранения
    el.classList.add("edited");
    setTimeout(() => el.classList.remove("edited"), 500);
  });

  // Завершение редактирования по Enter
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter = разрыв строки
        document.execCommand("insertLineBreak");
      } else {
        // Просто Enter = завершение редактирования
        e.preventDefault();
        el.blur();
      }
    }
  });

  // Вставка только текста при вставке из буфера обмена
  el.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, sanitize(text));
  });
});
