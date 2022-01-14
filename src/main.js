import ScrollManager from "./scrollManager/ScrollManager";
import "./style.css";
import Experience from "./threeExp/Experience";
import HeaderBar from "./components/HeaderBar";
import ContentTable from "./components/ContentTable";
import AnimatedHeader from "./components/AnimatedHeader";
import XScrollScreen from "./scrollManager/XScrollScreen";

import ParallaxItem from "./scrollManager/ParallaxItem";
import ParallaxManager from "./scrollManager/ParallaxManager";
import { worksData } from "./testData";

/**
 * 3D Scenes
 */
const homeExperience = new Experience(document.querySelector("#homeCanvas"));

/**
 * Navigation
 */
const scrollManager = new ScrollManager();
const headerBar = new HeaderBar(scrollManager, false);
const contentTable = new ContentTable(document.querySelector("#mainScreen"));
const parallaxManager = new ParallaxManager(
  scrollManager.getSectionByID("mainScreen").element
);

scrollManager.onScroll = () => {
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

    // Set callbacks for scroll events
    sectionElement.onScroll = () => {
      sectionHeader.animate();
    };
    sectionElement.onScrollExit = () => {
      sectionHeader.animate(false);
    };

    // Add children to parent components
    contentTable.addChild(sectionHeader);
    parallaxManager.children.push(parallaxItem);
    scrollXSection.children.push(sectionElement);
  }

  parallaxManager.setBackground();
  scrollXSection.updateChildren();
  scrollXSection.onScroll = (index) => parallaxManager.setIndex(index);
  headerBar.setHeaderBarButtons(); // Update header bar to add new section buttons
};
renderScrollXChildren();
contentTable.create();

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
