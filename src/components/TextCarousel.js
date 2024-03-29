export default class TextCarousel {
  constructor(
    words,
    targetElement,
    options = {
      delay: 5000,
      class: "carouselHeader",
      classShow: "carouselHeaderShow",
      classHide: "carouselHeaderHide",
    }
  ) {
    this.words = words;
    this.element = targetElement;
    this.options = options;
    this.currentIndex = undefined;
    this.targetIndex = 0;

    this.setElements();
    this.setAnimation();
  }

  setElements() {
    this.element.classList.add(this.options.class);
  }

  setAnimation() {
    this.targetIndex = Math.floor(Math.random() * this.words.length);
    if (this.targetIndex === this.currentIndex) {
      this.setAnimation();
      return;
    }
    this.clearPreviousWord();
    setTimeout(() => {
      this.setAnimation();
    }, this.options.delay);
  }

  clearPreviousWord() {
    const previousLetters = document.querySelectorAll(
      `.${this.options.classShow}`
    );
    if (previousLetters.length === 0) {
      this.setNextWord();
    }
    previousLetters.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add(this.options.classHide);
      }, 40 * index);

      setTimeout(() => {
        span.remove();
        if (index === previousLetters.length - 1) {
          this.setNextWord();
        }
      }, 800);
    });
  }

  setNextWord() {
    this.currentIndex = this.targetIndex;
    const targetWord = this.words[this.targetIndex];
    const targetLetters = targetWord.split("");
    const span = document.createElement("span");
    targetLetters.forEach((letter, index) => {
      const spanClone = span.cloneNode(false);
      spanClone.innerText = letter;
      if (letter === " ") {
        spanClone.style.display = "inline";
      }
      spanClone.classList.add(this.options.classHide);
      this.element.appendChild(spanClone);
      setTimeout(() => {
        spanClone.classList.remove(this.options.classHide);
        spanClone.classList.add(this.options.classShow);
      }, 50 * index);
    });
  }
}
