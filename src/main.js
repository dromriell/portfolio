import ScrollManager from "./scrollManager/ScrollManager";
import "./style.css";
import Experience from "./threeExp/Experience";
import HeaderBar from "./utils/HeaderBar";
import Menu from "./utils/Menu";
import ProjectScreen from "./scrollManager/ProjectScreen";
import { worksData } from "./testData";

/**
 * 3D Scenes
 */
const homeExperience = new Experience(document.querySelector("#homeCanvas"));

/**
 * Navigation
 */
const scrollManager = new ScrollManager();
const navMenu = new Menu(scrollManager);
const headerBar = new HeaderBar(scrollManager);

scrollManager.onScroll = () => {
  headerBar.updateHeaderBar();
};

/**
 * Projects
 */
const renderScrollXChildren = () => {
  /**
   * Renders data into a nodeList of individual xScroll screens which is then
   * inserted into the parent instance and element. Auto formats based on the data received.
   */
  const scrollXSection = scrollManager.scrollOrderArray.find(
    (element) => element.id === "mainScreen"
  );
  const projectElementArray = document.createDocumentFragment();

  for (const [index, project] of worksData.entries()) {
    const projectElement = new ProjectScreen(index, project);

    projectElementArray.appendChild(projectElement.nodes.article);
    scrollXSection.element.appendChild(projectElementArray);
    scrollXSection.children.push(projectElement);
  }
  scrollXSection.updateChildren();
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

homeObserver.observe(document.querySelector("#homeScreen"));
aboutObserver.observe(document.querySelector("#aboutScreen"));

/**
 * Event Listeners
 */
window.addEventListener("resize", () => {
  scrollManager.handleDirectScroll(scrollManager.currentScreenIndex);
});

window.addEventListener("DOMContentLoaded", () => {
  scrollManager.handleDirectScroll(0);
});

window.addEventListener("scrollEvent", console.log("SCROLL"));
