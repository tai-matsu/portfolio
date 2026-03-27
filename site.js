window.addEventListener("load", () => {
  const navigationEntry = performance.getEntriesByType?.("navigation")?.[0];
  const isReload =
    navigationEntry?.type === "reload" ||
    (!navigationEntry && window.performance?.navigation?.type === 1);

  if (isReload) {
    window.scrollTo(0, 0);
  }

  document.body.classList.add("page-ready");

  const menuButton = document.querySelector(".top-menu-toggle");
  const navigation = document.querySelector(".top-nav");

  if (!menuButton || !navigation) {
    return;
  }

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("nav-open", !expanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
});
