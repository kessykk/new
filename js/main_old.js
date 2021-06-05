

var elem = document.getElementById("gameContainerDiv");
myGamePieceLife = 100;
myGamePieceLifeLine = 0;
obsCount = 0;


var newGamePiece = 'newGamePieceFirst';

window.addEventListener("orientationchange", function(event){
    switch(window.orientation)
    {
        case -90: case 90:{
            window.location.reload();
            break;
          }
        default:
            /* Device is in portrait mode */
    }
});


function openFullscreen(kid) {
  elem = document.getElementById("gameContainerDiv");
  if (elem.requestFullscreen){
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullScreen) { /* Safari */
    elem.webkitRequestFullScreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

  selectAvatar(kid);

  //myGameArea.stop();
  //restart();
  //document.getElementById("fullScreenBtn").style.display = none;
}

function loadGame(){

  document.ondblclick = null;

  clearIntrvlTime = 20;
  myObstacles = [];
  score = 0;

  myGameArea.start();

}

function restart(){
  document.onkeydown = null;
  document.onkeyup = null;

  clearIntrvlTime = 20;
  obsCount = 0;
  myObstacles = [];
  score = 0;
  myGamePieceLife = 100;

  myGameArea.start();
  startGame();

}

function startGame() {

    var bkgrndAudio = document.getElementById("bkgrndAudio");
    bkgrndAudio.play();

    document.getElementById("startMsgDiv").style.display="none";
    document.getElementById("startBtn").style.display="none";
    document.getElementById("restartBtn").style.display="none";
    document.getElementById("attackBtn").style.display="block";


    for(var i = 0; i< 4;i++){
      createNewObstacle(i);
    }
      myObstacles[4] = new componentObstacle(40, 40,  myGameArea.canvas.width, myGameArea.canvas.height/2 , 5, 0, 1, "attack");

}

var myGameArea = {
    canvas : document.getElementById("mainFrame"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, clearIntrvlTime);
        this.interval2 = setInterval(newAttack, 5000);
        this.interval3 = setInterval(boostWeapon, 6000);

        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
        clearInterval(this.interval2);
        clearInterval(this.interval3);
    },
    resume : function(){
      this.interval = setInterval(updateGameArea, clearIntrvlTime);
      this.interval2 = setInterval(newAttack, 5000);
      this.interval3 = setInterval(boostWeapon, 6000);
    }
}

function boostWeapon(){
  if(myGamePieceLife < 75){
    myObstacles[5] = new componentObstacle(61, 61,  myGameArea.canvas.width, 20, 0, 4, 1, "booster");
    myObstacles[6] = new componentObstacle(100, 80,  myGameArea.canvas.width, 0, 0, 4, 1, "boosterVehicle");

    var helicopterAudio = document.getElementById("helicopterAudio");
    helicopterAudio.play();
  }
}

function newAttack(){

  var newRandYPos = getRandomInt(1,4);
  var leftOrRight = 2;

  if(newRandYPos >2){
    leftOrRight = 1;
  }

  newRandYPos = newRandYPos+0.5;
  if(obsCount > 0){
    myObstacles[4] = new componentObstacle(40, 40,  myGameArea.canvas.width, (myGameArea.canvas.height/newRandYPos +20), 5, 0, leftOrRight, "attack");
  }
}

function selectAvatar(kid){
  if(kid == 'first'){
    document.getElementById("newGamePieceFirst").style.display = "block";
    newGamePiece = 'newGamePieceFirst';
  }
  else{
    document.getElementById("newGamePieceSecond").style.display = "block";
    newGamePiece = 'newGamePieceSecond';
  }
  dragItem = document.getElementById(newGamePiece);
  dragItem.style.left = 0+'px';
  dragItem.style.top = 0+'px';
  document.getElementById("overlayDiv").style.display = "none";

  if(obsCount == 0){

    document.getElementById("startMsgDiv").style.display = "block";
    document.getElementById("startBtn").style.display = "block";

  }

//  myGameArea.canvas.width = window.innerWidth;
//  myGameArea.canvas.height = window.innerHeight;
}

