import './style.css'
import Experience from './threeExp/Experience'

const homeExperience = new Experience(document.querySelector('#homeCanvas'))

const body = document.querySelector("body");
const main = document.querySelector("main");
const projectsArray = document.querySelector("#projectsArray");
const vhsOverlay = document.querySelector(".vhsOverlay");
const headerBarMarker = document.querySelector("#headerBar>h1");
const isoField = document.querySelector(".isoField");
const isoTile = document.querySelector(".isoTile");

const worksData = [
  // TEST DATA
  {
    type: "app",
    name: "ace run",
    tech: ["react-native, django, drf, postgresql"],
    description:
      "A complete disc golf tracking experience connected to the PDGA API. Search for and add discs to your bag and track your shot history across thousands of courses.",
    privacy: "private",
    img: "static/Screenshot_1632242642.png",
  },
  {
    type: "combo",
    name: "ts dash",
    tech: ["react, react-native, django, drf, postgresql"],
    description:
      "An unofficial app/site to help Tile Shop employees track daily work tasks and design appointment.",
    privacy: "private",
    comboTypes: [
      {
        type: "site",
        img: "https://cdn.pixabay.com/photo/2017/03/10/10/07/bathroom-2132342_960_720.jpg",
      },
      {
        type: "app",
        img: "https://cdn.pixabay.com/photo/2017/06/22/16/56/fractal-2431532_960_720.jpg",
      },
    ],
    img: null,
  },
  {
    type: "site",
    name: "test site",
    tech: ["react, django-rest-framework, SQLite"],
    description:
      "A test website for making sure that the layouts here are flexible enough and display correctly. Needs to be replaced with an actual project when one is available.",
    img: "https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467_960_720.jpg",
  },
];

const scrollOrderArray = [];

const worksElementArray = [];

const state = {
  currentScreenIndex: 0,
  maxScreenIndex: 0,
  isScrolling: false,
  touchStart: null,
  isXScrollScreenFocused: false,
  currentWorksIndex: 0,
  xScrollElArray: [],
};

const setDocViewHeight = () => {
  const viewHeight = window.innerHeight * 0.01;
  const isoFieldHeight = isoField.scrollHeight;
  const isoTileWidth = isoTile.scrollWidth;
  document.documentElement.style.setProperty("--vh", `${viewHeight}px`);
  document.documentElement.style.setProperty(
    "--isoFieldWidth",
    `${isoFieldHeight}px`
  );
  document.documentElement.style.setProperty(
    "--isoTileWidth",
    `${isoTileWidth}px`
  );
};

const renderProjectData = (data) => {
  /**
   * Renders list of project data into a nodeList of individual project screens which is then
   * inserted into the worksScreen list div node. Auto formats based on the data received.
   */
  const projectElementArray = document.createDocumentFragment();
  for (const [index, project] of data.entries()) {
    const { type, name, tech, description, privacy, img } = project;

    // Create project nodes
    const projectArticle = document.createElement("article");
    const projectDisplayDiv = document.createElement("div");
    const projectText = document.createElement("h2");

    // Create class lists based on the current project
    const projectArticleClasses =
      // Add conditional Display ordering class and Project layout class
      `projectContainer scrollX ${
        index === 0 ? "currentXScroll" : index === 1 ? "nextXScroll" : ""
      } ${type !== "app" ? "colLayout" : ""}`;

    const projectDisplayClasses =
      // Combo type displays an app and site and currentDisplay for box shadows
      `${type} ${type !== "combo" ? "projectDisplay" : ""} ${
        index === 0 ? "currentDisplay" : ""
      }`;

    if (type === "combo") {
      // If type combo then create multiple elements and related img nodes and then append
      // to projectDisplayDiv
      const comboFragment = document.createDocumentFragment();
      for (const [index, comboType] of project.comboTypes.entries()) {
        const comboDiv = document.createElement("div");
        const comboImg = document.createElement("img");
        comboDiv.setAttribute(
          "class",
          `combo${comboType.type[0].toUpperCase()}${comboType.type.slice(1)}
          projectDisplay
          `
        );
        comboImg.setAttribute("src", comboType.img);
        comboDiv.appendChild(comboImg);
        comboFragment.appendChild(comboDiv);
      }
      projectDisplayDiv.appendChild(comboFragment);
    }

    // Set id and class of the article node
    projectArticle.setAttribute("id", `project-${index}`);
    worksElementArray.push(`#project-${index}`);
    projectArticle.setAttribute("class", projectArticleClasses);

    // Set class and add 'combo' type children if needed to the display div
    projectDisplayDiv.setAttribute("class", projectDisplayClasses);
    // projectDisplayDiv.innerHTML = comboDisplayChildren;

    // Add name and project details
    projectText.innerText = `${name.toUpperCase()} - ${description}`;

    // Set img src
    if (type !== "combo") {
      const image = document.createElement("img");
      image.setAttribute("src", img);
      projectDisplayDiv.appendChild(image);
    } else {
    }

    projectArticle.appendChild(projectDisplayDiv);
    projectArticle.appendChild(projectText);
    projectElementArray.appendChild(projectArticle);
  }
  projectsArray.appendChild(projectElementArray);
};

