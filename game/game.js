//initial animate function
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

//canvas-based var declarations
var canvas = document.getElementById("game-canvas")
var context = canvas.getContext('2d');
var cwidth = 1250;
var cheight = 600;

//declare key related array
var keysDown = {};

//game-related var declarations
var started = false;

var level = 0;
var stage = 0;
/*
var enemyMap = [
  // [ENEMY 1, LEVEL, STAGE, XCOORD, YCOORD, VERTICAL OR HORIZONTAL],
  [new HorizontalEnemy(6*50, 9*50,32,32,image), 1, 2],
  [new HorizontalEnemy(9*50, 9*50,32,32,image), 1, 3],
  [new VerticalEnemy(14*50, 6*50,32,32,image), 1, 3],
  [new HorizontalEnemy(15*50, 6*50,32,32,image), 1, 3],
  [new HorizontalEnemy(9*50, 4*50,32,32,image), 1, 4],
  [new HorizontalEnemy(9*50, 5*50,32,32,image), 1, 4],
  [new HorizontalEnemy(9*50, 6*50),32,32,image), 1, 4],
  [new HorizontalEnemy(9*50, 7*50,32,32,image), 1, 4],
  [new HorizontalEnemy(9*50, 8*50,32,32,image), 1, 4]
]
*/
var levelMap = [];
var puzzleMap = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

//image imports

var goldBlockImage = new Image();
goldBlockImage.src = "resources/goldBlock.png";

var grassBlockImage = new Image();
grassBlockImage.src = "resources/grassBlock.png";

var ladderBlockImage = new Image();
ladderBlockImage.src = "resources/ladderBlock.png";

var fireBlockImage = new Image();
fireBlockImage.src = "resources/fireBlock.png";

var puzzleImage = new Image();
puzzleImage.src = "resources/puzzlePieces/puzzle" + (level+1) + ".png";

var lifeHeartImage = new Image();
lifeHeartImage.src = "resources/life.png";
var playerImage = new Image();

// audio imports
var backgroundMusic = document.createElement('audio');
backgroundMusic.setAttribute('src', 'resources/audio/background_green.mp3');
backgroundMusic.loop = true;

var titleMusic = document.createElement('audio');
titleMusic.setAttribute('src', 'resources/audio/loading_screen.mp3');
titleMusic.loop = true;
titleMusic.play();

//make rectangle function
function rect(x,y,w,h) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
  context.stroke();
}

//player class
class Player {
  constructor(x,y,width,height,lives,image){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lives = lives;
    this.pieces = 0;
    this.jumping = false;
    this.jump_dist = 0;
    this.climbing = false;
    this.falling = false;
    this.running = false;
    this.direction = "right";
    this.anim_frame = 0;
    this.image = image;
  }
  //getter and setter for lives
  getLives(){
    return this.lives;
  }
  setLives(n){
    this.lives = n;
  }
  //getter and setter for # of pieces collected, in current level
  getPieces(){
    return this.pieces;
  }
  setPieces(n){
    this.pieces = n;
  }
  //move and moveto functions; move increments by deltax, while moveTo hard-sets a position
  move(deltax, deltay){
    this.x += deltax;
    this.y += deltay;
  }

