// creating new PixiJS application
let app = new PIXI.Application({
  width: 480,
  height: 480,
  backgroundColor: 0xffffff,
});

const canv = document.getElementById("canv");
const wrapper = document.getElementById("wrapper");

// on window load new Pixi canvas appears
window.onload = function () {
  wrapper.style = "display: flex";
  canv.appendChild(app?.view);
};

// get random color method for making multicolored texture
const getRandomColor = () => {
  const colors = ["blue", "green", "purple", "red", "yellow"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// setting global variables
const score = document.getElementById("score");
let point = 0;
const circles = [];
let indexes = [];

// class circle
class Circle {
  constructor(circle, color) {
    // circle that will appear on the canvas
    this.circle = circle;
    // save color of the circle
    this.color = color;
  }

  // remove circle method
  removeCircle() {
    app.stage.removeChild(this.circle);
    this.circle = null;
    this.color = "";
  }
}

// generate circle with atributes and interactivity
const generateCircle = (i) => {
  const color = getRandomColor();
  // create circle as Pixi Sprite
  const circle = PIXI.Sprite.from(`../data/${color}.svg`);

  circle.interactive = true;
  circle.buttonMode = true;

  // general atributes and coordinates of Sprite
  circle.anchor.set(0.5);
  circle.width = 50;
  circle.height = 50;
  // calculate coordinates depending on index in array
  circle.x = 80 * (i % 6) + 40;
  circle.y = 80 * Math.trunc(i / 6) + 40;

  // action listeners
  circle
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointermove", onDragMove)
    .on("pointerupoutside", onDragEnd);

  return new Circle(circle, color);
}

// on mouse click or touch
function onDragStart(event) {
  this.data = event.data;
  this.alpha = 1;
  this.dragging = true;
}

// on mouse/touch up
function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  this.data = null;

  // remove repeats from array
  indexes = [...new Set(indexes)];

  // check length and colors of choosen elements
  if (indexes.length > 1 && checkColors(indexes)) {
    for (let i = 0; i < indexes.length; i++)
      circles[indexes[i]].removeCircle();

    // update score
    point += indexes.length;
    score.innerHTML = `Score: ${point}`;

    updateCircles();
  }
  indexes.length = 0;
}

// on mouse/touch moving
function onDragMove() {
  if (this.dragging) {
    // set new position
    const newPosition = this.data.getLocalPosition(this.parent);
    // calculate index of element in array
    const index = Math.trunc(newPosition.y / 80) * 6 + Math.trunc(newPosition.x / 80);

    if (circles[index].circle && checkColors(indexes)) circles[index].circle.alpha = 0.3;

    indexes.push(index);
  }
}

// restart button variable
const restartButton = document.getElementById("restart");

// add event listener on click
restartButton.onclick = () => {
  // reset fiels with circles
  circles.forEach(el => el.removeCircle());
  circles.length = 0;
  indexes.length = 0;

  // update score
  point = 0;
  score.innerHTML = `Score: ${point}`;

  // generating new randow circles
  for (let i = 0; i < 36; i++)
    circles.push(generateCircle(i));

  // add new dots to the Pixi stage
  circles.forEach((circle) => app.stage.addChild(circle.circle));
}

// swap empty space with top circle
function circleSwap(i, j) {
  circles[i].circle = circles[j].circle;
  circles[i].color = circles[j].color;

  circles[j].circle = null;
  circles[j].color = "";

  circles[i].circle.x = 80 * (i % 6) + 40;
  circles[i].circle.y = 80 * Math.trunc(i / 6) + 40;

  app.stage.addChild(circles[i].circle);
}

// updating circles array after deleting
function updateCircles() {
  // check if array must be updated
  let needUpdate = circles.filter(el => el.circle === null).length > 0;
  // start from the end
  let i = 35;

  while (needUpdate && i >= 0) {
    // if dot is not in first row
    if (i >= 6 && circles[i].circle === null) {
      // if top element is null
      if (!circles[i - 6].circle && i - 6 >= 5)
        checkUp(i);
      // if top element is in first row and is null
      else if (!circles[i - 6].circle && i - 6 < 5) {
        circles[i] = generateCircle(i);
        app.stage.addChild(circles[i].circle);
      }
      // if top element is not null
      else
        circleSwap(i, i - 6);

      needUpdate = circles.filter(el => el.circle === null).length > 0;
    } else
      // if element in first row
      if (i < 6 && circles[i].circle === null) {
        circles[i] = generateCircle(i);
        app.stage.addChild(circles[i].circle);

        needUpdate = circles.filter(el => el.circle === null).length > 0;
      }
    i--;
  }
}

// check if choosen dots have the same color 
function checkColors(indexes) {
  const colors = [];
  indexes.forEach(i => colors.push(circles[i].color));
  return [...new Set(colors)].length === 1;
}

function checkUp(i) {
  let j = i - 6 * 2;
  while (j > 5) {
    // check if top circles exist
    if (circles[j].circle) {
      circleSwap(i, j);
      // if swaped leaving the function
      return;
    }
    // decreasing j to continue checking top circles
    j -= 6;
  }

  // if no dots on top, generating and adding new one
  circles[i] = generateCircle(i);
  app.stage.addChild(circles[i].circle);
}

for (let i = 0; i < 36; i++)
  circles.push(generateCircle(i));

circles.forEach((circle) => app.stage.addChild(circle.circle));