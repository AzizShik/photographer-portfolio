import '../styles/main.scss';
import burgerInit from './components/burger';
import accordionInit from './components/accordion';
import sliderInit from './components/slider';
import modalInit from './components/modal';

document.addEventListener('DOMContentLoaded', () => {
  burgerInit();
  sliderInit();
  accordionInit();
  modalInit();

  const footerFormEl = document.querySelector('[data-footer_form]');
  footerFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
  });
});
