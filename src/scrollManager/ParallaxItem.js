export default class ParallaxItem {
  constructor(imgSrc, index) {
    this.imgSrc = imgSrc;
    this.element = document.createElement("div");
    this.img = document.createElement("img");

    this.img.src = imgSrc;

    this.element.classList.add("parralaxItem");
    //  this.element.style.backgroundImage = `url(${this.img})`;
    this.element.style.zIndex = index + 1;
    this.element.appendChild(this.img);
  }
}
