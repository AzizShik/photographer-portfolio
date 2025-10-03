export default function modalInit() {
  const htmlEl = document.documentElement;
  const modalOpenBtns = document.querySelectorAll('[data-modal_open]');
  const modalEl = document.querySelector('[data-modal]');
  const modalContainerEl = document.querySelector('[data-modal_container]');
  const modalCloseBtn = document.querySelector('[data-modal_close_btn]');
  const modalFormEl = document.querySelector('[data-modal_form]');

  const modalAnimTime = 300;

  const modalOpenAnim = [
    { transform: 'translateX(100%)' },
    { transform: 'translateX(0%)' },
  ];

  const modalCloseAnim = [
    { transform: 'translateX(0%)' },
    { transform: 'translateX(100%)' },
  ];

  const modalOpenTiming = {
    duration: modalAnimTime,
    fill: 'forwards',
  };

  function openModal() {
    modalEl.classList.add('modal__active');
    htmlEl.classList.add('_lock');
    modalContainerEl.animate(modalOpenAnim, modalOpenTiming);
  }

  function closeModal() {
    const animation = modalContainerEl.animate(modalCloseAnim, modalOpenTiming);

    animation.addEventListener('finish', (e) => {
      modalEl.classList.remove('modal__active');
      htmlEl.classList.remove('_lock');
    });
  }

  modalOpenBtns.forEach((button) => {
    button.addEventListener('click', (e) => {
      openModal();
    });
  });

  modalEl.addEventListener('click', (e) => {
    const el = e.target;
    if (!el.closest('[data-modal_container]')) {
      closeModal();
    }
  });
  modalCloseBtn.addEventListener('click', closeModal);
  modalFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    // closeModal();
  });
}
