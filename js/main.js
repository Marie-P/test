import Controller from "./controller.js";

window.addEventListener("load", async() => new Main());

class Main {
  constructor() {
    this.controller = new Controller();

    document.documentElement.style.overflow = 'hidden';

    window.addEventListener("keydown", event => this.controller.keydownFunction(event));
    window.addEventListener("keyup", event => this.controller.keyupFunction(event));

    window.addEventListener("mousemove", event => this.controller.mousemoveFunction(event));
    window.addEventListener("mouseup", event => this.controller.mouseupFunction(event));

      window.addEventListener("mousedown", event => this.controller.mousedownFunction(event));

      window.addEventListener("touchstart", event => this.controller.touchstartFunction(event));
      window.addEventListener("touchmove", event => this.controller.touchmoveFunction(event));
      window.addEventListener("touchend", event => this.controller.touchendFunction(event));

    this.controller.mainMenu();
    // this.controller.load(); 
  }
}