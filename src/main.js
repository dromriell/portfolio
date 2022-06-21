import smoothscroll from "smoothscroll-polyfill";

import ScrollManager from "./scrollManager/ScrollManager";
import ResizeManager from "./utils/ResizeManager";
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
import TextCarousel from "./components/TextCarousel";

import { fetchScreenData } from "./utils/apiActions";
import { staticUrls } from "./utils/urls";
import StatusBadge from "./components/StatusBadge";
import NoteForm from "./components/NoteForm";

/**
 * Set screen height
 */
const resizeManager = new ResizeManager();
resizeManager.setViewHeight();

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
  designCanvas,
  bathroomSources,
  BathroomWorld,
  BathroomCamera
);

/**
 * Navigation
 */
const scrollManager = new ScrollManager();
const headerBar = new HeaderBar(scrollManager, false);
const parallaxManager = new ParallaxManager(
  scrollManager.getSectionByID("mainScreen").element
);

scrollManager.onScrollEnd = () => {
  headerBar.updateMarker();
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
  try {
    screenData = await fetchScreenData();
  } catch (error) {
    window.alert(error);
    return;
  }
  screenData.forEach((data, index) => {
    // Init related components
    const sectionElement = new XScrollScreen(index, data);
    sectionElement.setAttribute(
      "data-btn",
      `${scrollXSection.index}.${sectionElement.index}`
    );
    const sectionHeader = new AnimatedHeader(sectionElement.name, {
      allCaps: true,
    });
    const parallaxItem = new ParallaxItem(data, index);

    if (data.name === "About") {
      parallaxItem.img.src = staticUrls.aboutPic;
      const aboutInfo = new AboutInfo(data);
      sectionElement.nodes.displayDiv.appendChild(aboutInfo.element);
    } else if (data.name === "Develope") {
      parallaxItem.img.src = staticUrls.developePic;
      const developeInfo = new DevelopeInfo(data);
      sectionElement.nodes.displayDiv.appendChild(developeInfo.element);
    } else if (data.name === "Design") {
      sectionElement.nodes.displayDiv.appendChild(designCanvas);
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

  parallaxManager.setBackground();
  scrollXSection.updateChildren();
  scrollXSection.onScroll = (index) => parallaxManager.setIndex(index);
  headerBar.setHeaderBarButtons(); // Update header bar to add new section buttons
};
renderScrollSections();

/**
 * Contact Header Animation
 */
const contactHeaderElement = document.querySelector(".contactHeader>h3");
const testWords = [
  "THE WEATHER",
  "THREEJS",
  "PYTHON",
  "JAVASCRIPT",
  "REACT",
  "REACT NATIVE",
  "DATA",
  "JSON",
  "CSS",
  "FOOTBALL",
  "DISC GOLF",
  "TILE",
  "COMPONENTS",
];
const textCarousel = new TextCarousel(testWords, contactHeaderElement);

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
          console.log("TEST TEST TEST");
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
const handleHomeExperienceReady = (e) => {
  if (e.detail.type === "tile") {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      orientationDialog.classList.add("show");
      return;
    } else {
      removeLoadingOverlay();
    }
  }
  document.removeEventListener("ready", handleHomeExperienceReady);
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

document.addEventListener("ready", handleHomeExperienceReady);
smoothscroll.polyfill();
