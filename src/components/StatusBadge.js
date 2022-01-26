export default class StatusBadge {
  constructor(message) {
    this.element = document.createElement("div");
    this.textNode = document.createElement("h3");
    this.message = message || "Update";

    this.setElements();
  }

  setElements() {
    const body = document.querySelector("body");
    this.setMessage(this.message);
    this.element.appendChild(this.textNode);
    this.element.classList.add("statusBadge");
    body.appendChild(this.element);
  }

  setMessage(message) {
    this.message = message;
    this.textNode.innerText = this.message;
  }

  alert(warning = false) {
    if (warning) {
      this.element.classList.add("badgeWarning");
    } else {
      this.element.classList.remove("badgeWarning");
    }
    this.element.classList.add("badgeShow");
    setTimeout(() => {
      this.element.classList.remove("badgeShow");
    }, 5000);
  }
}
