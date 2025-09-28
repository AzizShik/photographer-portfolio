export default function sliderInit() {
  const portfolioEl = document.getElementById('portfolio');
  const sliderWrapper = document.querySelector('[data-slider_wrapper]');
  const sliderContainer = document.querySelector('[data-slider_container]');

  let wrapperWidth = 0;
  const containerWidth = sliderContainer.offsetWidth;
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
  const prevSlideWidth = containerWidth * prevSlideContainerPercent;
  const nextSlideWidth = containerWidth * nextSlideContainerPercent;

  const containerOffset = 20;
  const maxTranslateX = (wrapperWidth - containerWidth) / 2 + containerOffset;

  console.log(maxTranslateX, prevSlideWidth);

  let sliderInterval;
  const sliderMoveByPx = 10;
  const sliderSpeedMilliseconds = 1.5 * 1000;
  const sliderIntervalTime =
    sliderSpeedMilliseconds / (maxTranslateX / sliderMoveByPx);

  let debounceMouseMove;
  const debounceMouseMoveTime = 20;

  function getSliderTransformValue() {
    const transform = sliderContainer.style.transform;
    const transformNumber = transform
      ? parseFloat(transform.match(/-?\d+(\.\d+)?/)[0])
      : 0;

    return transformNumber;
  }

  function clearSliderInterval() {
    clearInterval(sliderInterval);
    sliderInterval = undefined;
  }

  sliderWrapper.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;

    const wrapperRect = sliderWrapper.getBoundingClientRect();
    const x = e.clientX - wrapperRect.left;

    if (x > prevSlideWidth && nextSlideWidth > x) {
      clearTimeout(debounceMouseMove);
      debounceMouseMove = setTimeout(() => {
        clearSliderInterval();
      }, debounceMouseMoveTime);
    }

    if (
      prevSlideWidth > x &&
      maxTranslateX > getSliderTransformValue() &&
      !sliderInterval
    ) {
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

    if (
      x > nextSlideWidth &&
      getSliderTransformValue() > -1 * maxTranslateX &&
      !sliderInterval
    ) {
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

  sliderWrapper.addEventListener('mouseleave', (e) => {
    clearSliderInterval();
  });

  let lastTouchStartX;

  sliderWrapper.addEventListener('touchstart', (e) => {
    lastTouchStartX = e.changedTouches[0].clientX;
  });

  sliderWrapper.addEventListener('touchmove', (e) => {
    const lastTouchMoveX = e.changedTouches[0].clientX;
    let moveSliderByPx;

    moveSliderByPx = getSliderTransformValue();

    if (
      lastTouchMoveX > lastTouchStartX &&
      maxTranslateX >= getSliderTransformValue()
    ) {
      moveSliderByPx += lastTouchMoveX - lastTouchStartX;
      lastTouchStartX = lastTouchMoveX;

      if (moveSliderByPx > maxTranslateX) {
        moveSliderByPx = maxTranslateX;
      }

      sliderContainer.style.transform = `translateX(${moveSliderByPx}px)`;
    }

    if (
      lastTouchStartX > lastTouchMoveX &&
      getSliderTransformValue() >= -1 * maxTranslateX
    ) {
      moveSliderByPx -= lastTouchStartX - lastTouchMoveX;
      lastTouchStartX = lastTouchMoveX;

      if (-1 * maxTranslateX > moveSliderByPx) {
        moveSliderByPx = -1 * maxTranslateX;
      }

      sliderContainer.style.transform = `translateX(${moveSliderByPx}px)`;
    }
  });
}