const menu = {
  // Menu object containing all related DOM elements, state, and
  // methods to handle event listener creation and menu toggling.
  elements: {
    overlay: document.querySelector(".overlay"),
    nav: document.querySelector("#retroNav"),
    buttons: {
      toggle: document.querySelector("#menuToggleBtn"),
      close: document.querySelector("#menuCloseBtn"),
      home: document.querySelector("#homeBtn"),
      works: document.querySelector("#worksBtn"),
      about: document.querySelector("#aboutBtn"),
      contact: document.querySelector("#contactBtn"),
    },
  },
  state: {
    isOpen: false,
  },
  createEventListeners: () => {
    menu.elements.buttons.close.addEventListener("click", () => {
      menu.toggleMenu("close");
    });
    menu.elements.buttons.toggle.addEventListener("click", () => {
      menu.toggleMenu("open");
    });
    for (const button of document.querySelectorAll(".menuButton")) {
      button.addEventListener(
        "click",
        (e) => {
          const id = `#${e.currentTarget.dataset.scroll}`;
          const index = scrollOrderArray.indexOf(id);
          if (state.currentScreenIndex !== index) {
            menu.setFocusedButton(index);
            handleDirectScroll(index);
          }
          menu.toggleMenu("close");
        },
        true
      );
    }
  },
  toggleMenu: (action) => {
    if (action === "close") {
      body.classList.remove("overflowHidden");
      menu.elements.overlay.classList.remove("showOverlay");
      menu.elements.nav.classList.remove("showRetroNav");
      menu.state.isOpen = false;
    } else if (action === "open") {
      body.classList.add("overflowHidden");
      menu.elements.overlay.classList.add("showOverlay");
      menu.elements.nav.classList.add("showRetroNav");
      menu.state.isOpen = true;
    }
  },
  setFocusedButton: (index) => {
    const targetSection = document.querySelector(scrollOrderArray[index]);
    const targetBtn = document.querySelector(`#${targetSection.dataset.btn}`);
    document.querySelector(".menuButton.focused")?.classList.remove("focused");
    targetBtn?.classList.add("focused");
  },
};