function getSrcStr(weapon, leftOrRight){

  var srcStr = "images/png/";
  if(weapon == true){
    srcStr = srcStr+"Weapon";
  }
  else{
    srcStr = srcStr+"Weapon";
  }

  if(leftOrRight == 1){
    srcStr = srcStr+"Left.png";
  }
  else{
    srcStr = srcStr+"Right.png";
  }
  return srcStr;
}

function componentObstacle(width, height, x, y, speedX, speedY, leftOrRight, attack) {

  this.id = 'myObstacle'+obsCount;
  obsCount++;

  this.attack = attack;
  this.shrinkComp = false;

  var srcStr = "images/png/ObsNew";

    if(obsCount % 2 == 0){
      srcStr = srcStr+"Violet";
    }
    else{
        srcStr = srcStr+"Green";
    }

    /*if(leftOrRight == 1){
      srcStr = srcStr+"Left";
    }
    else{
      srcStr = srcStr+"Right";
    }
*/
    srcStr = srcStr+".png";

    //srcStr = "images/png/ObsNewClrd.png";

    this.image = new Image();
    this.image.src = srcStr;


    this.leftOrRight = leftOrRight; //going left =1, going right = 2

    this.width = width;
    this.height = height;
    this.speedX = speedX; //obstacle can move left or right
    this.speedY = speedY;
    this.x = x;
    this.y = y;


  if(this.attack == "attack"){
    if(this.leftOrRight == 1){
      this.x = myGameArea.canvas.width;
      this.speedX = -4;
      this.image.src = "images/png/ObsRedLeft.png";
    }
    else{
      this.x = 0;
      this.speedX = 4;
      this.image.src = "images/png/ObsRedRight.png";
    }

    this.speedY = 0;
  }
  else if(this.attack == "booster"){
    this.speedX = -4;
    this.speedY = 0;
    this.image.src = "images/png/WeaponRight.png";
  }
  else if(this.attack == "boosterVehicle"){
    this.speedX = -4;
    this.speedY = 0;
    this.image.src = "images/png/vehicle.png";
  }
  else if(this.attack == "lifeline"){
    this.speedX = -4;
    this.speedY = 0;
    this.image.src = "images/syringe.png";
  }

    this.update = function(changeImg) {

      ctx = myGameArea.context;
      var srcStr;


      if(changeImg == "defend" && this.image.src.indexOf("Defend") == -1 && this.image.src.indexOf("Red") == -1){
        srcStr = this.image.src.replace("ObsNew","ObsNewDefend");
      }
      else {
        srcStr = this.image.src;
      }
      this.image.src = srcStr;

      var speedX ;
      var leftOrRight;

      if(this.x < 0 || this.x > myGameArea.canvas.width){

        var count = this.id.substr(10,this.id.length);
        if(this.attack == "normal"){
          this.updateCompPos();
        }

      }
      else{
          if(this.attack == "booster" && this.x < myGameArea.canvas.width/2 && this.x > myGameArea.canvas.width/4){
            this.speedX = 0;
            this.speedY = 4;

            var helicopterAudio = document.getElementById("helicopterAudio");
            helicopterAudio.pause();
          }
        ctx.drawImage(this.image,
          this.x,
          this.y,
          this.width, this.height);
        }
    }

    this.updateCompPos = function(){

      var newRandYPos = getRandomInt(2,5);
      newRandYPos =  0//; //newRandYPos * 40;

      var randXPos = getRandomInt(2,8);
      if(randXPos > 5){
        newRandXPos =  randXPos * 100;
        speedX = 2;
        speedY = +1;
        leftOrRight = 2;
      }
      if(randXPos <= 5){
        newRandXPos =  myGameArea.canvas.width;//Math.abs(myGamePiece.x + randXPos * 100);
        speedX = -2;
        speedY = +1;
        leftOrRight = 1;
      }

      if(newRandXPos > myGameArea.canvas.width){
        newRandXPos = Math.abs(myGameArea.canvas.width - newRandXPos);
      }

      this.x = newRandXPos;
      this.y = newRandYPos;
      this.speedX = speedX;
      this.speedY = speedY;
      this.leftOrRight = leftOrRight;
      this.width = 81;
      this.height = 81;

      var srcStr = "images/png/ObsNew";

      var count = this.id.substr(10,this.id.length);

        if(count % 2 == 0){
          srcStr = srcStr+"Violet";
        }
        else{
            srcStr = srcStr+"Green";
        }

      /*  if(leftOrRight == 1){
          srcStr = srcStr+"Left";
        }
        else{
          srcStr = srcStr+"Right";
        }
*/
        srcStr = srcStr+".png";


        //srcStr = "images/png/ObsNewClrd.png";
        this.image.src = srcStr;

    }



    this.changeImg = function(changeImg){

      var srcStr ;
      if(changeImg == false && this.image.src.indexOf("Defend") != -1){
        srcStr = this.image.src.replace("ObsNewDefend","ObsNew");
      }
      this.image.src = srcStr;
    }

    this.grow = function() {
      ctx = myGameArea.context;

        ctx.drawImage(this.image,
          this.x - 50,
          this.y - 50,
          this.width + 50, this.height+50);

    }

    this.newPos = function() {
          this.x += this.speedX;
          this.y += this.speedY;

          if(this.shrinkComp == true){
            if(this.width > 0){
              this.width = this.width - 5;
              this.height = this.height - 5;

              if(this.attack == "booster"){
                this.x = this.x + 2;
                this.y = this.y + 2;
              }
            }
            else{
              this.shrinkComp = false;
              if(this.attack == "normal"){
                this.updateCompPos();
              }
            }
          }
      }



      this.shrink = function(){

      if(this.attack == "normal" || this.attack == "attack"){
        console.log(this.id+" "+this.attack+score);
        score = score + 5;
      }

      if(score == 100){
        myGameArea.stop();
        myGamePieceLifeLine = 3;
        document.getElementById("lifeLineDiv").style.display = "block";
        document.getElementById("selectedKid").src = document.getElementById(newGamePiece).src;

        var element = document.getElementById("winnerPrize");
        element.classList.add("winnerFirstAnim");
        var backgroundAudio = document.getElementById("bkgrndAudio");

        setTimeout(function(){

          var element = document.getElementById("selectedKid");
          element.classList.remove("winnerFirstPainAnim");
          element.classList.add("winnerFirstPainAnim");

          backgroundAudio.pause();

          var painAudio = document.getElementById("painAudio");
          painAudio.play();

        },2000);



        setTimeout(function(){

          backgroundAudio.play();

          var element = document.getElementById("selectedKid");
          element.classList.remove("winnerFirstPainAnim");
          document.getElementById("lifeLineDiv").style.display = "none";
          clearIntrvlTime = 20;
          myGameArea.resume()
        }, 3000);

      }
      else if (score == 150){

        myGameArea.stop();

        document.getElementById("prizeMsgDiv").innerHTML = "Here is your second dose. You can now enjoy the world.";
        document.getElementById("lifeLineDiv").style.display = "block";
        document.getElementById("selectedKid").src = document.getElementById(newGamePiece).src;

        var element = document.getElementById("winnerPrize");
        element.classList.add("winnerFirstAnim");

        setTimeout(function(){
          var element = document.getElementById("selectedKid");
          element.classList.add("winnerFirstPainAnim");
          var painAudio = document.getElementById("painAudio");
          painAudio.play();
        },2000);



        setTimeout(function(){

          document.getElementById("lifeLineDiv").style.display = "none";
          var element = document.getElementById("selectedKid");
          element.classList.remove("winnerFirstPainAnim");
          clearIntrvlTime = 20;
          myGameArea.clear();
          myGameArea.stop();
          document.getElementById("attackBtn").style.display = "none";
          if(newGamePiece == "newGamePieceFirst"){
            document.getElementById(newGamePiece).src = "images/png/kid1noweapon.png";
          }
          else{
            document.getElementById(newGamePiece).src = "images/png/kid2noweapon.png";
          }
          document.getElementById("successWorld").style.display = "block";

        }, 5000);

        //
      }
      this.shrinkComp = true;







        //if(this.width <= 20){
          //obsCount--;
          //var count = this.id.substr(10,this.id.length);
          //createNewObstacle(count);

        //  this.updateCompPos();

      //  }
      //  else{
        //  this.width = this.width-20;
        //  this.height = this.height-20;
        //  this.x = this.x + 10;
        //  this.y = this.y + 10;
      //  }
      }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNewObstacle(count){

  var newRandYPos = getRandomInt(2,4);
  newRandYPos = 0;// newRandYPos * 40;

  var speedX;
  var leftOrRight;
  var newRandXPos;


  var randXPos = getRandomInt(2,10);
  if(randXPos > 5){
    newRandXPos =  randXPos * 100;
    speedX = 2;
    speedY = 1;
    leftOrRight = 2;
  }
  if(randXPos <= 5){
    newRandXPos = myGameArea.canvas.width;//Math.abs(myGamePiece.x + randXPos * 100);
    speedX = -2;
    speedY = -1;
    leftOrRight = 1;
  }

  if(newRandXPos > myGameArea.canvas.width){
    newRandXPos = Math.abs(myGameArea.canvas.width - newRandXPos);
  }

  myObstacles[count] = new componentObstacle(81, 81,  newRandXPos, newRandYPos,speedX,speedY, leftOrRight, "normal");
}

function updateGameArea() {

  ctx = myGameArea.context;


  myGameArea.clear();
  //myGamePiece.newPos();
  //myGamePiece.update(myGamePiece.image.src);

      myObstacles.forEach(function(myObstacleTemp,i , temp){

      temp[i].newPos();
      temp[i].update("normal");

      ctx.font = "1em Comic Sans MS";
      ctx.fillStyle = "YELLOW";
      ctx.textAlign = "center";
      ctx.fillText("SCORE : "+score, myGameArea.canvas.width - 100, 30);
      ctx.fillText("Sanitiser level : ", 130, 30);
      if(myGamePieceLife >60){
        ctx.fillStyle = "#28a745";
        ctx.fillRect(200, 20, 100, 10);
      }
      else if(myGamePieceLife > 20){
        ctx.fillStyle = "#ffc107";
        ctx.fillRect(200, 20, 50, 10);
        ctx.fillStyle = "#b7c0b9";
        ctx.fillRect(250, 20, 50, 10);
      }
      else{
          ctx.fillStyle = "#dc3545";
          ctx.fillRect(200, 20, 25, 10);
          ctx.fillStyle = "#b7c0b9";
          ctx.fillRect(225, 20, 75, 10);
      }

    });






  var x = document.getElementById(newGamePiece).style.left;
  x = parseInt(x.substr(0,x.length-2));
  var y = document.getElementById(newGamePiece).style.top;
  y = parseInt(y.substr(0,y.length-2));

  var gamePieceXPos = x;
  var gamePieceYPos = y + 20;

  myObstacles.forEach(function(myObstacleTemp, i , temp){

    if((temp[i].attack == "booster") && ((temp[i].x > gamePieceXPos || temp[i].x+ 31 > gamePieceXPos) && temp[i].x < gamePieceXPos+40)
    && ((temp[i].y > gamePieceYPos || temp[i].y+ 41 > gamePieceYPos) && temp[i].y < gamePieceYPos+110)){


      var element = document.getElementById("newGamePieceDiv");
      element.classList.remove("newGamePieceDivAnim");
      element.classList.add("newGamePieceDivAnim");

      var boosterAudio = document.getElementById("boosterAudio");
      boosterAudio.play();


      myGamePieceLife = myGamePieceLife + 50;
      temp[i].shrink();


    }

     if(obsCount> 0 && temp[i].height > 1 && ((temp[i].attack == "normal" && ((temp[i].x > gamePieceXPos || temp[i].x +81 > gamePieceXPos)  && temp[i].x < gamePieceXPos+50))
      && ((temp[i].y > gamePieceYPos || temp[i].y+81 > gamePieceYPos ) && temp[i].y < gamePieceYPos+110)) ||

       ((temp[i].attack == "attack") && ((temp[i].x > gamePieceXPos || temp[i].x+ 31 > gamePieceXPos) && temp[i].x < gamePieceXPos+40)
       && ((temp[i].y > gamePieceYPos || temp[i].y+ 41 > gamePieceYPos) && temp[i].y < gamePieceYPos+110))

    || myGamePieceLife <= 0 ){

      if(myGamePieceLifeLine > 0){
        temp[i].updateCompPos();
        myGamePieceLifeLine--;
      }
      else{
       document.onkeydown = null;
       document.onkeyup = null;

      myGameArea.clear();

      var bkgrndAudio = document.getElementById("bkgrndAudio");
      bkgrndAudio.pause();

      var helicopterAudio = document.getElementById("helicopterAudio");
      helicopterAudio.pause();

      var gameOverAudio = document.getElementById("gameOverAudio");
      gameOverAudio.play();

      if(myGamePieceLife <= 0){
        ctx.font = "1em Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Sanitiser exhausted", myGameArea.canvas.width/2, 40);
      }

      ctx.font = "1.2em Comic Sans MS";
      ctx.fillStyle = "green";
      ctx.fillText("You scored "+score+" points", myGameArea.canvas.width/2, 60);

      document.getElementById("restartBtn").style.display="block";
      document.getElementById("attackBtn").style.display="none";


      myGameArea.stop();

      return;
      }
    }

    });

}


