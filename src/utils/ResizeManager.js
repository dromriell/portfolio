export default class ResizeManager {
  constructor() {
    this.innerDimensions = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    this.outerDimensions = {
      height: window.outerHeight,
      width: window.outerWidth,
    };
  }

  setViewHeight(init = false) {
    const hasInnerWidthChanged =
      this.innerDimensions.width !== window.innerWidth;
    if (!init && !hasInnerWidthChanged) {
      return;
    }

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  checkOuterDimensionChange() {
    const { height: outerHeight, width: outerWidth } = this.outerDimensions;
    if (
      outerHeight !== window.outerHeight ||
      outerWidth !== window.outerWidth
    ) {
      this.outerDimensions = {
        height: window.outerHeight,
        width: window.outerWidth,
      };
      return true;
    }
    return false;
  }
}