  moveTo(x,y){
    this.x = x;
    this.y = y;
  }
  //partial jump function, other part is in update()
  jump(){
    if (this.jumping === false && this.falling === false){
      this.jumping = true;
    }
  }
  //function executed when dead
  die(type){
    if (this.lives - 1 < 1){
      restartGame();
    }
    else{
      this.lives -= 1;
      alertText.setText("Sucks to suck, you died by " + type + "!");
      alertText.setActivated(1);
      this.moveTo(5,0);
    }
  }
  //check collision function, checks for up, down, left, and right
  checkCollision(x,y,width,height,direction,map){
    if (direction == "up"){
      if(map[(Math.floor(x/50))+(Math.floor((y-1)/50))*25] == 4){
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if(map[(Math.floor(x/50))+(Math.floor((y-1)/50))*25] == 5){
        return 5;
      }
      else if(map[(Math.floor(x/50))+(Math.floor((y-1)/50))*25] === 0 && y -5 > 0){
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "down"){
      if(map[(Math.floor(x/50))+(Math.floor((y+height)/50))*25] == 4 || map[(Math.floor((x+width-5)/50))+(Math.floor((y+height)/50))*25] == 4){
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if(map[(Math.floor(x/50))+(Math.floor((y+height)/50))*25] == 5 || map[(Math.floor((x+width-5)/50))+(Math.floor((y+height)/50))*25] == 5){
        return 5;
      }
      else if (map[(Math.floor(x/50))+(Math.floor((y+height)/50))*25] === 0 && map[(Math.floor((x+width-5)/50))+(Math.floor((y+height)/50))*25] === 0){
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "left"){
      if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] == 4 || map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] == 4) {
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] == 5 || map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] == 5) {
        return 5;
      }
      else if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] == 3 || map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] == 3) {
        return 3;
      }
      else if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] === 0 && map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] === 0) {
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "right"){
      if(map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] == 4 || map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] == 4){
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if(map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] == 5 || map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] == 5){
        return 5;
      }
      else if(map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] == 3 || map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] == 3){
        return 3;
      }
      else if (map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] === 0 && map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] === 0){
        return 0;
      }
      else{
        return 1;
      }
    }
  }
  // main update function, checks for errors and positions character appropriately
  update(map){
    //this tidbit handles jumping
    if (this.jumping === true && this.jump_dist <= 75){
        this.jump_dist += 5;
        if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) === 0){
          this.move(0,-5);
        }
    }
    else if (this.climbing === false){// falling code
      if (this.y + this.height + 5 > cheight){
        this.die("falling out of the world");
      }
      else if (this.checkCollision(this.x,this.y,this.width,this.height,"down",map) == 5){
        this.die("burning to death");
      }
      else if (this.checkCollision(this.x,this.y,this.width,this.height,"down",map) == 4){
        puzzleMap[level][stage] = 1;
        this.pieces += 1;
      }
      else if (this.checkCollision(this.x,this.y,this.width,this.height,"down",map) === 0){
        this.move(0,5);
        this.falling = true;
      }
      else{
        this.falling = false;
        this.jumping = false;
        this.jump_dist = 0;
      }
    }
    // this happens to set default states, instead of checking for key released
    this.climbing = false;
    this.running = false;
    for (var key in keysDown) { // n-key rollover movement code
      var value = Number(key);
      if (value == 38){ // up
        if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) == 5){ // check for fire
          this.die("burning to death");
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) == 4){ // check for puzzle
          puzzleMap[level][stage] = 1;
          this.pieces += 1;
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) == 3){ // check for ladder on left side
          if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) != 1){
            this.move(0,-5);
            this.climbing = true;
          }
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) == 3 && this.checkCollision(this.x,this.y,this.width,this.height,"up",map) === 0){ // check for ladder on right side
          this.move(0,-5);
          this.climbing = true;
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) === 0){
          this.jump();
        }
      }
      else if (value == 37) { // left
        if (this.x - 5 > 0){
          if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) == 5){
            this.die("burning to death");
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) == 4){
            puzzleMap[level][stage] = 1;
            this.pieces += 1;
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) === 0){
            this.move(-5,0);
          }
        }
        else{
          if (stage > 0){ // sidescrolling stages
            stage -= 1;
            alertText.setActivated(0);
            this.moveTo(cwidth-this.width-5,this.y);
          }
        }
        this.direction = "left";
        this.running = true;
      } else if (value == 39) { // right
        if (this.x + this.width + 5 < cwidth){
          if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) == 5){
            this.die("burning to death");
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) == 4){
            puzzleMap[level][stage] = 1;
            this.pieces += 1;
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) === 0){
            this.move(5,0);
          }
        }
        else{
          if (stage < 8){
            stage += 1;
            alertText.setActivated(0);
            this.moveTo(0,this.y);
          }
          else{
            if (this.pieces == 9){
              this.moveTo(0,this.y);
              newLevel();
            }
            else{
              alertText.setText("You don't have all 9 puzzle pieces!");
              alertText.setActivated(1);
            }
          }
        }
        this.direction = "right";
        this.running = true;
      }
    }
  }
  // player drawing animation, includes dealing with spritesheets
  draw(){
    var srcString = "resources/Player/kirby";
    var needs_sprite = false;
    if (this.jumping === true || this.climbing === true){
      srcString += "Up";
    }
    else if (this.falling === true){
      srcString += "Down";
    }
    else if (this.running === true){
      srcString += "Run";
      needs_sprite = true;
    }
    else{
      srcString += "Normal";
      needs_sprite = true;
    }
    if (this.direction == "right"){
      srcString += "Right";
    }
    else{
      srcString += "Left";
    }
    this.image.src = srcString;
    context.drawImage(this.image, this.x,this.y);

    if (needs_sprite === true){
      srcString += "Spritesheet.png";
      this.image.src = srcString;
      context.drawImage(this.image, (Math.floor((this.anim_frame)/30)%(this.image.width/32))*32,0,32,32,this.x,this.y,32,32);
      this.anim_frame += 1;
    }
    else{
      srcString += ".png";
      this.image.src = srcString;
      context.drawImage(this.image, this.x,this.y);
      this.anim_frame = 0;
    }
  }
}