const infoMenu = {
  elements: {
    menu: document.querySelector("#infoMenu"),
    overlay: document.querySelector(".overlay"),
    header: document.querySelector("#infoMenuHeader"),
    textContainer: document.querySelector("#infoMenuTextContainer > h4"),
  },
  state: {
    isOpen: false,
    isMenuShown: false,
  },
  createEventListeners: () => {
    infoMenu.elements.header.addEventListener("click", infoMenu.toggleMenu);
  },
  toggleMenuDisplay: (state) => {
    if (state === "close") {
      infoMenu.state.isOpen && infoMenu.toggleMenu();
      infoMenu.elements.menu.classList.add("hidden");
    } else {
      infoMenu.elements.menu.classList.remove("hidden");
    }
    infoMenu.state.isMenuShown = !infoMenu.state.isMenuShown;
  },
  toggleMenu: () => {
    if (infoMenu.state.isOpen) {
      infoMenu.elements.menu.classList.remove("open");
    } else {
      infoMenu.elements.textContainer.innerText =
        worksData[state.currentWorksIndex].description;
      infoMenu.elements.menu.classList.add("open");
    }
    infoMenu.state.isOpen = !infoMenu.state.isOpen;
  },
};

const updateHeaderBar = () => {
  /**
   * Updates the display header based on the current screen and adds additional data
   * if the screen is horizontally scrolling.
   */
  const { xScrollElArray, currentScreenIndex } = state;
  const isXScrollSection = xScrollElArray.find(
    (element) => element.index === currentScreenIndex
  );
  const subSectionDisplay = isXScrollSection
    ? isXScrollSection.currentIndex + 1
    : 1;
  const display = `0${currentScreenIndex} : 0${subSectionDisplay}`;
  headerBarMarker.innerText = display;
};

const handleScrollTimeout = () => {
  const scrollTimeout = setTimeout(() => {
    state.isScrolling = false;
  }, 700);
};

const setVerticalScrollOrder = () => {
  /**
   * Sets the vertical scroll order by selecting all elements with the
   * scrollSectionY class. The length of the new array determines the
   * limit of vertical scrolling. Also adds any section with a
   * scrollSectionX class into the state xScrollElArray for horizontal
   * scroll handling.  Immediately calls setHorizontalScroll before exiting.
   */
  const scrollSections = document.querySelectorAll(".scrollSectionY");
  for (const [index, section] of scrollSections.entries()) {
    scrollOrderArray.push(`#${section.id}`);
    // section.style.height = `${height}px`;
    if (section.classList.contains("scrollSectionX")) {
      state.xScrollElArray.push({
        index: index,
        element: section,
        children: [],
        maxIndex: 0,
        currentIndex: 0,
      });
    }
  }
  state.maxScreenIndex = scrollOrderArray.length - 1;
  setHorizontalScrollOrder();
};

const setHorizontalScrollOrder = () => {
  /**
   * Set scroll order of elements in xScrollArray.
   */
  const { xScrollElArray } = state;

  xScrollElArray.map((section) => {
    const xScrollElements = section.element.querySelectorAll(".scrollX");
    section.children = xScrollElements;
    section.maxIndex = xScrollElements.length - 1;
    addXScrollOrderClasses(0, section.maxIndex, section.children);
  });
};

const setNextIndex = (delta) => {
  /**
   * Handles setting the next screen index based on delta from scroll event.
   * Assumes next index will be within range.
   */
  const prevIndex = state.currentScreenIndex;
  const scrollDirection = delta < 0 ? -1 : 1;
  const nextIndex = prevIndex + scrollDirection;
  state.currentScreenIndex = nextIndex;
  return nextIndex;
};

const clearXScrollOrderClasses = (element) => {
  /**
   * Clears the scroll class order for current section and removes currentDisplay class
   * if one is found.
   */
  element.querySelector(".prevXScroll")?.classList.remove("prevXScroll");
  element.querySelector(".currentXScroll")?.classList.remove("currentXScroll");
  element.querySelector(".nextXScroll")?.classList.remove("nextXScroll");

  for (const displayElement of element.querySelectorAll(".currentDisplay")) {
    displayElement.classList.remove("currentDisplay");
  }
};

