var astranoutImg,bgImg,bg1Img;
var bg2Img,shipImg,enemy_shipImg,space_foodImg;
var waterImg,stoneImg,lazerImg;
var spaceship,asteroids,enemy_spaceship,food,water,lazer;
var rockGr,aleinGr,foodGr,waterGr,lazerGroup;
var bksound,gamewin_sound,gamelose_sound,movingup_sound,throwing_laser,stone_hit,destroy_stone;
var peace = 10;
var water_level = 150;
var food_level = 150;
var blastImg;
var PLAY = 1;
var END =2;
var gameState = PLAY

function preload(){ // load images, animations and sound files
  astranoutImg = loadImage("./assets/astronout.png");
  bgImg = loadImage("./assets/bg.jpg");
  bg1Img = loadImage("./assets/bg1.jpg");
  bg2Img = loadImage("./assets/bg2.jpg");
  shipImg = loadImage("./assets/spaceShip.png");
  enemy_shipImg = loadImage("./assets/enemy_ship.png");
  space_foodImg = loadImage("./assets/space_food.png");
  waterImg = loadImage("./assets/water.png");
  stoneImg = loadImage("./assets/stones.png");
  peaceIMg = loadImage("./assets/peace.png");
  lazerImg = loadImage("./assets/vlaser.png")
  blastImag = loadImage("./assets/blast.png")

  bksound= loadSound("bk-music.wav");
  throwing_lazer=loadSound("lazer-beam.wav");
  stone_hit=loadSound("stonehit.wav");
  gamelose_sound=loadSound("game-over.wav");
  destroy_stone=loadSound("collecting-coins.wav");
  movingup_sound=loadSound("move_up.mp3");

  
}

function setup(){ // create sprites, add animation and images, executes its st. only once
  createCanvas(windowWidth,windowHeight);
  
  bg = createSprite(width/2,height/2);
  bg.addImage("bg2",bg2Img);
  bg.scale = 1.2;
  bg.velocityY = 4.5;
  bksound.play();
  bksound.setVolume(0.2);
  
  rockGr = new Group();
  aleinGr = new Group();
  foodGr = new Group();
  waterGr = new Group();
  lazerGroup = new Group();

  spaceship = createSprite(width/2,height-100,50,50);
  spaceship.addImage("spaceship",shipImg);
 

  

  spaceship.scale = 0.3;
  
  spaceship.setCollider("rectangle",0,-60,500,280)
}

function draw(){
  background("black");
  drawSprites();
  
  if(!bksound){
  bksound.loop =true
  bksound.play();
  bksound.setVolume(0.2);
}

  if (gameState === PLAY) {

  spaceship.changeAnimation("spaceship");
   
  if (bg.y >height-200)
  { 
    bg.y = 100 
  }

  if(keyDown("RIGHT_ARROW") && food_level > 0 && water_level >0)
  {
    spaceship.x +=10;
    water_level -= 0.5;
    food_level -= 0.5;
  }

  if(keyDown("LEFT_ARROW") && food_level > 0 && water_level >0)
  {
    spaceship.x -=10;
    water_level -= 0.5;
    food_level -= 0.5;
  }

  if(keyDown("UP_ARROW") && food_level > 0 && water_level >0)
  {
    spaceship.y -=10;
    water_level -= 1;
    food_level -= 1;
    
  }

  if(keyDown("DOWN_ARROW") && food_level > 0 && water_level >0)
  {
    spaceship.y +=10;
    water_level -= 1;
    food_level -= 1;
  }

  if(keyDown("SPACE"))
  {
    shoot()
    movingup_sound.play();
  }

  if(rockGr.isTouching(spaceship))
  {
    peace -= 10;
    rockGr.destroyEach();
    stone_hit.play()
  }

  
  if(foodGr.isTouching(spaceship))
  {
    food_level = 150
    foodGr.destroyEach()
  }

  if(waterGr.isTouching(spaceship))
  {
    water_level = 150
    waterGr.destroyEach()
  }

  if (lazerGroup.collide(aleinGr)){
    peace = peace +20;
    lazerGroup.destroyEach();
    aleinGr.destroyEach();
  }
  
  if (lazerGroup.collide(rockGr)) {
    peace = peace +5;
    lazerGroup.destroyEach();
    rockGr.destroyEach();
  }

  if(water_level <=0 || food_level<=0 || peace<=0)
  {
    gameOver()
    console.log("game over")
    
    gameState =END;
    
  }

  if(peace >= 200)
  {
    showRank()
    console.log("peace")
    gameState =END;
  }
  
  spawn_food();
  spawn_water();
  spawn_alein_ship();
  spawn_asteroids();
  
  peacebar();
  water_bar();
  food_bar();

  }

  if (gameState === END ){
    end();
  }
 
}