// enemy default class
class Enemy {
  constructor (x,y,width,height,image){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = -5; //if hit a wall multiply by -1
  }
  checkCollision(x,y,width,height,direction,map){
    if (direction == "up"){
      if(map[(Math.floor(x/50))+(Math.floor((y-1)/50))*25] === 0 && y -5 > 0){
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "down"){
      if (map[(Math.floor(x/50))+(Math.floor((y+height)/50))*25] === 0 && map[(Math.floor((x+width-5)/50))+(Math.floor((y+height)/50))*25] === 0){
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "left"){
      if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] === 0 && map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] === 0) {
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "right"){
      if (map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] === 0 && map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] === 0){
        return 0;
      }
      else{
        return 1;
      }
    }
  }
  draw() {
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class VerticalEnemy extends Enemy {
  constructor (x,y,width,height,image) {
    super(x,y,width,height);
    this.image = image;
  }
  checkCollision(x,y,width,height,direction,map){
    super.checkCollision(x,y,width,height,direction,map);
  }
  update(map) {
    if (this.y + this.speed < cheight) {
      this.y += this.speed;
      if (this.checkCollision(this.x,this.y,this.width,this.height,map) !== 0){
        this.speed = this.speed * -1;
      }
    }
  }
  draw() {
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

class HorizontalEnemy extends Enemy {
  constructor (x,y,width,height,image){
    super(x,y,width,height);
    this.image = image;
  }
  checkCollision(x,y,width,height,direction,map){
    super.checkCollision(x,y,width,height,direction,map);
  }
  update(map) {
    if (this.x + this.speed < cwidth) {
      this.x += this.speed;
      if (this.checkCollision(this.x,this.y,this.width,this.height,map) !== 0){
        this.speed = this.speed * -1;
      }
    }
  }
  draw(){
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

// block default class
class Block {
  constructor (x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  // assign block location
  assign(newx,newy){
    this.x = newx;
    this.y = newy;
  }
  // draw block
  draw(){
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

//platform child class
class Platform extends Block {
  constructor (x,y,width,height,image){
    super(x,y,width,height);
    this.image = image;
  }
  draw(){
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

//puzzle child class
class Puzzle extends Block{
  constructor (x,y,width,height){
    super(x,y,width,height);
  }
  draw(){
    context.drawImage(puzzleImage,stage%3*50,Math.floor(stage/3)*50,50,50,(i%25)*50,(Math.floor(i/25))*50,50,50);
    //context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

//obstacle child class
class Obstacle extends Block{
  constructor (x,y,width,height,image){
    super(x,y,width,height);
    this.image = image;
  }
  draw(){
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

// creating on-screen alerts
class Alert{
  constructor(){
    this.text = "";
    this.x = 625;
    this.y = 25;
    this.activated = false;
  }
  setActivated(key){
    if (key === 0){
      this.activated = false;
    }
    else{
      this.activated = true;
    }
  }
  setText(newText){
    this.text = newText;
  }
  draw(){
    context.fillStyle = "#d9534f";
    context.strokeStyle = "#d9534f";
    rect(150,3,950,32);
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillText(this.text,this.x,this.y);
  }
}
/*
//enemy function
function renderEnemy(enemyMap,lvl,stg){
  for (int i = 0; i < enemyMap.length; j++) { // EVERY ELEMENT IN THAT ARRAY
    if (i ) {// IF THE CURRENT STAGE AND LEVEL ARE EQUAL TO THE ARRAY ELEMENTS LEVEL OR STAGE
      array[i][0].draw()
    }
  }
}
*/
//map functions

function updateMap(world,stg,lvl){
  if (world == 1){
    levelMap = world1_map[stg][lvl];
  }
}

function renderMap(map){
  for (i = 0; i < map.length; i++){
    if (map[i] == 1){
      grassBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      grassBlock.draw();
    }
    else if (map[i] == 2){
      goldBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      goldBlock.draw();
    }
    else if (map[i] == 3){
      goldBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      goldBlock.draw();
      ladderBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      ladderBlock.draw();
    }
    else if (map[i] == 4 && puzzleMap[level][stage] === 0){
      puzzleBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      puzzleBlock.draw();
    }
    else if (map[i] == 5){
      fireBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      fireBlock.draw();
    }
  }
}



function restartMap(){
  level = 0;
  stage = 0;
  player.setLives(3);
  player.moveTo(5,0);
  player.setPieces(0);
  puzzleMap = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
  ];
  alertText.setActivated(0);
}

function newLevel(){
  level += 1;
  stage = 0;
  player.setPieces(0);
  player.setLives(3);
  puzzleImage.src = "resources/puzzlePieces/puzzle" + (level+1) + ".png";
}
//text functions

function renderText(){
  context.fillStyle = "black";
  context.font = "16px Arial";
  context.textAlign = "start";

  context.fillText(String(level+1) + "-" + String(stage+1),20,20);
  context.fillText("Pieces: " + player.getPieces(),1150,70);

  context.textAlign = "center";

  for (i = 0; i < world1_text[level][stage].length; i ++){
    context.fillText(world1_text[level][stage][i][0],world1_text[level][stage][i][1],world1_text[level][stage][i][2]);
  }

  if (alertText.activated === true){
    alertText.draw();
  }
}

//other UI functions

function renderLives(){
  for (i = 0; i <3; i ++){
    if (player.getLives() > i){
      context.drawImage(lifeHeartImage, 1150+i*30,20);
    }
  }
}

function renderPuzzle(puzzleMap,puzzleImage){
  for (i=0;i<9;i++){
    if (puzzleMap[level][i] == 1){
      context.drawImage(puzzleImage,i%3*50,Math.floor(i/3)*50,50,50,1150+i%3*25,75+Math.floor(i/3)*25,25,25);
    }
  }
}
var beginHit = false;
// game functions
function beginGame(){
  if (beginHit){
    restartGame()
  }
  started = true;
  titleMusic.pause();
  backgroundMusic.play();
  beginHit = true;
}
function restartGame(){
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  restartMap();
  puzzleImage.src = "resources/puzzlePieces/puzzle" + (level+1) + ".png";
  started = false;
  titleMusic.play();
}

// update button funciton
function updateButton(){
  /*
  if (started === true){
    $("#game-button").attr("onclick","restartGame()");
    $("#game-button").html("Restart Game");
  }
  else{
    $("#game-button").attr("onclick","beginGame()");
    $("#game-button").html("Start Game");
  }
  */
}

//player declaration
var player = new Player(0,0,25,25,3,playerImage);

//other class declarations
var goldBlock = new Platform(0,0,50,50,goldBlockImage);
var grassBlock = new Platform(0,0,50,50,grassBlockImage);
var puzzleBlock = new Puzzle(0,0,50,50);
var ladderBlock = new Platform(0,0,50,50,ladderBlockImage);
var fireBlock = new Obstacle(0,0,50,50,fireBlockImage);

var alertText = new Alert();

// animation steps
var update = function(){
  updateButton();
  if (started === true){
    updateMap(1,level,stage);
    player.update(levelMap);
  }
};

var render = function () {
  if (started === false){ //start game screen
    context.textAlign = "center";
    context.fillStyle = "pink";
    context.fillRect(0, 0, cwidth, cheight);
    context.fillStyle = "#000000";
    context.font = "30px Arial";
    context.fillText("welcome to the game juan. press start :)",625,285);
  }
  else{

    context.fillStyle = "lightblue";
    context.strokeStyle = "lightblue";
    rect(0,0,cwidth,cheight);

    //context.drawImage(skyBackgroundImage,0,0,cwidth,cheight);
    renderMap(levelMap);
    player.draw();
    renderText();
    renderLives();
    renderPuzzle(puzzleMap,puzzleImage);
  }
};

var step = function () {
  update();
  render();
  animate(step);
};

animate(step);

// audio event listeners
backgroundMusic.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);

// key listeners

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

// juan you shouldn't look here :))))))

function winGame(){
  console.log("Wow, can't believe you actually played my crap game!")
  console.log("Anyways, I'm sure you want the clue and to know what the next puzzle is.")
  console.log("Your next clue is...")
  console.log("Head to http://whatthefatdog.com/ to figure it out :)")
  return "fat dog"
}