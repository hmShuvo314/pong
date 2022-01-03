const INITIAL_VELOCITY = 0.06;
const ACCELERATION = 0.000008;

const audio = document.createElement("audio");
audio.volume = 0.5;

export default class Ball {
  constructor(element) {
    this.element = element;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.element).getPropertyValue("--x"));
  }
  set x(value) {
    this.element.style.setProperty("--x", value);
  }
  get y() {
    return parseFloat(getComputedStyle(this.element).getPropertyValue("--y"));
  }
  set y(value) {
    this.element.style.setProperty("--y", value);
  }
  rect() {
    return this.element.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.3 ||
      Math.abs(this.direction.x) >= 0.8
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRects) {
    const rect = this.rect();
    if (paddleRects.some((r) => hasACollision(r, rect))) {
      audio.src = "./sounds/tink.wav";
      audio.play();

      this.direction.y *= -1;
      this.y += this.direction.y * this.velocity * delta;
    } else if (rect.right >= window.innerWidth || rect.left <= 0) {
      this.direction.x *= -1;
      this.x += this.direction.x * this.velocity * delta;
    } else {
      this.velocity += ACCELERATION * delta;
      this.x += this.direction.x * this.velocity * delta;
      this.y += this.direction.y * this.velocity * delta;
    }
  }
}

const randomNumberBetween = (min, max) => Math.random() * (max - min) + min;
const hasACollision = (paddleRect, ballRect) =>
  paddleRect.top <= ballRect.bottom &&
  paddleRect.bottom >= ballRect.top &&
  paddleRect.left < ballRect.right &&
  paddleRect.right > ballRect.left;
