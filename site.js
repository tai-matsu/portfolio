window.addEventListener("load", () => {
  const worksData = window.WORKS_DATA ?? {};
  const workCards = [...document.querySelectorAll(".work-item[data-work-key]")];

  document.querySelectorAll("[data-work-key]").forEach((element) => {
    const work = worksData[element.dataset.workKey];

    if (!work) {
      return;
    }

    element.querySelectorAll("[data-work-card-tags]").forEach((tagsRoot) => {
      tagsRoot.innerHTML = "";
      work.tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "work-chip";
        chip.textContent = tag;
        tagsRoot.appendChild(chip);
      });
    });

    element.querySelectorAll("[data-work-tags]").forEach((tagsRoot) => {
      tagsRoot.innerHTML = "";
      work.tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "detail-tag";
        chip.textContent = tag;
        tagsRoot.appendChild(chip);
      });
    });
  });

  const filtersRoot = document.querySelector("[data-work-filters]");

  if (filtersRoot && workCards.length > 0) {
    const preferredFilterOrder = [
      "Personal Project",
      "Student Project",
      "Web Design",
      "Space Design",
      "XR",
    ];
    const availableTags = [...new Set(
      workCards.flatMap((card) => {
        const work = worksData[card.dataset.workKey];
        return work?.tags ?? [];
      })
    )];
    const filterLabels = [
      "All",
      ...preferredFilterOrder.filter((tag) => availableTags.includes(tag)),
      ...availableTags.filter((tag) => !preferredFilterOrder.includes(tag)),
    ];

    let selectedTag = "All";

    const syncFilterButtons = () => {
      filtersRoot.querySelectorAll("button[data-filter-tag]").forEach((button) => {
        const tag = button.dataset.filterTag;
        const isActive = tag === selectedTag;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    };

    const applyFilters = () => {
      workCards.forEach((card) => {
        const tags = worksData[card.dataset.workKey]?.tags ?? [];
        const isVisible = selectedTag === "All" || tags.includes(selectedTag);
        card.hidden = !isVisible;
      });
    };

    filterLabels.forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "works-filter-chip";
      button.dataset.filterTag = label;
      button.textContent = label;
      button.setAttribute("aria-pressed", String(label === "All"));

      button.addEventListener("click", () => {
        selectedTag = label;
        syncFilterButtons();
        applyFilters();
      });

      filtersRoot.appendChild(button);
    });

    syncFilterButtons();
    applyFilters();
  }

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
