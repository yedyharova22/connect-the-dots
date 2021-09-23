let app = new PIXI.Application({
  width: 600,
  height: 600,
  backgroundColor: 0xffffff,
});

window.onload = function () {
  document.body.appendChild(app?.view);
};

const container = new PIXI.Container();
app.stage.addChild(container);

const getRandomColor = () => {
  const colors = ["blue", "green", "purple", "red", "yellow"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const circles = [];
class Circle {
  constructor(circle) {
    this.circle = circle;
  }
}

function onDragStart(event) {
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}

const setField = (i, j) => {
  const circle = PIXI.Sprite.from(`../data/${getRandomColor()}.png`);

  circle.interactive = true;
  circle.buttonMode = true;

  circle.anchor.set(0.5);
  circle.width = 100;
  circle.height = 100;
  circle.x = 100 * i + 50;
  circle.y = 100 * j + 50;

  circle
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd)
    .on("pointermove", onDragMove);

  circles.push(new Circle(circle));
};

for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) setField(i, j);

circles.forEach((circle) => app.stage.addChild(circle.circle));
