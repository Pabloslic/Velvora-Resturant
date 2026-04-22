const ctaForms = document.querySelectorAll(".cta-form");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navOverlay = document.querySelector(".nav-overlay");
const addToOrderButtons = document.querySelectorAll("[data-add-to-order]");
const orderList = document.querySelector("[data-order-list]");
const orderTotal = document.querySelector("[data-order-total]");
const paymentSummary = document.querySelector("[data-payment-summary]");
const paymentOptions = document.querySelectorAll("[data-payment-option]");
const paymentPanels = document.querySelectorAll("[data-payment-panel]");
const paymentForms = document.querySelectorAll(".payment-form");
const faqQuestions = document.querySelectorAll(".faq-question");

const storageKey = "velvora-order";

const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const getOrder = () => {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
};

const setOrder = (items) => {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
};

const toggleMenu = (forceOpen) => {
  if (!menuButton || !navLinks || !navOverlay) {
    return;
  }

  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !navLinks.classList.contains("is-open");
  navLinks.classList.toggle("is-open", shouldOpen);
  navOverlay.classList.toggle("is-active", shouldOpen);
  menuButton.classList.toggle("is-open", shouldOpen);
  menuButton.setAttribute("aria-expanded", String(shouldOpen));
};

if (menuButton) {
  menuButton.addEventListener("click", () => toggleMenu());
}

if (navOverlay) {
  navOverlay.addEventListener("click", () => toggleMenu(false));
}

if (navLinks) {
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });
}

ctaForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const button = form.querySelector("button");
    const input = form.querySelector("input");

    if (!button || !input) {
      return;
    }

    const originalLabel = button.textContent;
    const hasValue = input.value.trim().length > 0;

    button.textContent = hasValue ? "Request Sent" : "Add Your Email";

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
});

addToOrderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const order = getOrder();
    order.push({
      name: button.dataset.name,
      price: Number(button.dataset.price),
      image: button.dataset.image,
      description: button.dataset.description,
    });
    setOrder(order);
    button.textContent = "Added to Order";

    window.setTimeout(() => {
      button.textContent = button.dataset.defaultLabel || "Add to Order";
    }, 1600);
  });
});

if (orderList) {
  const items = getOrder();

  if (items.length === 0) {
    orderList.innerHTML = `
      <div class="order-card">
        <p class="empty-state">Your order list is empty right now. Visit the menu and add a few dishes first.</p>
      </div>
    `;
  } else {
    orderList.innerHTML = items
      .map(
        (item) => `
          <article class="order-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <h3>${item.name}</h3>
              <p>${item.description}</p>
            </div>
            <span class="order-item-price">${formatNaira(item.price)}</span>
          </article>
        `
      )
      .join("");
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  if (orderTotal) {
    orderTotal.textContent = formatNaira(total);
  }
}

if (paymentSummary) {
  const items = getOrder();
  const total = items.reduce((sum, item) => sum + item.price, 0);
  paymentSummary.textContent = items.length
    ? `${items.length} item${items.length > 1 ? "s" : ""} selected - ${formatNaira(total)} total`
    : "No items selected yet. Add dishes from the menu before payment.";
}

paymentOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const target = option.dataset.paymentOption;

    paymentOptions.forEach((item) => item.classList.toggle("is-active", item === option));
    paymentPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.paymentPanel === target);
    });
  });
});

paymentForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');

    if (!submitButton) {
      return;
    }

    const originalLabel = submitButton.textContent;
    submitButton.textContent = "Confirmed";

    window.setTimeout(() => {
      submitButton.textContent = originalLabel;
    }, 1800);
  });
});

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.closest(".faq-item");

    if (!item) {
      return;
    }

    item.classList.toggle("is-open");
  });
});
