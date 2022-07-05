import ScrollSection from "./ScrollSection";

/**
 * Creates and manages full page, vertical and/or horizontal scrolling.
 *
 * @param {number} scrollDelay The delay before allowing another scroll execution. Default is 700ms.
 * @param {string} scrollClassY The CSS class for each vertical scroll section.
 * @param {string} scrollClassX The CSS class for each horizontal scroll section.
 */
export default class ScrollManager {
  constructor(
    scrollDelay = 800,
    scrollClassY = "scrollSectionY",
    scrollClassX = "scrollSectionX"
  ) {
    this.scrollDelay = scrollDelay;
    this.scrollClassY = scrollClassY;
    this.scrollClassX = scrollClassX;

    this.isScrolling = false;
    this.isScrollLocked = false;
    this.isXScrollScreenFocused = false;
    this.currentScreenIndex = 0;
    this.currentSubScreenIndex = 0;
    this.maxScreenIndex = 0;

    this.scrollOrderArray = [];
    this.xScrollElArray = [];

    this.scrollEvent = new CustomEvent("scrollEvent", {
      detail: {
        index: this.currentScreenIndex,
        isXScroll: this.isXScrollScreenFocused,
      },
    });

    this.setScrollOrder();

    // Handlers
    this.handlers = {
      wheel: (e) => {
        this.handleWheelEvent(e);
      },
      touch: (e) => {
        this.handleTouchEvent(e);
      },
      touchMove: (e) => {
        this.handleTouchMove(e);
      },
      scrollKey: (e) => {
        this.handleScrollKeyEvent(e);
      },
    };

    // Event listeners
    window.addEventListener("wheel", this.handlers.wheel, { passive: false });
    window.addEventListener("touchstart", this.handlers.touch, {
      passive: false,
    });
    window.addEventListener("touchmove", this.handlers.touchMove, {
      passive: false,
    });
    window.addEventListener("touchend", this.handlers.touch, {
      passive: false,
    });
    window.addEventListener("keydown", this.handlers.scrollKey, false);
  }

  /**
   * Creates a ScrollSection instance for each element containing the scrollClassY and determines the scroll direction based on
   * if scrollClassX is present.
   */
  setScrollOrder() {
    const scrollSections = document.querySelectorAll(`.${this.scrollClassY}`);

    for (const [index, section] of scrollSections.entries()) {
      const isXScroll = section.classList.contains(this.scrollClassX);
      const scrollSection = new ScrollSection(index, section, isXScroll);

      if (isXScroll) {
        this.xScrollElArray.push(scrollSection);
      }

      this.scrollOrderArray.push(scrollSection);
    }
    this.maxScreenIndex = this.scrollOrderArray.length - 1;
  }

  /**
   * Sets the next screen index based on delta from a given scroll event.
   * Assumes next index will be within range. Only used to track vertical
   * scroll index and is only called within handleVerticalScroll.
   * @param {number} scrollDelta The directional value of a user scroll input.
   * @returns {number} Returns the index for the next section to scroll to.
   */
  setNextIndex(scrollDelta) {
    const prevIndex = this.currentScreenIndex;
    const scrollDirection = scrollDelta < 0 ? -1 : 1;
    const nextIndex = prevIndex + scrollDirection;
    this.currentScreenIndex = nextIndex;
    return nextIndex;
  }

  /**
   * Handles either the call to scroll horizontally or vertically.
   * @param {number} scrollDelta The directional value of a user scroll input.
   */
  executeScroll(scrollDelta) {
    this.isScrolling = true;
    this.onScroll();

    if (this.isXScrollScreenFocused) {
      this.handleHorizontalScroll(scrollDelta);
    } else {
      this.handleVerticalScroll(scrollDelta);
    }
    // Set scrollEvent details
    this.scrollEvent.detail.index = this.currentScreenIndex;
    this.scrollEvent.detail.isXScroll = this.isXScrollScreenFocused;
    window.dispatchEvent(this.scrollEvent);

    this.handleScrollTimeout();
    this.onScrollEnd();
  }

  /**
   * Handles the page scroll to the main site sections. Exits the function if
   * the next index will be out of the screen index range.
   * @param {number} scrollDelta The directional value of a user scroll input.
   */
  handleVerticalScroll(scrollDelta) {
    if (
      (this.currentScreenIndex === 0 && scrollDelta < 0) ||
      (this.currentScreenIndex === this.maxScreenIndex && scrollDelta > 0)
    ) {
      this.isScrolling = false;
      return;
    }
    const nextIndex = this.setNextIndex(scrollDelta);
    const nextSection = this.scrollOrderArray[nextIndex];
    const nextScrollPosition = nextSection.element.getBoundingClientRect().y;
    this.isXScrollScreenFocused = nextSection.isXScroll;
    if (nextSection.isXScroll) {
      this.currentSubScreenIndex = nextSection.currentIndex;
    }
    window.scrollBy({
      top: nextScrollPosition,
      behavior: "smooth",
    });
  }