const addXScrollOrderClasses = (nextIndex, maxIndex, children) => {
  /**
   * Adds the scroll class order for current section and adds currentDisplay class
   * if any display element are found.
   */
  const nextXScroll = nextIndex < maxIndex ? children[nextIndex + 1] : null;
  const prevXScroll = nextIndex > 0 ? children[nextIndex - 1] : null;
  const currentXScroll =
    nextIndex >= 0 && nextIndex <= maxIndex ? children[nextIndex] : null;
  const currentXScrollDisplayElements =
    currentXScroll.querySelectorAll(".projectDisplay");

  nextXScroll && nextXScroll.classList.add("nextXScroll");
  prevXScroll && prevXScroll.classList.add("prevXScroll");
  currentXScroll && currentXScroll.classList.add("currentXScroll");
  for (const displayElement of currentXScrollDisplayElements) {
    displayElement.classList.add("currentDisplay");
  }
};

const executeScroll = (scrollDelta) => {
  /**
   * Passes scrollDelta to either handleHorizontalScroll or handleVerticalScroll
   * based on if isXScrollScreenFocused. This then updates the header bar display
   * before calling the scroll input timeout.
   */
  state.isScrolling = true;

  if (state.isXScrollScreenFocused) {
    handleHorizontalScroll(scrollDelta);
  } else {
    handleVerticalScroll(scrollDelta);
  }
  updateHeaderBar();
  handleScrollTimeout();
};

const handleDirectScroll = (index) => {
  /**
   * Handles scrolls directly to a given index. Used with the menu to jump direct
   * to a section.
   */
  state.isScrolling = true;
  state.currentScreenIndex = index;
  const nextScrollPosition = document
    .querySelector(scrollOrderArray[index])
    .getBoundingClientRect().y;
  window.scrollBy({
    top: nextScrollPosition,
    behavior: "smooth",
  });
  setXScrollSectionsIndexOrder(index);
  updateHeaderBar();
  handleScrollTimeout();
};

const handleVerticalScroll = (scrollDelta) => {
  /**
   * Handles the page scroll to the main site sections. Exits the function if
   * the next index will be out of the screen index range.
   */
  const { currentScreenIndex, maxScreenIndex } = state;

  if (
    (currentScreenIndex === 0 && scrollDelta < 0) ||
    (currentScreenIndex === maxScreenIndex && scrollDelta > 0)
  ) {
    state.isScrolling = false;
    return;
  }
  const nextIndex = setNextIndex(scrollDelta);
  const nextScrollPosition = document
    .querySelector(scrollOrderArray[nextIndex])
    .getBoundingClientRect().y;
  window.scrollBy({
    top: nextScrollPosition,
    behavior: "smooth",
  });
  menu.setFocusedButton(nextIndex);
};

const handleHorizontalScroll = (scrollDelta) => {
  /**
   * Handles vertical scrolling for the works screen. Exits early if the
   * next index is out of works index bounds and calls handleVerticalScroll
   * to complete the appropriate scroll away from the works screen. Creates
   * a psuedo scroll by updating classes and using CSS transitions and style.
   */
  const { xScrollElArray } = state;
  const currentScreen = xScrollElArray.find(
    (element) => element.index === state.currentScreenIndex
  );
  const { maxIndex, currentIndex, index, children } = currentScreen;
  const nextIndex = scrollDelta > 0 ? currentIndex + 1 : currentIndex - 1;

  if (nextIndex < 0 || nextIndex > maxIndex) {
    handleVerticalScroll(scrollDelta);
    return;
  }

  clearXScrollOrderClasses(currentScreen.element);
  addXScrollOrderClasses(nextIndex, maxIndex, children);

  if (infoMenu.state.isOpen) {
    // Close the info menu to allow text updates for next description
    infoMenu.toggleMenu();
  }
  xScrollElArray.map((element) => {
    if (element.index === index) {
      element.currentIndex = nextIndex;
    }
  });
};

