const MAX_SPEED = 0.02;

export default class Paddle {
  constructor(element) {
    this.element = element;
    this.reset();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.element).getPropertyValue("--position")
    );
  }

  set position(value) {
    this.element.style.setProperty("--position", value);
  }

  rect() {
    return this.element.getBoundingClientRect();
  }
  reset() {
    this.position = 50;
  }

  update(delta, ballHeight) {
    this.position += MAX_SPEED * delta * (ballHeight - this.position);
  }
}
