import ScrollManager from "./scrollManager/ScrollManager";
import "./style.css";
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
import { worksData } from "./testData";

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
 * Horizontal Scroll Sections
 */
const renderScrollXChildren = () => {
  // Renders data into a nodeList of individual xScroll screens
  // which is then inserted into the parent instance and element.
  // Auto formats based on the data received.

  const scrollXSection = scrollManager.getSectionByID("mainScreen");

  for (const [index, data] of worksData.entries()) {
    // Init related components
    const sectionElement = new XScrollScreen(index, data);
    sectionElement.setAttribute(
      "data-btn",
      `${scrollXSection.index}.${sectionElement.index}`
    );
    const sectionHeader = new AnimatedHeader(sectionElement.name, {
      allCaps: true,
    });
    const parallaxItem = new ParallaxItem(sectionElement.img, index);

    if (data.name === "About") {
      const aboutInfo = new AboutInfo(data);
      sectionElement.nodes.displayDiv.appendChild(aboutInfo.element);
    } else if (data.name === "Develope") {
      const developeInfo = new DevelopeInfo(data);
      sectionElement.nodes.displayDiv.appendChild(developeInfo.element);
    } else if (data.name === "& Design") {
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
  }

  parallaxManager.setBackground();
  scrollXSection.updateChildren();
  scrollXSection.onScroll = (index) => parallaxManager.setIndex(index);
  headerBar.setHeaderBarButtons(); // Update header bar to add new section buttons
};
renderScrollXChildren();

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
 * Event Listeners
 */
window.addEventListener("resize", () => {
  scrollManager.handleDirectScroll(scrollManager.currentScreenIndex);
});

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM LOADED");
});
