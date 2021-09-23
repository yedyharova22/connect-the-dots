let app = new PIXI.Application({
  width: 480,
  height: 480,
  backgroundColor: 0xffffff,
});

window.onload = function () {
  document.body.appendChild(app?.view);
};

const container = new PIXI.Container();
app.stage.addChild(container);

const score = document.getElementById("score");

const getRandomColor = () => {
  const colors = ["blue", "green", "purple", "red", "yellow"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const circles = [];
let indexes = [];
let point = 0;

class Circle {
  constructor(circle, color) {
    this.circle = circle;
    this.color = color;
  }
}

const generateCircle = (i) => {
  const color = getRandomColor();
  const circle = PIXI.Sprite.from(`../data/${color}.png`);

  circle.interactive = true;
  circle.buttonMode = true;

  circle.anchor.set(0.5);
  circle.width = 50;
  circle.height = 50;
  circle.x = 80 * (i % 6) + 40;
  circle.y = 80 * Math.trunc(i / 6) + 40;

  circle
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointermove", onDragMove)
    .on("pointerupoutside", onDragEnd);

  return new Circle(circle, color);
}

const checkUp = (i) => {
  let j = i - 6 * 2;
  while (j > 5) {
    if (circles[j].circle) {
      circles[i].circle = circles[j].circle;
      circles[i].color = circles[j].color;

      circles[j].circle = null;
      circles[j].color = "";

      circles[i].circle.x = 80 * (i % 6) + 40;
      circles[i].circle.y = 80 * Math.trunc(i / 6) + 40;

      app.stage.addChild(circles[i].circle);
      return;
    }
    j -= 6;
  }
  circles[i] = generateCircle(i);
  app.stage.addChild(circles[i].circle);
}

const updateCircles = () => {
  let needUpdate = circles.filter(el => el.circle === null).length > 0;
  let i = 35;

  while (needUpdate && i >= 0) {
    if (i >= 6 && circles[i].circle === null) {
      if (!circles[i - 6].circle && i - 6 >= 5)
        checkUp(i);
      else if (!circles[i - 6].circle && i - 6 < 5) {
        circles[i] = generateCircle(i);
        app.stage.addChild(circles[i].circle);
      }
      else {
        circles[i].circle = circles[i - 6].circle;
        circles[i].color = circles[i - 6].color;

        circles[i - 6].circle = null;
        circles[i - 6].color = "";

        circles[i].circle.x = 80 * (i % 6) + 40;
        circles[i].circle.y = 80 * Math.trunc(i / 6) + 40;

        app.stage.addChild(circles[i].circle);
      }

      needUpdate = circles.filter(el => el.circle === null).length > 0;
    } else
      if (i < 6 && circles[i].circle === null) {
        circles[i] = generateCircle(i);
        app.stage.addChild(circles[i].circle);

        needUpdate = circles.filter(el => el.circle === null).length > 0;
      }
    i--;
  }
}

function onDragStart(event) {
  this.data = event.data;
  this.alpha = 1;
  this.dragging = true;
}

const checkColors = (indexes) => {
  const colors = [];
  indexes.forEach(i => colors.push(circles[i].color));
  return [...new Set(colors)].length === 1;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  this.data = null;

  indexes = [...new Set(indexes)];
  if (indexes.length > 1 && checkColors(indexes)) {
    for (let i = 0; i < indexes.length; i++) {
      app.stage.removeChild(circles[indexes[i]].circle);

      circles[indexes[i]].circle = null;
      circles[indexes[i]].color = "";
    }

    point += indexes.length;
    score.innerHTML = `Score: ${point}`;

    updateCircles();
  }
  indexes.length = 0;
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    const index = Math.trunc(newPosition.y / 80) * 6 + Math.trunc(newPosition.x / 80);

    if (circles[index].circle && checkColors(indexes)) circles[index].circle.alpha = 0.3;

    indexes.push(index);
  }
}

for (let i = 0; i < 36; i++)
  circles.push(generateCircle(i));

circles.forEach((circle) => app.stage.addChild(circle.circle));

const restartButton = document.getElementById("restart");
restartButton.onclick = () => {
  circles.forEach(el => app.stage.removeChild(el.circle));
  circles.length = 0;
  indexes.length = 0;
  point = 0;
  score.innerHTML = `Score: ${point}`;

  for (let i = 0; i < 36; i++)
    circles.push(generateCircle(i));

  circles.forEach((circle) => app.stage.addChild(circle.circle));
}