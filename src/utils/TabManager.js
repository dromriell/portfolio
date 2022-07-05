export default class TabManager {
  constructor(scrollmanager) {
    this.scrollManager = scrollmanager;
    this.activeDocumentTabIndex = 1;
    this.activeElementTabIndex = 0;
    this.currentTabNodeList = document.querySelectorAll(`[tabindex="${1}"]`);
    this.menuTabMaxIndex = this.currentTabNodeList.length - 1;
    this.shiftTabMenuIndex = 0;
    this.nextElement = undefined;
    this.isTabEnd = false;
    this.activeElement = undefined;

    this.setCurrentTabNodeList;
  }

  setDocumentTabIndex(index) {
    const parentElement = document.querySelector(`[data-btn="${index}"]`);
    const parentTabIndex = parseInt(parentElement.getAttribute("tabindex"));
    this.activeElementTabIndex = 0;
    this.activeDocumentTabIndex = parentTabIndex;
    this.setCurrentTabNodeList(parentTabIndex);
  }

  setCurrentTabNodeList(docTabIndex = this.activeDocumentTabIndex) {
    this.currentTabNodeList = document.querySelectorAll(
      `[tabindex="${docTabIndex}"]`
    );
  }

  handleShiftTabEvent(event) {
    this.activeElement = document.activeElement;
    if (this.activeDocumentTabIndex === 0 && this.activeElementTabIndex === 0) {
    }
    if (this.activeElementTabIndex === 0) {
      this.activeDocumentTabIndex = this.activeDocumentTabIndex - 1;
      this.setCurrentTabNodeList();
      this.activeElementTabIndex = this.currentTabNodeList.length - 1;
    } else {
      this.activeElementTabIndex = this.activeElementTabIndex - 1;
    }
    this.nextElement = this.currentTabNodeList[this.activeElementTabIndex];
    const parentElementIndex = this.nextElement
      ?.closest("article")
      ?.getAttribute("data-btn");
    const nextElementNodeName = this.nextElement
      ? this.nextElement.nodeName
      : "DEFAULT SHIFT TAB";

    this.handleElementFocus(event, nextElementNodeName, {
      isShiftTab: true,
      parentElementIndex: parentElementIndex,
    });
  }

  handleTabEvent(event) {
    this.activeElement = document.activeElement;
    if (this.currentTabNodeList.length - 1 === this.activeElementTabIndex) {
      this.activeDocumentTabIndex = this.activeDocumentTabIndex + 1;
      this.activeElementTabIndex = 0;
      this.setCurrentTabNodeList();
    } else {
      this.activeElementTabIndex = this.activeElementTabIndex + 1;
    }
    this.nextElement = this.currentTabNodeList[this.activeElementTabIndex];
    const nextElementNodeName = this.nextElement
      ? this.nextElement.nodeName
      : "DEFAULT TAB";

    this.handleElementFocus(event, nextElementNodeName);
  }

  handleElementFocus(event, nodeName, options = {}) {
    const { isShiftTab, parentElementIndex } = options;
    const currentFullIndex = this.scrollManager.getFullCurrentScreenIndex();
    nodeName !== "DEFAULT TAB" && event.preventDefault();
    switch (nodeName) {
      case "BODY":
        isShiftTab && this.scrollManager.handleDirectScroll(0.0);
        this.nextElement.focus();
        break;
      case "SECTION":
        this.scrollManager.handleDirectScroll(
          this.nextElement.getAttribute("data-btn")
        );
        this.activeElement.blur();
        break;
      case "ARTICLE":
        this.scrollManager.handleDirectScroll(
          this.nextElement.getAttribute("data-btn")
        );
        this.activeElement.blur();
        break;
      case "LI":
        this.nextElement.focus();
        break;
      case "VIDEO":
        if (isShiftTab && parentElementIndex !== currentFullIndex) {
          this.scrollManager.handleDirectScroll(parentElementIndex);
        }
        isShiftTab && this.nextElement.focus();
        break;
      case "A":
        if (isShiftTab && parentElementIndex !== currentFullIndex) {
          this.scrollManager.handleDirectScroll(parentElementIndex);
        }
        this.nextElement.focus();
        break;
      case "INPUT":
        this.nextElement.focus();
        break;
      case "TEXTAREA":
        this.nextElement.focus();
        break;
      case "BUTTON":
        this.nextElement.focus();
        break;
      case "DEFAULT TAB":
        if (this.isTabEnd) {
          this.activeElement.blur();
          this.activeDocumentTabIndex = 0;
          this.activeElementTabIndex = 0;
          this.setCurrentTabNodeList();
          this.isTabEnd = false;
          break;
        }
        this.isTabEnd = true;
        break;
      case "DEFAULT SHIFT TAB":
        if (this.isTabEnd) {
          this.activeDocumentTabIndex = 7;
          this.activeElementTabIndex = 0;
          this.scrollManager.handleDirectScroll("2.0");
          this.isTabEnd = false;
          break;
        }
        this.isTabEnd = true;
        break;
      default:
        console.log("ERROR FINDING NODE NAME");
    }
  }
}
