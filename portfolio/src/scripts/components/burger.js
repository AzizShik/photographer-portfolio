export default function burgerInit() {
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const burgerBtnEl = document.querySelector('[data-burger_button]');
  const burgerNavEl = document.querySelector('[data-burger_nav]');
  const burgerNavListEl = document.querySelector('[data-burger_nav_list]');

  const burgerAnimTime = 500;
  let isOpen = false;

  const burgerOpenAnim = [
    { transform: 'translateX(100%)' },
    { transform: 'translateX(0%)' },
  ];

  const burgerCloseAnim = [
    { transform: 'translateX(0%)' },
    { transform: 'translateX(100%)' },
  ];

  const burgerOpenTiming = {
    duration: burgerAnimTime,
    fill: 'forwards',
  };

  function toggleMenu() {
    if (!isOpen) {
      isOpen = true;

      if (!burgerNavEl.classList.contains('header__nav--active')) {
        burgerNavEl.classList.add('header__nav--active');
        htmlEl.classList.add('_lock');
        burgerBtnEl.classList.add('header__burger--active');
        burgerNavEl.animate(burgerOpenAnim, burgerOpenTiming);
      } else {
        const animation = burgerNavEl.animate(
          burgerCloseAnim,
          burgerOpenTiming,
        );
        burgerBtnEl.classList.remove('header__burger--active');
        animation.addEventListener('finish', () => {
          burgerNavEl.classList.remove('header__nav--active');
          htmlEl.classList.remove('_lock');
        });
      }

      setTimeout(() => {
        isOpen = false;
      }, burgerAnimTime);
    }
  }

  burgerBtnEl.addEventListener('click', toggleMenu);
  burgerNavListEl.addEventListener('click', (e) => {
    const el = e.target;
    if (el.closest('.header__link')) {
      toggleMenu();
    }
  });
}
