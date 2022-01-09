/**
 * Element displayed at top of page that displays section and menu toggle button.
 * @param {Object} scrollManager ScrollManager instance.
 */
export default class HeaderBar {
  constructor(scrollManager) {
    this.headerBar = document.querySelector("#headerBar");
    this.headerBarMarker = this.headerBar.querySelector("h1");
    this.scrollManager = scrollManager;
  }

  /**
   * Updates the display header based on the current screen and adds additional data
   * if the screen is horizontally scrolling.
   */
  updateHeaderBar() {
    const isXScrollSection = this.scrollManager.xScrollElArray.find(
      (element) => element.index === this.scrollManager.currentScreenIndex
    );
    const subSectionDisplay = isXScrollSection
      ? isXScrollSection.currentIndex + 1
      : 1;
    const display = `0${this.scrollManager.currentScreenIndex} : 0${subSectionDisplay}`;
    this.headerBarMarker.innerText = display;
  }
}
