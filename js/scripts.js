
(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("#contact-form");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (form) {
    const status = form.querySelector("#form-status");
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const message = form.querySelector("#message").value.trim();

      if (!name || !email || !message) {
        status.textContent = "Please complete all fields.";
        return;
      }

      button.disabled = true;
      status.textContent = "Sending your message...";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to send your message."
          );
        }

        form.reset();
        status.textContent =
          "Thank you! Your message has been submitted successfully.";
      } catch (error) {
        status.textContent =
          error.message ||
          "Something went wrong. Please try again later.";
      } finally {
        button.disabled = false;
      }
    });
  }
})();