function windowResize()
{
  resizeCanvas(windowWidth,windowHeight);

}

function spawn_asteroids()
{
  if(frameCount%70===0)
  {
    var x = Math.round(random(100,width-200))
    asteroids = createSprite(x,10,50,50);
    asteroids.addImage("asteroids",stoneImg);
    asteroids.scale = 0.3;
    asteroids.velocityY = 5;
    rockGr.add(asteroids);
   
    asteroids.setCollider("circle",0,0,100)
  }
}

function spawn_alein_ship()
{
  if(frameCount%170===0)
  {
  var x = Math.round(random(100,width-300))
  enemy_spaceship = createSprite(x,5,50,50);
  enemy_spaceship.addImage("enemy_spaceship",enemy_shipImg);
  enemy_spaceship.scale = 0.3;
  enemy_spaceship.velocityY = 2;
  aleinGr.add(enemy_spaceship);
  
  enemy_spaceship.setCollider("rectangle",0,0,500,400)
  }
}

function spawn_food()
{
  if(frameCount%450===0)
  {
    var z = Math.round(random(200,width-300))
    food = createSprite(z,10,50,50);
    food.addImage("food",space_foodImg);
    food.scale = 0.3;
    food.velocityY = 5;
    foodGr.add(food);
   
    food.setCollider("rectangle",0,0,200,300)
  }
}

function spawn_water()
{
  if(frameCount%450===0)
  {
    var p = Math.round(random(150,width-250));
    water = createSprite(p,10,50,50);
    water.addImage("water",waterImg);
    water.scale = 0.3;
    water.velocityY = 5
    waterGr.add(water);
   
    water.setCollider("rectangle",0,0,200,300)
  }
}

function water_bar()
{
  image(waterImg,width-250,10,50,50);
  fill("#071750");
  rect(width-200,30,150,30);
  fill("#7DCEEE");
  rect(width-200,30,water_level,30);
  textSize(15);
  fill("blue")
  text(Math.round(water_level) + "%",width-140,53 )

}

function food_bar()
{
  image(space_foodImg,width-250,70,50,30);
  fill("#D5F5E3");
  rect(width-200,70,150,30);
  fill("#52BE80");
  rect(width-200,70,food_level,30);
  textSize(15);
  fill("#145A32")
  text(Math.round(food_level) + "%",width-140,90 )
}

function peacebar()
{
  image(peaceIMg,5,20,40,40);
  fill("white");
  rect(50,30,200,30);
  fill("yellow")
  rect(50,30,peace,30)
  textSize(15);
  fill("red")
  text(Math.round(peace) + "%",135,53 )

}

function shoot()
{
  lazer = createSprite(width/2,height-100-50,50,50);
  lazer.x=spaceship.x;
  lazer.y=spaceship.y-45;
  lazer.addImage("lazer",lazerImg);
  lazer.scale = 0.05;
  lazer.velocityY= -7
  lazerGroup.add(lazer)
 
  lazer.setCollider("rectangle",0,0,900,1200)
}



 function showRank() {
  swal({
    title: `"You WON"`,
    text: "You maintain the peace successfully",
    imageUrl:
      "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize: "100x100",
    confirmButtonText: "Ok"
  });
}

function gameOver() {
  swal({
    title: `Game Over`,
    text: "Oops you lost the challenge....!!!",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Thanks For Playing"
  });
}

function end() {
waterGr.destroyEach();
foodGr.destroyEach();
rockGr.destroyEach();
aleinGr.destroyEach();
bg.velocityY = 0;

}