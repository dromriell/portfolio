export default class Time {
  constructor() {
    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 0;

    // Event
    this.event = new CustomEvent("tick");

    this.tick(this.current);
  }

  tick(currentTime) {
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = currentTime;
    window.dispatchEvent(this.event);

    requestAnimationFrame((timestamp) => {
      this.tick(timestamp);
    });
  }
}