  /**
   * Handles scrolling along x-axis on relevant sections. Calls handleVerticalScroll if
   * the next index is outside of horizontal scroll range.
   * @param {number} scrollDelta The directional value of a user scroll input.
   */
  handleHorizontalScroll(scrollDelta) {
    const currentSection = this.xScrollElArray.find(
      (element) => element.index === this.currentScreenIndex
    );
    const nextIndex =
      scrollDelta > 0
        ? currentSection.currentIndex + 1
        : currentSection.currentIndex - 1;

    if (nextIndex < 0 || nextIndex > currentSection.maxIndex) {
      this.handleVerticalScroll(scrollDelta);
      this.currentSubScreenIndex = 0;
      return;
    }

    currentSection.clearXScrollOrderClasses();
    currentSection.setXScrollOrderClasses(nextIndex);
    currentSection.currentIndex = nextIndex;
    this.currentSubScreenIndex = nextIndex;
  }

  /**
   * Handles scrolls directly to a given section using its index. Horizontal sections
   * should be indexed as floats with only one decimal place (i.e. 1.2, 2.4). Vertical
   * section indexes will work as either int or float values.
   * @param {number} index The index of a section to scroll to.
   */
  handleDirectScroll(index) {
    this.isScrolling = true;
    this.isXScrollScreenFocused = false;
    const childIndex = ((index % 1) * 10).toFixed(0) * 1; // Convert index decimal to whole number
    const parentIndex = Math.floor(index); // Remove any decimal value from index value

    this.currentScreenIndex = parentIndex;
    this.currentSubScreenIndex = childIndex;

    const targetSection = this.scrollOrderArray[parentIndex];
    const nextScrollPosition = targetSection.element.getBoundingClientRect().y;
    window.scrollBy({
      top: nextScrollPosition,
      behavior: "smooth",
    });
    this.setXScrollSectionsIndexOrder(parentIndex);

    if (targetSection.isXScroll) {
      this.isXScrollScreenFocused = true;
      targetSection.setXScrollOrderClasses(childIndex);
      targetSection.currentIndex = childIndex;
    }

    this.onScrollEnd(index); // Callback function for this section
    this.handleScrollTimeout();
  }

  /**
   * Resets the x scroll sections to either first index or max index depending on
   * the given index param. Used for resetting order when jumping straight to a
   * section, i.e. menu navigation.
   * @param {number} index The index of the next vertical section to scroll to.
   */
  setXScrollSectionsIndexOrder(index) {
    this.xScrollElArray.map((element) => {
      element.clearXScrollOrderClasses();
      if (index < element.index) {
        element.setXScrollOrderClasses(0);
        element.currentIndex = 0;
      } else if (index > element.index) {
        element.setXScrollOrderClasses(element.maxIndex);
        element.currentIndex = element.maxIndex;
      }
    });
  }

  /**
   * Set the time out between allowed scroll requests.
   */
  handleScrollTimeout() {
    const scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollDelay);
  }

  /**
   * Prevents default scrolling from mousewheel and calls executeScroll function.
   */
  handleWheelEvent(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.isScrolling) {
      return;
    }
    if (e.deltaY > 25 || e.deltaY < -25) {
      this.executeScroll(e.deltaY);
    }
  }

  /**
   * Prevent touch scrolling and trigger executeScroll if touch delta is greater than 20.
   * This allows for touches on buttons and prevents unintended scrolling.
   */
  handleTouchEvent(e) {
    if (this.isScrollLocked || this.isScrolling) {
      return;
    }
    e.preventDefault();

    if (e.type === "touchend" && this.touchStartY) {
      const touchEndY = e.changedTouches[0].screenY;
      const touchEndX = e.changedTouches[0].screenX;
      const deltaY = this.touchStartY - touchEndY;
      const deltaX = this.touchStartX - touchEndX;
      const isOverDeltaYThres = deltaY < -50 || deltaY > 50;
      const isOverDeltaXThres = deltaX < -50 || deltaX > 50;

      if (this.isXScrollScreenFocused && isOverDeltaXThres) {
        this.executeScroll(deltaX);
      } else if (isOverDeltaYThres) {
        this.executeScroll(deltaY);
      }
      this.touchStartY = null;
      this.touchStartX = null;
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    const touchesY = e.touches[0].screenY;
    const touchesX = e.touches[0].screenX;
    if (!this.touchStartY) {
      this.touchStartY = touchesY;
      this.touchStartX = touchesX;
      return;
    }
  }

  /**
   * Prevents default scrolling from scroll keys and calls executeScroll function.
   * Key codes are as follows:
   * spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36,
   * left: 37, up: 38, right: 39, down: 40,
   */
  handleScrollKeyEvent(e) {
    if (this.isScrolling) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (
      e.keyCode > 31 &&
      e.keyCode < 41 &&
      document.querySelectorAll("input:focus, textarea:focus").length === 0 //Skip if user is focused on input
    ) {
      e.stopPropagation();
      e.preventDefault();
      const isScrollDown = [32, 34, 39, 40].includes(e.keyCode) ? 100 : -100;
      this.executeScroll(isScrollDown);
    }
  }

  /**
   * Returns a ScrollSection instance by ID
   * @param {string} id The ID of the element to search for
   */
  getSectionByID(id) {
    return this.scrollOrderArray.find((element) => element.id === id);
  }

  getFullCurrentScreenIndex() {
    return `${this.currentScreenIndex}.${this.currentSubScreenIndex}`;
  }

  onScroll() {}
  onScrollEnd() {}
}
