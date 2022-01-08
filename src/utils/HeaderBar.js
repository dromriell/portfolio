export default class HeaderBar {
  constructor(scrollManager) {
    this.headerBar = document.querySelector("#headerBar");
    this.headerBarMarker = this.headerBar.querySelector("h1");
    this.scrollManager = scrollManager;
  }

  updateHeaderBar() {
    /**
     * Updates the display header based on the current screen and adds additional data
     * if the screen is horizontally scrolling.
     */
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
