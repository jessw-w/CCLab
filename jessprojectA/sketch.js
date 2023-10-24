//Creators notes: this project was inspired by studio ghibli's spirited away. The scene takes place where we meet the Soot Spirits who are very lively. I really like them as they seem so cute!

let mic;
let micLevel = 0; //enable microphone
let sootSpirits = []; //create a container for the sootspirits
let img;
let speedX;
let t = 0;
let clearTime = 0;

function setup() {
  let canvas = createCanvas(800, 500); //size used in order to match the image
  canvas.id("myp5");
  canvas.parent("p5container"); //to link to website

  mic = new p5.AudioIn();
  mic.start();
  img = loadImage("img/boiler room.jpeg");
  x = width / 2;
  y = height / 2;
  speedX = random(1, 3); //random speed from the start
}
function draw() {
  image(img, 0, 0); //image as background
  micLevel = mic.getLevel();

  let speedIncrease = map(micLevel, 0, 1, 0, 3); //increase speed based on the mic level
  for (let sootSpirit of sootSpirits) {
    sootSpirit.speedY += speedIncrease; //add to initial speed
    updateSootSpirit(sootSpirit); //pull up function to apply to the sootSpirits
    displaySootSpirit(sootSpirit);
  }

  if (micLevel > 0.85) {
    //condition if mic volume is over .85
    noLoop(); //pause the drawing to emphasize the size change
    setTimeout(function () {
      //will do the next step 1 second later
      sootSpirits = []; //clear out the container, no more soot spirits
      loop(); //resume the loop
    }, 1000);
  }

  //adding additional test to clue in the code above
  textSize(16);
  textAlign(CENTER, BOTTOM);
  textStyle(ITALIC);
  fill(255); // Set the text color to black
  text("Shhh... Be Quiet", width / 2, height); // Position the text at the middle bottom
}

//make a new sootspirit everytime we click our mouse
function mouseClicked() {
  let size = random(6.0, 10.0) + mouseY / 25; //size will depend on the height but also be slightly random each time
  makeSootSpirit(mouseX, mouseY, size, random(10, 20));
}

function makeSootSpirit(x, y, radius, speed) {
  let sootSpirit = {
    x: x,
    y: y,
    initialRadius: radius, //used in order to remember the size when it was first spawned
    radius: radius,
    speedY: speedX,
    isRGB: false,
  };

  //code in order to assign the sootspirit a color, black or rgb
  let randomColorChance = floor(random(0, 18)); //chance out of 18
  if (randomColorChance === 0) {
    sootSpirit.isRGB = true;
  }

  sootSpirits.push(sootSpirit);
  return sootSpirit;
}

function updateSootSpirit(sootSpirit) {
  sootSpirit.y += sootSpirit.speedY;

  //bouncing
  if (sootSpirit.y < sootSpirit.initialRadius) {
    sootSpirit.y = sootSpirit.initialRadius;
    sootSpirit.speedY = abs(sootSpirit.speedY); //bounce back up
  } else if (sootSpirit.y > height - sootSpirit.initialRadius) {
    sootSpirit.y = height - sootSpirit.initialRadius;
    sootSpirit.speedY = -abs(sootSpirit.speedY); //bounce back up
  }

  //restores size to the initial size
  sootSpirit.radius = sootSpirit.initialRadius;

  //size
  let newSize = map(micLevel, 0, 1, 10, 50);
  sootSpirit.radius = lerp(sootSpirit.radius, newSize, 0.3); //increases size slightly based on the volume
  if (micLevel > 0.84) {
    sootSpirit.radius = 100; //increase the size by a lot before dissapearing
  }
}

function displaySootSpirit(sootSpirit) {
  let x = sootSpirit.x;
  let y = sootSpirit.y;
  let radius = sootSpirit.radius;
  let isRGB = sootSpirit.isRGB;

  //inserting the small arms
  stroke(0);
  strokeWeight(2);
  line(x - radius / 2, y + radius / 4, x - radius, y + radius / 2);
  line(x + radius / 2, y + radius / 4, x + radius, y + radius / 2);

  if (isRGB) {
    //create an RGB soot spirit if true
    fill(random(255), random(255), random(255));
  } else {
    //otherwise use the default color black
    fill(0);
  }

  noStroke();
  ellipse(x, y, radius * 2);

  //eyeballs
  fill(255);
  ellipse(x - radius / 3.5, y - radius / 4, radius / 2);
  ellipse(x + radius / 3.5, y - radius / 4, radius / 2);

  fill(0);
  ellipse(x - radius / 5.5, y - radius / 3.7, radius / 9);
  ellipse(x + radius / 5.5, y - radius / 3.7, radius / 8);
}
