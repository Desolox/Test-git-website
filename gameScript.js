const screenWidth = 1000;
const screenHeight = 500;

const rectSize = 50;
const goalHeight = 100;

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var sprites = {};
var isGameLive = true;
var isRightKeyPressed = false;
var isLeftKeyPressed = false;

class GameCharacter{
  constructor(x, y, w, h, color, speed){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = color;
    this.speed = speed;
    this.maxSpeed = 4;
  }

  moveVertically(){
    if((this.y >= screenHeight - rectSize && this.speed > 0)||
       (this.y <= 0 && this.speed < 0)){
      this.speed = -this.speed;
     }
    this.y += this.speed;
  }

  moveHorizontally(){
    this.x += this.speed;
    if(this.x <= 0){
      this.x = 0;
    }
  }
}

var player = new GameCharacter(50, screenHeight / 2 - 50 / 2, rectSize, rectSize, "rgb(0, 0, 255)", 0);

var goal = new GameCharacter(screenWidth - rectSize - 2, screenHeight / 2 - goalHeight / 2 , rectSize, goalHeight, "rgb(255, 255, 0)", 0);

var enemies = [
  new GameCharacter(300, 0, rectSize, rectSize, "rgb(0, 255, 0)", 2),
  new GameCharacter(550, screenHeight - 50, rectSize, rectSize, "rgb(0, 255, 0)", -2),
  new GameCharacter(800, 0, rectSize, rectSize, "rgb(0, 255, 0)", 2)
];


document.onkeydown = function (event) {
  let keyPressed = event.keyCode;
  if(keyPressed == 39 || keyPressed == 68){
    isRightKeyPressed = true;
    player.speed = player.maxSpeed;
  }else if(keyPressed == 37 || keyPressed == 81){
    isLeftKeyPressed = true;
    player.speed = -player.maxSpeed;
  }
}

document.onkeyup = function (event) {
  let keyup = event.keyCode;
  if(keyup == 39 || keyup == 68) {
    isRightKeyPressed = false;
    if(isLeftKeyPressed){
      player.speed = -player.maxSpeed;
    }else{
      player.speed = 0;
    }
  }else if(keyup == 37 || keyup == 81){
    isLeftKeyPressed = false;
    if(isRightKeyPressed){
      player.speed = player.maxSpeed;
    }else{
      player.speed = 0;
    }
  }
}

var checkCollisions = function(rect1, rect2){
  var xOverlap = Math.abs(rect1.x - rect2.x) < Math.max(rect1.width, rect2.width);
  var yOverlap = Math.abs(rect1.y - rect2.y) < Math.max(rect1.height, rect2.height);
  return xOverlap && yOverlap;
}

var endGameLogic = function(text){
  isGameLive = false;
  alert(text);
  window.location = "";
}

var loadSprites = function(){
  sprites.player = new Image();
  sprites.player.src = './images/hero.png';

  sprites.enemies = new Image();
  sprites.enemies.src = './images/enemy.png';

  sprites.goal = new Image();
  sprites.goal.src = './images/chest.png';

  sprites.bg = new Image();
  sprites.bg.src = './images/floor.png';
}

var update = function(){
  player.moveHorizontally();

  enemies.forEach(function(elem){
    if(checkCollisions(elem, player)){
      endGameLogic('Collision detected !!!');
    }
    elem.moveVertically();
  });

  if(checkCollisions(player, goal)){
    endGameLogic('You have win !!!');
  }
}

var draw = function(){
  ctx.clearRect(0, 0, screenWidth, screenHeight);

  ctx.drawImage(sprites.bg, 0, 0);
  ctx.drawImage(sprites.player, player.x, player.y);
  ctx.drawImage(sprites.goal, goal.x, goal.y);

  /*ctx.fillStyle = goal.color;
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);*/

  enemies.forEach(function(elem){
    ctx.drawImage(sprites.enemies, elem.x, elem.y);
    /*ctx.fillStyle = elem.color;
    ctx.fillRect(elem.x, elem.y, elem.width, elem.height);*/
  });
}

var step = function(){
  update();
  draw();

  if(isGameLive){
    window.requestAnimationFrame(step);
  }
}

loadSprites();
step();