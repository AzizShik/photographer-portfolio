import '../styles/main.scss';
import burgerInit from './components/burger';
import accordionInit from './components/accordion';
import sliderInit from './components/slider';

document.addEventListener('DOMContentLoaded', () => {
  burgerInit();
  sliderInit();
  accordionInit();
});
