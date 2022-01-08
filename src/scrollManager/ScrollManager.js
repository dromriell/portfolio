import ProjectScreen from "./ProjectScreen";
import ScrollSection from "./ScrollSection";

export default class ScrollManager {
  constructor(projectsNode, projectData, scrollDelay = 700) {
    this.scrollDelay = scrollDelay;
    this.isScrolling = false;
    this.isXScrollScreenFocused = false;
    this.currentScreenIndex = 0;
    this.maxScreenIndex = 0;
    this.scrollOrderArray = [];
    this.worksElementArray = [];
    this.xScrollElArray = [];

    this.projectsNode = projectsNode;
    this.projectData = projectData;
    this.projectElementArray = document.createDocumentFragment();

    this.onScroll = () => {};

    this.renderProjectData();
    this.setVerticalScrollOrder();

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

  renderProjectData() {
    /**
     * Renders list of project data into a nodeList of individual project screens which is then
     * inserted into the worksScreen list div node. Auto formats based on the data received.
     */
    for (const [index, project] of this.projectData.entries()) {
      const projectElement = new ProjectScreen(index, project);

      this.worksElementArray.push(`#project-${index}`);
      this.projectElementArray.appendChild(projectElement.nodes.article);
      this.projectsNode.appendChild(this.projectElementArray);
    }
  }

  setVerticalScrollOrder() {
    /**
     * Sets the vertical scroll order by selecting all elements with the
     * scrollSectionY class. The length of the new array determines the
     * limit of vertical scrolling. Also adds any section with a
     * scrollSectionX class into the state xScrollElArray for horizontal
     * scroll handling.  Immediately calls setHorizontalScroll before exiting.
     */
    const scrollSections = document.querySelectorAll(".scrollSectionY");

    for (const [index, section] of scrollSections.entries()) {
      const isXScroll = section.classList.contains("scrollSectionX");
      const scrollSection = new ScrollSection(index, section, isXScroll);

      if (isXScroll) {
        this.xScrollElArray.push(scrollSection);
      }

      this.scrollOrderArray.push(scrollSection);
    }
    this.maxScreenIndex = this.scrollOrderArray.length - 1;
  }

  setNextIndex(delta) {
    /**
     * Handles setting the next screen index based on delta from scroll event.
     * Assumes next index will be within range.
     */
    const prevIndex = this.currentScreenIndex;
    const scrollDirection = delta < 0 ? -1 : 1;
    const nextIndex = prevIndex + scrollDirection;
    this.currentScreenIndex = nextIndex;
    return nextIndex;
  }

  executeScroll(scrollDelta) {
    /**
     * Passes scrollDelta to either handleHorizontalScroll or handleVerticalScroll
     * based on if isXScrollScreenFocused. This then updates the header bar display
     * before calling the scroll input timeout.
     */
    this.isScrolling = true;

    if (this.isXScrollScreenFocused) {
      this.handleHorizontalScroll(scrollDelta);
    } else {
      this.handleVerticalScroll(scrollDelta);
    }
    this.onScroll();
    this.handleScrollTimeout();
  }

  handleVerticalScroll(scrollDelta) {
    /**
     * Handles the page scroll to the main site sections. Exits the function if
     * the next index will be out of the screen index range.
     */

    if (
      (this.currentScreenIndex === 0 && scrollDelta < 0) ||
      (this.currentScreenIndex === this.maxScreenIndex && scrollDelta > 0)
    ) {
      this.isScrolling = false;
      return;
    }
    const nextIndex = this.setNextIndex(scrollDelta);
    const nextScrollPosition =
      this.scrollOrderArray[nextIndex].element.getBoundingClientRect().y;
    window.scrollBy({
      top: nextScrollPosition,
      behavior: "smooth",
    });
    // menu.setFocusedButton(nextIndex);
  }

  handleHorizontalScroll(scrollDelta) {
    /**
     * Handles vertical scrolling for the works screen. Exits early if the
     * next index is out of works index bounds and calls handleVerticalScroll
     * to complete the appropriate scroll away from the works screen. Creates
     * a psuedo scroll by updating classes and using CSS transitions and style.
     */
    const currentSection = this.xScrollElArray.find(
      (element) => element.index === this.currentScreenIndex
    );
    const nextIndex =
      scrollDelta > 0
        ? currentSection.currentIndex + 1
        : currentSection.currentIndex - 1;

    if (nextIndex < 0 || nextIndex > currentSection.maxIndex) {
      this.handleVerticalScroll(scrollDelta);
      return;
    }

    currentSection.clearXScrollOrderClasses();
    currentSection.setXScrollOrderClasses(nextIndex);
    currentSection.currentIndex = nextIndex;

    // if (infoMenu.state.isOpen) {
    //   // Close the info menu to allow text updates for next description
    //   infoMenu.toggleMenu();
    // }
  }

  handleDirectScroll(index) {
    /**
     * Handles scrolls directly to a given index. Used with the menu to jump direct
     * to a section.
     */
    this.isScrolling = true;
    this.currentScreenIndex = index;
    const nextScrollPosition =
      this.scrollOrderArray[index].element.getBoundingClientRect().y;
    window.scrollBy({
      top: nextScrollPosition,
      behavior: "smooth",
    });
    this.setXScrollSectionsIndexOrder(index);
    this.onScroll();
    this.handleScrollTimeout();
  }

  setXScrollSectionsIndexOrder(index) {
    /**
     * Resets the x scroll sections to either first index or max index depending on
     * the given index param. Used for resetting order when jumping straight to a
     * section, i.e. menu navigation.
     */
    this.xScrollElArray.map((element) => {
      const { children, maxIndex, currentIndex } = element;
      element.clearXScrollOrderClasses();
      let currentXScrollElement = undefined;
      if (index < element.index) {
        children[0].classList.add("currentXScroll");
        children[1].classList.add("nextXScroll");
        element.currentIndex = 0;
        currentXScrollElement = children[0];
      } else {
        children[maxIndex - 1].classList.add("prevXScroll");
        children[maxIndex].classList.add("currentXScroll");
        element.currentIndex = maxIndex;
        currentXScrollElement = children[maxIndex];
      }
      const currentXScrollDisplayElements =
        currentXScrollElement.querySelectorAll(".projectDisplay");
      for (const displayElement of currentXScrollDisplayElements) {
        displayElement.classList.add("currentDisplay");
      }
    });
  }

  handleScrollTimeout() {
    /**
     *
     */
    const scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollDelay);
  }

