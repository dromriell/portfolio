import smoothscroll from "smoothscroll-polyfill";

import ScrollManager from "./scrollManager/ScrollManager";
import ResizeManager from "./utils/ResizeManager";
import TabManager from "./utils/TabManager";
import Experience from "./threeExp/Experience";
import TilesWorld from "./threeExp/landingScreen/TilesWorld";
import TilesCamera from "./threeExp/landingScreen/TilesCamera";
import BathroomWorld from "./threeExp/bathroom/BathroomWorld";
import BathroomCamera from "./threeExp/bathroom/BathroomCamera";
import { tileSources, bathroomSources } from "./threeExp/sources";

import HeaderBar from "./components/HeaderBar";
import AnimatedHeader from "./components/AnimatedHeader";
import XScrollScreen from "./scrollManager/XScrollScreen";
import ParallaxItem from "./scrollManager/ParallaxItem";
import ParallaxManager from "./scrollManager/ParallaxManager";
import { AboutInfo, DevelopeInfo } from "./components/SectionInfo";

import { fetchScreenData } from "./utils/apiActions";
import { staticUrls } from "./utils/urls";
import StatusBadge from "./components/StatusBadge";
import NoteForm from "./components/NoteForm";

const apiLoadEvent = new Event("apiLoaded");

/**
 * Set screen height
 */
const resizeManager = new ResizeManager();
resizeManager.setViewHeight(true);

/**
 * 3D Scenes
 */
const homeExperience = new Experience(
  document.querySelector("#homeCanvas"),
  tileSources,
  TilesWorld,
  TilesCamera
);
const designCanvas = document.createElement("canvas");
const designExp = new Experience(
  document.querySelector("#bathroomCanvas"),
  bathroomSources,
  BathroomWorld,
  BathroomCamera
);

/**
 * Navigation
 */
const scrollManager = new ScrollManager();
const tabManager = new TabManager(scrollManager);
const headerBar = new HeaderBar(scrollManager, false);
const parallaxManager = new ParallaxManager(
  scrollManager.getSectionByID("mainScreen").element
);

scrollManager.onScrollEnd = (index) => {
  headerBar.updateMarker();
  headerBar.highlightCurrentScreen(index);
};

headerBar.onMenuBtnPress = (index) => {
  tabManager.setDocumentTabIndex(index);
};

const setContactScreenTabIndex = (tabIndex) => {
  const contactScreen = document.querySelector("#contactScreen");
  const inputElements = contactScreen.querySelectorAll(
    "input, textarea, button"
  );
  contactScreen.setAttribute("tabindex", tabIndex);
  inputElements.forEach((element) =>
    element.setAttribute("tabindex", tabIndex)
  );
};

/**
 * Scroll Sections
 */

const renderScrollSections = async () => {
  // Renders data into a nodeList of individual xScroll screens
  // which is then inserted into the parent instance and element.
  // Auto formats based on the data received.
  const scrollXSection = scrollManager.getSectionByID("mainScreen");
  let screenData;

  // Start index at 2 to account for home and menu index
  let tabIndex = 2;

  try {
    screenData = await fetchScreenData();
  } catch (error) {
    window.alert(error);
    return;
  }
  document.dispatchEvent(apiLoadEvent);
  screenData.forEach((data, index) => {
    // Init related components
    tabIndex = index + 2;
    const sectionElement = new XScrollScreen(index, data);
    sectionElement.setAttribute(
      "data-btn",
      `${scrollXSection.index}.${sectionElement.index}`
    );

    const sectionHeader = new AnimatedHeader(sectionElement.name, {
      allCaps: true,
    });
    const parallaxItem = new ParallaxItem(data, index);

    sectionElement.setAttribute("tabindex", tabIndex);

    if (data.name === "About") {
      const aboutInfo = new AboutInfo(data);
      sectionElement.nodes.displayDiv.appendChild(aboutInfo.element);
    } else if (data.name === "Develope") {
      parallaxItem.img.src = staticUrls.developePic;
      const developeInfo = new DevelopeInfo(data);
      sectionElement.nodes.displayDiv.appendChild(developeInfo.element);
    }

    // Set callbacks for scroll events
    sectionElement.onScroll = () => {
      sectionHeader.animate();
    };
    sectionElement.onScrollExit = () => {
      sectionHeader.animate(false);
    };

    // Add children to parent components
    sectionHeader.appendToTarget(sectionElement.nodes.header);
    parallaxManager.children.push(parallaxItem);
    scrollXSection.children.push(sectionElement);
  });

  setContactScreenTabIndex(tabIndex + 1);
  parallaxManager.setBackground();
  scrollXSection.updateChildren();
  scrollXSection.onScroll = (index) => parallaxManager.setIndex(index);
  headerBar.setHeaderBarButtons(); // Update header bar to add new section buttons
  tabManager.setCurrentTabNodeList();
};
renderScrollSections();

/**
 * Update Badge
 */
const badge = new StatusBadge("Update");

/**
 * Observers
 */
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

homeObserver.observe(document.querySelector("#homeScreen"));

/**
 * Form
 */
const form = document.querySelector("#contactForm");
const notesForm = new NoteForm(form);
notesForm.onPostSuccess = () => {
  badge.setMessage(`Thanks for the message!`);
  badge.alert();
};
notesForm.onPostError = (error) => {
  badge.setMessage(error);
  badge.alert(true);
};

/**
 * Orientation Permission
 */
const orientationDialog = document.querySelector("#orientationDialog");
const allowOrientationBTN = document.querySelector("#allowOrientationBTN");
const denyOrientationBTN = document.querySelector("#denyOrientationBTN");

const removeOrientationPermissionDialog = () => {
  document.removeEventListener("touchend", handleOrientationPermissionToggle);
  document.removeEventListener("touchend", handleOrientationPermissionDenied);
  orientationDialog.remove();
};

const handleOrientationPermissionToggle = () => {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState == "granted") {
          alert("DeviceOrientationEvent Granted");
          removeLoadingOverlay();
        } else {
          alert("PERM Not Granted", permissionState);
        }
      })
      .catch(console.error);
  }
  removeOrientationPermissionDialog();
};

const handleOrientationPermissionDenied = () => {
  removeLoadingOverlay();
  removeOrientationPermissionDialog();
};

allowOrientationBTN.addEventListener(
  "touchend",
  handleOrientationPermissionToggle
);
denyOrientationBTN.addEventListener(
  "touchend",
  handleOrientationPermissionDenied
);

/**
 * Event Listeners
 */

const handleAPILoaded = (e) => {
  resizeManager.setViewHeight(true);
  headerBar.updateMarker();
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    orientationDialog.classList.add("show");
    return;
  } else {
    removeLoadingOverlay();
  }
};

/**
 * Loading Handling
 */
const removeLoadingOverlay = () => {
  document.querySelector(".loadingOverlay").classList.remove("show");
};

window.addEventListener("resize", () => {
  if (!scrollManager.isScrolling) {
    resizeManager.setViewHeight();
  }
  scrollManager.handleDirectScroll(scrollManager.getFullCurrentScreenIndex());
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    const activeElement = document.activeElement;
    const elementIndex = activeElement.getAttribute("data-scroll");
    if (elementIndex) {
      e.preventDefault();
      scrollManager.handleDirectScroll(elementIndex);
      tabManager.setDocumentTabIndex(elementIndex);
    }
  } else if (e.keyCode === 9) {
    if (e.shiftKey) {
      tabManager.handleShiftTabEvent(e);
    } else {
      tabManager.handleTabEvent(e);
    }
  }
});

document.addEventListener("apiLoaded", handleAPILoaded);
smoothscroll.polyfill();
