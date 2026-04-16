const ctaForms = document.querySelectorAll(".cta-form");

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