var dragItem = document.getElementById(newGamePiece);
dragItem.style.left = 0+'px';
dragItem.style.top = 0+'px';

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;


function dragStart(e) {

  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  dragItem.style.left = currentX+'px';
  dragItem.style.top = currentY+'px';


  active = false;
}

function drag(e) {
  if (active) {

    e.preventDefault();

    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    if(currentX < 0){
      currentX = 0;
    }else if (currentX > myGameArea.canvas.width-60){
      currentX = myGameArea.canvas.width-60;
    }

    if(currentY < 0){
      currentY = 0;
    }else if (currentY > myGameArea.canvas.height-110){
      currentY = myGameArea.canvas.height-110;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, dragItem);
  }

  dragItem.style.left = currentX+'px';
  dragItem.style.top = currentY+'px';

}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}



function drawLinesToAttack(){

  var x = document.getElementById(newGamePiece).style.left;
  x = parseInt(x.substr(0,x.length-2));
  var y = document.getElementById(newGamePiece).style.top;
  y = parseInt(y.substr(0,y.length-2));

  var initialPointX =  x;//myGamePiece.x;
  var initialPointY = y;//myGamePiece.y;

  var lineStartX;
  var lineStartY;

  var lineEndX;
  var lineEndY;

    lineStartX = 55;
    lineStartY = 60;

    lineEndX = 275;


var sprayImg = new Image();
sprayImg.src = "images/png/yellowSpray.png";

ctx.drawImage(sprayImg,
  initialPointX+60,
  initialPointY-25,
  100, 100);
}

function attackObstacle(){
  var x = document.getElementById(newGamePiece).style.left;
  x = parseInt(x.substr(0,x.length-2));
  var y = document.getElementById(newGamePiece).style.top;
  y = parseInt(y.substr(0,y.length-2));

  var gamePiecePosX = x;
  var gamePiecePosY = y;

  myGamePieceLife--;

  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.strokeStyle = "WHITE";
  ctx.setLineDash([5, 3]);

  clearIntrvlTime = 1000;

  drawLinesToAttack();

  myObstacles.forEach(function(myObstacleTemp,i , temp){

    if(temp[i].x > gamePiecePosX && temp[i].x - gamePiecePosX < 220 &&
       Math.abs(temp[i].y - gamePiecePosY) < 130){

        if(temp[i].attack == "normal" || temp[i].attack == "attack"){
          temp[i].update("defend");
          console.log("temp[i]  "+i);
          temp[i].shrink();
        }

        var shrinkObstacleAudio = document.getElementById("shrinkObstacle");
        shrinkObstacleAudio.play();
      }

    });

    clearIntrvlTime = 20;
}

function clearmove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}
