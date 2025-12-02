(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function burgerInit() {
  const htmlEl = document.documentElement;
  const burgerBtnEl = document.querySelector("[data-burger_button]");
  const burgerNavEl = document.querySelector("[data-burger_nav]");
  const burgerNavListEl = document.querySelector("[data-burger_nav_list]");
  const burgerAnimTime = 500;
  let isOpen = false;
  const burgerOpenAnim = [
    { transform: "translateX(100%)" },
    { transform: "translateX(0%)" }
  ];
  const burgerCloseAnim = [
    { transform: "translateX(0%)" },
    { transform: "translateX(100%)" }
  ];
  const burgerOpenTiming = {
    duration: burgerAnimTime,
    fill: "forwards"
  };
  const burgerCloseTiming = {
    duration: burgerAnimTime
  };
  function toggleMenu() {
    if (!isOpen) {
      isOpen = true;
      if (!burgerNavEl.classList.contains("header__nav--active")) {
        burgerNavEl.classList.add("header__nav--active");
        htmlEl.classList.add("_lock");
        burgerBtnEl.classList.add("header__burger--active");
        burgerNavEl.animate(burgerOpenAnim, burgerOpenTiming);
      } else {
        const animation = burgerNavEl.animate(
          burgerCloseAnim,
          burgerCloseTiming
        );
        burgerBtnEl.classList.remove("header__burger--active");
        animation.addEventListener("finish", () => {
          burgerNavEl.classList.remove("header__nav--active");
          htmlEl.classList.remove("_lock");
        });
      }
      setTimeout(() => {
        isOpen = false;
      }, burgerAnimTime);
    }
  }
  burgerBtnEl.addEventListener("click", toggleMenu);
  burgerNavListEl.addEventListener("click", (e) => {
    if (window.innerWidth > 768) return;
    const el = e.target;
    if (el.closest(".header__link")) {
      toggleMenu();
    }
  });
  let resizeWindowInterval;
  let resizeWindowIntervalTimeout = 100;
  window.addEventListener("resize", (e) => {
    clearInterval(resizeWindowInterval);
    resizeWindowInterval = setTimeout((e2) => {
      if (window.innerWidth > 768 && burgerNavEl.classList.contains("header__nav--active")) {
        console.log("yes");
        burgerBtnEl.classList.remove("header__burger--active");
        burgerNavEl.classList.remove("header__nav--active");
        htmlEl.classList.remove("_lock");
      }
    }, resizeWindowIntervalTimeout);
  });
}
function saveSessionStorage(key, obj) {
  sessionStorage.setItem(key, JSON.stringify(obj));
}
function getSessionStorage(key) {
  const localObj = JSON.parse(sessionStorage.getItem(key));
  return localObj;
}
function accordionInit() {
  const accordionContainer = document.querySelector(
    "[data-accordion_container]"
  );
  const accordionItems = document.querySelectorAll("[data-accordion_item]");
  const accordionButtons = document.querySelectorAll("[data-accordion_button]");
  const ACTIVE_CLASS = "faq__accordion-item--active";
  const localStorageKey = "accordionState";
  const SVG_MINUS_ICON = `
      <svg class="faq__accordion-button-icon" width="16" height="2" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0.25C15.4142 0.25 15.75 0.585786 15.75 1C15.75 1.41421 15.4142 1.75 15 1.75H1C0.585786 1.75 0.25 1.41421 0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H15Z" fill="currentColor" />
      </svg>
  `;
  const SVG_PLUS_ICON = `
      <svg class="faq__accordion-button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0.25C8.41421 0.25 8.75 0.585786 8.75 1V7.25H15C15.4142 7.25 15.75 7.58579 15.75 8C15.75 8.41421 15.4142 8.75 15 8.75H8.75V15C8.75 15.4142 8.41421 15.75 8 15.75C7.58579 15.75 7.25 15.4142 7.25 15V8.75H1C0.585786 8.75 0.25 8.41421 0.25 8C0.25 7.58579 0.585786 7.25 1 7.25H7.25V1C7.25 0.585786 7.58579 0.25 8 0.25Z" fill="currentColor" />
      </svg>
  `;
  window.addEventListener("load", (e) => {
    const stateIndex = getSessionStorage(localStorageKey) ?? 0;
    if (stateIndex === "all closed") return;
    accordionItems.forEach((item, idx) => {
      if (idx === stateIndex) {
        item.classList.add(ACTIVE_CLASS);
      } else {
        item.classList.remove(ACTIVE_CLASS);
      }
    });
    accordionButtons.forEach((item, idx) => {
      if (idx === stateIndex) {
        item.innerHTML = SVG_MINUS_ICON;
      } else {
        item.innerHTML = SVG_PLUS_ICON;
      }
    });
  });
  accordionContainer.addEventListener("click", (e) => {
    const el = e.target;
    const accordionItemEl = el.closest("[data-accordion_item]") ?? null;
    const accordionTargetButton = accordionItemEl.querySelector("[data-accordion_button]") ?? null;
    if (accordionItemEl) {
      const isTargetActive = accordionItemEl.classList.contains(ACTIVE_CLASS);
      if (isTargetActive) {
        saveSessionStorage(localStorageKey, "all closed");
        accordionItemEl.classList.remove(ACTIVE_CLASS);
        accordionTargetButton.innerHTML = SVG_PLUS_ICON;
      } else {
        accordionItems.forEach((item) => {
          item.classList.remove(ACTIVE_CLASS);
        });
        accordionButtons.forEach((item) => {
          item.innerHTML = SVG_PLUS_ICON;
        });
        const activeIndex = Array.from(accordionItems).indexOf(accordionItemEl);
        saveSessionStorage(localStorageKey, activeIndex);
        accordionItemEl.classList.add(ACTIVE_CLASS);
        accordionTargetButton.innerHTML = SVG_MINUS_ICON;
      }
    }
  });
}
function sliderInit() {
  document.getElementById("portfolio");
  const sliderWrapper = document.querySelector("[data-slider_wrapper]");
  const sliderContainer = document.querySelector("[data-slider_container]");
  let wrapperWidth, containerWidth, prevSlideWidth, nextSlideWidth, maxTranslateX;
  function calculateSliderWidths() {
    wrapperWidth = 0;
    containerWidth = sliderContainer.offsetWidth;
    const children = sliderContainer.children;
    const gapBetweenChildren = 20;
    for (let i = 0; i < children.length; i++) {
      wrapperWidth += children[i].offsetWidth;
      if (children.length - 1 > i) {
        wrapperWidth += gapBetweenChildren;
      }
    }
    const prevSlideContainerPercent = 30 / 100;
    const nextSlideContainerPercent = 70 / 100;
    prevSlideWidth = containerWidth * prevSlideContainerPercent;
    nextSlideWidth = containerWidth * nextSlideContainerPercent;
    const containerOffset = 20;
    maxTranslateX = (wrapperWidth - containerWidth) / 2 + containerOffset;
  }
  calculateSliderWidths();
  let resizeWindowInterval;
  let resizeWindowIntervalTimeout = 100;
  window.addEventListener("resize", (e) => {
    clearInterval(resizeWindowInterval);
    resizeWindowInterval = setTimeout(() => {
      calculateSliderWidths();
      if (getSliderTransformValue() > maxTranslateX) {
        sliderContainer.style.transform = `translateX(${maxTranslateX}px)`;
      }
      if (-1 * maxTranslateX > getSliderTransformValue()) {
        sliderContainer.style.transform = `translateX(-${maxTranslateX}px)`;
      }
    }, resizeWindowIntervalTimeout);
  });
  let sliderInterval;
  const sliderMoveByPx = 10;
  const sliderSpeedMilliseconds = 1.5 * 1e3;
  const sliderIntervalTime = sliderSpeedMilliseconds / (maxTranslateX / sliderMoveByPx);
  let debounceMouseMove;
  const debounceMouseMoveTime = 20;
  function getSliderTransformValue() {
    const transform = sliderContainer.style.transform;
    const transformNumber = transform ? parseFloat(transform.match(/-?\d+(\.\d+)?/)[0]) : 0;
    return transformNumber;
  }
  function clearSliderInterval() {
    clearInterval(sliderInterval);
    sliderInterval = void 0;
  }
  function isMobile() {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
    return isTouchDevice && isMobileUA;
  }
  sliderWrapper.addEventListener("mousemove", (e) => {
    if (isMobile()) return;
    const wrapperRect = sliderWrapper.getBoundingClientRect();
    const x = e.clientX - wrapperRect.left;
    if (x > prevSlideWidth && nextSlideWidth > x) {
      clearTimeout(debounceMouseMove);
      debounceMouseMove = setTimeout(() => {
        clearSliderInterval();
      }, debounceMouseMoveTime);
    }
    if (prevSlideWidth > x && maxTranslateX > getSliderTransformValue() && !sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = setInterval(() => {
        let newPosition = getSliderTransformValue() + sliderMoveByPx;
        if (newPosition > maxTranslateX) {
          newPosition = maxTranslateX;
        }
        sliderContainer.style.transform = `translateX(${newPosition}px)`;
        if (getSliderTransformValue() >= maxTranslateX) {
          clearSliderInterval();
        }
      }, sliderIntervalTime);
    }
    if (x > nextSlideWidth && getSliderTransformValue() > -1 * maxTranslateX && !sliderInterval) {
      sliderInterval = setInterval(() => {
        let newPosition = getSliderTransformValue() - sliderMoveByPx;
        if (-1 * maxTranslateX > newPosition) {
          newPosition = -1 * maxTranslateX;
        }
        sliderContainer.style.transform = `translateX(${newPosition}px)`;
        if (Math.abs(getSliderTransformValue()) >= maxTranslateX) {
          clearSliderInterval();
        }
      }, sliderIntervalTime);
    }
  });
  sliderWrapper.addEventListener("mouseleave", (e) => {
    clearSliderInterval();
  });
  let lastTouchStartX;
  sliderWrapper.addEventListener("touchstart", (e) => {
    lastTouchStartX = e.changedTouches[0].clientX;
  });
  sliderWrapper.addEventListener("touchmove", (e) => {
    const lastTouchMoveX = e.changedTouches[0].clientX;
    let moveSliderByPx;
    moveSliderByPx = getSliderTransformValue();
    if (lastTouchMoveX > lastTouchStartX && maxTranslateX >= getSliderTransformValue()) {
      moveSliderByPx += lastTouchMoveX - lastTouchStartX;
      lastTouchStartX = lastTouchMoveX;
      if (moveSliderByPx > maxTranslateX) {
        moveSliderByPx = maxTranslateX;
      }
      sliderContainer.style.transform = `translateX(${moveSliderByPx}px)`;
    }
    if (lastTouchStartX > lastTouchMoveX && getSliderTransformValue() >= -1 * maxTranslateX) {
      moveSliderByPx -= lastTouchStartX - lastTouchMoveX;
      lastTouchStartX = lastTouchMoveX;
      if (-1 * maxTranslateX > moveSliderByPx) {
        moveSliderByPx = -1 * maxTranslateX;
      }
      sliderContainer.style.transform = `translateX(${moveSliderByPx}px)`;
    }
  });
}
function modalInit() {
  const htmlEl = document.documentElement;
  const modalOpenBtns = document.querySelectorAll("[data-modal_open]");
  const modalEl = document.querySelector("[data-modal]");
  const modalContainerEl = document.querySelector("[data-modal_container]");
  const modalCloseBtn = document.querySelector("[data-modal_close_btn]");
  const modalFormEl = document.querySelector("[data-modal_form]");
  const modalAnimTime = 300;
  const modalOpenAnim = [
    { transform: "translateX(100%)" },
    { transform: "translateX(0%)" }
  ];
  const modalCloseAnim = [
    { transform: "translateX(0%)" },
    { transform: "translateX(100%)" }
  ];
  const modalOpenTiming = {
    duration: modalAnimTime,
    fill: "forwards"
  };
  function openModal() {
    modalEl.classList.add("modal__active");
    htmlEl.classList.add("_lock");
    modalContainerEl.animate(modalOpenAnim, modalOpenTiming);
  }
  function closeModal() {
    const animation = modalContainerEl.animate(modalCloseAnim, modalOpenTiming);
    animation.addEventListener("finish", (e) => {
      modalEl.classList.remove("modal__active");
      htmlEl.classList.remove("_lock");
    });
  }
  modalOpenBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      openModal();
    });
  });
  modalEl.addEventListener("click", (e) => {
    const el = e.target;
    if (!el.closest("[data-modal_container]")) {
      closeModal();
    }
  });
  modalCloseBtn.addEventListener("click", closeModal);
  modalFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}
document.addEventListener("DOMContentLoaded", () => {
  burgerInit();
  sliderInit();
  accordionInit();
  modalInit();
  const footerFormEl = document.querySelector("[data-footer_form]");
  footerFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});
//# sourceMappingURL=index.js.map