  handleWheelEvent(e) {
    /**
     * Prevents default scrolling from mousewheel and calls executeScroll function.
     */
    e.stopPropagation();
    e.preventDefault();
    // if (this.isScrolling || this.menu.state.isOpen) {
    if (this.isScrolling) {
      return;
    }
    if (e.deltaY > 25 || e.deltaY < -25) {
      this.executeScroll(e.deltaY);
    }
  }

  handleTouchEvent(e) {
    /**
     * Prevent touch scrolling and trigger executeScroll if touch delta is greater than 20.
     * This allows for touches on buttons and prevents unintended scrolling.
     */
    if (this.state.isOpen || this.isScrolling) {
      return;
    } else if (e.type === "touchstart") {
      this.touchStart = e.changedTouches[0].screenY;
      return;
    } else if (e.type === "touchend" && this.touchStart) {
      const touchEnd = e.changedTouches[0].screenY;
      const deltaY = this.touchStart - touchEnd;
      if (deltaY < -20 || deltaY > 20) {
        this.executeScroll(deltaY);
      }
      this.touchStart = null;
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  handleScrollKeyEvent(e) {
    /**
     * Prevents default scrolling from scroll keys and calls executeScroll function.
     * Key codes are as follows:
     * spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36,
     * left: 37, up: 38, right: 39, down: 40,
     */
    if (this.isScrolling) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (
      e.keyCode > 31 &&
      e.keyCode < 41 &&
      !this.menu.state.isOpen &&
      document.querySelectorAll("input:focus").length === 0 //Skip if user is focused on input
    ) {
      e.stopPropagation();
      e.preventDefault();
      const isScrollDown = [32, 34, 39, 40].includes(e.keyCode) ? 100 : -100;
      this.executeScroll(isScrollDown);
    }
  }
}
