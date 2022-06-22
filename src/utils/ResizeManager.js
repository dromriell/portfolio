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
    const hasInnerHeightGrown =
      this.innerDimensions.height < window.innerHeight;
    const hasOuterDimensionChanged = this.checkOuterDimensionChange();

    if (
      init ||
      hasInnerWidthChanged ||
      hasInnerHeightGrown ||
      hasOuterDimensionChanged
    ) {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      this.innerDimensions = {
        height: window.innerHeight,
        width: window.innerWidth,
      };
    }
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