const setXScrollSectionsIndexOrder = (index) => {
  /**
   * Resets the x scroll sections to either first index or max index depending on
   * the given index param. Used for resetting order when jumping straight to a
   * section, i.e. menu navigation.
   */
  state.xScrollElArray.map((element) => {
    const { children, maxIndex, currentIndex } = element;
    clearXScrollOrderClasses(element.element);
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
};

const handleWheelEvent = (e) => {
  /**
   * Prevents default scrolling from mousewheel and calls executeScroll function.
   */
  e.stopPropagation();
  e.preventDefault();
  if (state.isScrolling || menu.state.isOpen) {
    return;
  }
  if (e.deltaY > 25 || e.deltaY < -25) {
    executeScroll(e.deltaY);
  }
};

const handleTouchEvent = (e) => {
  /**
   * Prevent touch scrolling and trigger executeScroll if touch delta is greater than 20.
   * This allows for touches on buttons and prevents unintended scrolling.
   */
  if (menu.state.isOpen || state.isScrolling) {
    return;
  } else if (e.type === "touchstart") {
    state.touchStart = e.changedTouches[0].screenY;
    return;
  } else if (e.type === "touchend" && state.touchStart) {
    const touchEnd = e.changedTouches[0].screenY;
    const deltaY = state.touchStart - touchEnd;
    if (deltaY < -20 || deltaY > 20) {
      executeScroll(deltaY);
    }
    state.touchStart = null;
  }
};

const handleTouchMove = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
};

const handleScrollKeyEvent = (e) => {
  /**
   * Prevents default scrolling from scroll keys and calls executeScroll function.
   * Key codes are as follows:
   * spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36,
   * left: 37, up: 38, right: 39, down: 40,
   */
  if (state.isScrolling) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  if (
    e.keyCode > 31 &&
    e.keyCode < 41 &&
    !menu.state.isOpen &&
    document.querySelectorAll("input:focus").length === 0 //Skip if user is focused on input
  ) {
    e.stopPropagation();
    e.preventDefault();
    const isScrollDown = [32, 34, 39, 40].includes(e.keyCode) ? 100 : -100;
    executeScroll(isScrollDown);
  }
};

const createScrollEventListeners = () => {
  window.addEventListener("wheel", handleWheelEvent, { passive: false });
  window.addEventListener("touchstart", handleTouchEvent, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEvent, { passive: false });
  window.addEventListener("keydown", handleScrollKeyEvent, false);
};

const homeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const scrollTitle = entry.target.querySelector("#homeScreen>p");
    const nameTitle = entry.target.querySelector("#homeScreen > div");

    if (entry.isIntersecting) {
      scrollTitle.classList.add("scrollTitleAnimation");
      nameTitle.classList.add("animation");
      return;
    }
    scrollTitle.classList.remove("scrollTitleAnimation");
    nameTitle.classList.remove("animation");
  });
});

const scrollXObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        infoMenu.toggleMenuDisplay("open");
        state.isXScrollScreenFocused = true;
        return;
      }
      infoMenu.toggleMenuDisplay("close");
      state.isXScrollScreenFocused = false;
    });
  },
  { threshold: 0.8 }
);

const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const polaroidFrame = entry.target.querySelector(".polaroidFrame");
    if (entry.isIntersecting) {
      polaroidFrame.classList.remove("polaroidScale");
      return;
    }
    polaroidFrame.classList.add("polaroidScale");
  });
});

const setScrollXObservations = () => {
  for (const element of state.xScrollElArray) {
    scrollXObserver.observe(element.element);
  }
};

setDocViewHeight();
createScrollEventListeners();
homeObserver.observe(document.querySelector("#homeScreen"));
aboutObserver.observe(document.querySelector("#aboutScreen"));

window.addEventListener("resize", () => {
  setDocViewHeight();
  handleDirectScroll(state.currentScreenIndex);
});

window.addEventListener("DOMContentLoaded", () => {
  renderProjectData(worksData);
  setVerticalScrollOrder();
  setScrollXObservations();
  menu.createEventListeners();
  infoMenu.createEventListeners();
  handleDirectScroll(0);
});