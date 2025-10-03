import {
  getLocalStorage,
  removeLocalStorage,
  saveLocalStorage,
} from '../utils/localStorage';

export default function accordionInit() {
  const accordionContainer = document.querySelector(
    '[data-accordion_container]',
  );
  const accordionItems = document.querySelectorAll('[data-accordion_item]');
  const accordionButtons = document.querySelectorAll('[data-accordion_button]');

  const ACTIVE_CLASS = 'faq__accordion-item--active';
  const localStorageKey = 'accordionState';
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

  window.addEventListener('load', (e) => {
    const stateIndex = getLocalStorage(localStorageKey) ?? 0;

    if (stateIndex === 'all closed') return;

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

  accordionContainer.addEventListener('click', (e) => {
    const el = e.target;
    const accordionItemEl = el.closest('[data-accordion_item]') ?? null;
    const accordionTargetButton =
      accordionItemEl.querySelector('[data-accordion_button]') ?? null;

    if (accordionItemEl) {
      const isTargetActive = accordionItemEl.classList.contains(ACTIVE_CLASS);

      if (isTargetActive) {
        saveLocalStorage(localStorageKey, 'all closed');
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
        saveLocalStorage(localStorageKey, activeIndex);

        accordionItemEl.classList.add(ACTIVE_CLASS);
        accordionTargetButton.innerHTML = SVG_MINUS_ICON;
      }
    }
  });
}
