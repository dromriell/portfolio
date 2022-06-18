export default class ParallaxItem {
  constructor(data, index) {
    this.imgSrc = data.bg_img_source;
    this.backgroundColor = data.background_color;
    this.element = document.createElement("div");
    this.img = document.createElement("img");
    this.isAppScreen = data.is_app_screen;

    this.img.src = this.imgSrc;
    if (this.backgroundColor) {
      this.element.style.background = this.backgroundColor;
    }

    if (this.isAppScreen) {
      const backgroundFilterNode = document.createElement("div");
      backgroundFilterNode.classList.add("backgroundFilter");
      this.element.appendChild(backgroundFilterNode);
    }

    this.element.classList.add("parralaxItem");
    this.element.setAttribute("id", `parallax${index}`);
    //  this.element.style.backgroundImage = `url(${this.img})`;
    this.element.style.zIndex = index + 1;
    this.element.appendChild(this.img);
  }
}
