/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isFalling;
var isRight;
var isPlummeting;
var collectables;
var canyon;
var canyon_1;
var canyon_2;
var treePos_y;
var trees_x;
var clouds_x;
var mountain_x;
var clouds_y;
var mountain_y;
var cameraPosX;
var game_score;
var flagpole;
var lives;
var jumpSound;
var wowSound;
var gameOver;
var coinSound;
var platforms;
var enemies;

// Setup
function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height *3/4;
    lives = 3;
    startGame();
}
// startGame
function startGame()
{
    if(startGame || keyPressed == 66)
    {
        ambient.loop(); // ambient music
    }
    if(lives < 1)
    {
        ambient.stop();
    }
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
    gameChar_width =23;

    isRight = false;
    isLeft = false;
    isFalling = false;
    isPlummeting = false;

    collectables = 
    [
        {x_pos: -301, y_pos: floorPos_y, size: 50, isFound: false},
        {x_pos: -51, y_pos: floorPos_y -116, size: 50, isFound: false},    
        {x_pos: 31, y_pos: floorPos_y, size: 50, isFound: false},
        {x_pos: 282, y_pos: floorPos_y -116, size: 50, isFound: false},
        // {x_pos: 400, y_pos: floorPos_y, size: 50, isFound: false},
        // {x_pos: 600, y_pos: floorPos_y, size: 50, isFound: false},
        {x_pos: 752, y_pos: floorPos_y -201, size: 50, isFound: false},
        {x_pos: 822, y_pos: floorPos_y -136, size: 50, isFound: false},
        {x_pos: 902, y_pos: floorPos_y, size: 50, isFound: false},
        {x_pos: 1302, y_pos: floorPos_y, size: 50, isFound: false},
        {x_pos: 1502, y_pos: floorPos_y -201, size: 50, isFound: false},
        {x_pos: 1602, y_pos: floorPos_y -136, size: 50, isFound: false},
        {x_pos: 1802, y_pos: floorPos_y, size: 50, isFound: false}
    ];

    // draw canyons
    canyon = {x_pos: 0, width:100};
    canyon_1 = {x_pos: 300, width:100};
    canyon_2 = {x_pos: 500, width:200};
    
    // each element represents the position of the tree transverse the 'trees_x'
    trees_x = [250, 800, 900, 1000];
    treePos_y = height/2;

    // array of clouds
    clouds_x = [100, 200, 500, 700, 1000];
    clouds_y = 60;
    
    // array of mountains
    mountain_x = [100, 400];
    mountain_y = 100;
    
    // Declare a variable called `cameraPosX` and initialise it to 0
    cameraPosX = 0;
    game_score = 0;
    
    // Flagpole
    flagpole = {isReached: false, x_pos: 1900};
    gameChar_world_x = 22;    

    //  Platforms
    platforms = [];
    platforms.push(createPlatforms(200, floorPos_y-100, 100));
    platforms.push(createPlatforms(800, floorPos_y-100, 100));
    platforms.push(createPlatforms(200, floorPos_y-100, 100));
    platforms.push(createPlatforms(800, floorPos_y-100, 100));

    // Enemies
    enemies = [];
    enemies.push(new Enemy(1500, floorPos_y-100, 100));
    enemies.push(new Enemy(800, floorPos_y-100, 100));
    enemies.push(new Enemy(-400, floorPos_y-100, 100));
}

// draw
function draw()
{
	///////////DRAWING CODE//////////
    // Scrolling
    cameraPosX = gameChar_x - width/2;
    //fill the sky blue
    c1 = color(255);
    c2 = color(63, 191, 191);
    
    for(let y=0; y<height; y++)
    {
      n = map(y,0,height,0,2);
      let newc = lerpColor(c1,c2,n);
      stroke(newc);
      line(0,y,width, y);
    }
    //draw some green ground
    noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); 
    
    
    push();
    translate(-cameraPosX, 0);
    
    //draw mountains
    for (var i = 0; i < mountain_x.length; i++)
    {        
        fill(30,144,255);
        triangle(mountain_x[i] + 250,mountain_y,mountain_x[i] + 150,mountain_y + 332,mountain_x[i] + 450,mountain_y + 332);
        fill(225);
        triangle(mountain_x[i] + 250,mountain_y,mountain_x[i] + 216,mountain_y + 110,mountain_x[i] + 316,mountain_y + 110);

        
        fill(0,105,225);
        triangle(mountain_x[i] + 350,mountain_y + 190,mountain_x[i] + 250,mountain_y + 332,mountain_x[i] + 450,mountain_y + 332);
        fill(225);
        triangle(mountain_x[i] + 350,mountain_y + 190,mountain_x[i] + 308,mountain_y + 250,mountain_x[i] + 395,mountain_y + 250);
    }

    //draw the trees
    drawTrees();
    
    //draw clouds
    drawClouds();

    // draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    // draw collectables
    for(var i = 0; i < collectables.length; i++)
        {
            if(!collectables[i].isFound)
            {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
            }
        }

	//draw the canyon
    drawCanyon(canyon);
    drawCanyon(canyon_1);
    drawCanyon(canyon_2);
    renderFlagpole();
    checkPlayerDie();

    // play footsteps
    playFootstepsSound();

    //detect when the character is over the canyon
    if((canyon.x_pos + 60 < gameChar_x && gameChar_x < canyon.x_pos + 200 && gameChar_y >= floorPos_y))
    {
        isPlummeting = true;
    }
    if((canyon_1.x_pos + 60 < gameChar_x && gameChar_x < canyon_1.x_pos + 200 && gameChar_y >= floorPos_y))
    {
        isPlummeting = true;
    }
    if((canyon_2.x_pos + 60 < gameChar_x && gameChar_x < canyon_2.x_pos + 200 && gameChar_y >= floorPos_y))
    {
        isPlummeting = true;
    }
   if(isPlummeting == true)
   {
       gameChar_y -= -1;
   }
   
	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        
        //    face
        fill(0,218,185);
        ellipse(gameChar_x - 5,gameChar_y - 50, 24, 26);   
        fill("yellow");
        rect(gameChar_x - 20, gameChar_y, 40, 40) 
        
        //    body
        fill(200,0,150);
        rect(gameChar_x - 14.7,gameChar_y - 38, 30,35, 5);
        //    eye

        fill("yellow");
        ellipse(gameChar_x - 13,gameChar_y - 53, 10, 10);

        fill(0);
        ellipse(gameChar_x - 14,gameChar_y - 53, 5, 5);
    
        //    mouth
        fill(255,0,0);
        ellipse(gameChar_x -15,gameChar_y - 45,4,4);
        
        //foot    
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x +5,gameChar_y - 15, 10, 10);

        //arm
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x - 5, gameChar_y - 35, 10, 10);  

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //    face
        fill(0,218,185);
        ellipse(gameChar_x + 5,gameChar_y - 50, 24, 26);    
    
        //    body
        fill(200,0,150);
        rect(gameChar_x - 14.7,gameChar_y - 38, 30,35, 5);

        //    eye
        fill("yellow");
        ellipse(gameChar_x + 13,gameChar_y - 53, 10, 10);

        fill(0);
        ellipse(gameChar_x + 13,gameChar_y - 53, 5, 5);
    
        //    mouth
        fill(255,0,0);
        ellipse(gameChar_x +15,gameChar_y - 45,4,4);
        
        //foot    
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x -18,gameChar_y - 15, 10, 10);

        //arm
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x - 7, gameChar_y - 35, 10, 10);  

	}
	else if(isLeft)
	{
		// add your walking left code
        
        //    face
        fill(0,218,185);
        ellipse(gameChar_x - 5,gameChar_y - 50, 24, 26);    
    
    
        //    body
        fill(200,0,150);
        rect(gameChar_x - 14.7,gameChar_y - 38, 30,35, 5);
        //    eye
        fill("yellow");
        ellipse(gameChar_x - 13,gameChar_y - 53, 10, 10);

        fill(0);
        ellipse(gameChar_x - 14,gameChar_y - 53, 5, 5);
    
        //    mouth
        fill(0);
        stroke(255,0,0);
        line(gameChar_x - 15,gameChar_y - 45,gameChar_x -13,gameChar_y - 45);
    
        //foot    
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x -3,gameChar_y - 10, 10, 10);

        //arm
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x,gameChar_y - 35, 10, 10);    

	}
	else if(isRight)
	{
		// add your walking right code
        
        //    face
        fill(0,218,185);
        ellipse(gameChar_x + 5,gameChar_y - 50, 24, 26);    
    
        //    body
        fill(200,0,150);
        rect(gameChar_x - 14.7,gameChar_y - 38, 30,35, 5);

        //    eye

        fill("yellow");
        ellipse(gameChar_x + 13,gameChar_y - 53, 10, 10);

        fill(0);
        ellipse(gameChar_x + 13,gameChar_y - 53, 5, 5);
    
        //    mouth
        fill(0);
        stroke(255,0,0);
        line(gameChar_x + 15,gameChar_y - 45,gameChar_x + 13,gameChar_y - 45);
    
        //foot    
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x -3,gameChar_y - 10, 10, 10);

        //arm
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x - 7, gameChar_y - 35, 10, 10);          

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        
        //    body
        fill(200,0,150);
        rect(gameChar_x - 14.7,gameChar_y - 38, 30,35, 5);

        //    face
        fill(0,218,185);
        ellipse(gameChar_x,gameChar_y - 50, 24, 26);
    
        //    eye
        fill("yellow");
        ellipse(gameChar_x - 4,gameChar_y - 53, 10, 10);
        ellipse(gameChar_x + 4,gameChar_y - 53, 10, 10);

        fill(0);
        ellipse(gameChar_x - 4,gameChar_y - 53, 5, 5);
        ellipse(gameChar_x + 4,gameChar_y - 53, 5, 5);
    
        //    mouth
        fill(255,0,0);
        ellipse(gameChar_x,gameChar_y - 45,5,5);
    
        //foot    
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x - 15,gameChar_y - 20, 10, 10);
        rect(gameChar_x + 5,gameChar_y - 20, 10, 10);

        //arm
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x - 20,gameChar_y - 55, 10, 20);
        rect(gameChar_x + 10,gameChar_y - 55, 10, 20);  
        
	}
	else
	{
		// add your standing front facing code
        
        //    body
        fill(200,0,150);
        rect(gameChar_x - 14.7,gameChar_y - 38, 30,35, 5);
        
        //    face
        fill(0,218,185);
        ellipse(gameChar_x,gameChar_y - 50, 24, 26);
        
        //    eye

        fill("yellow");
        ellipse(gameChar_x - 4,gameChar_y - 53, 10, 10);
        ellipse(gameChar_x + 4,gameChar_y - 53, 10, 10);

        fill(0);
        ellipse(gameChar_x - 4,gameChar_y - 53, 5, 5);
        ellipse(gameChar_x + 4,gameChar_y - 53, 5, 5);

        //    mouth
        fill(0);
        stroke(255,0,0);
        line(gameChar_x - 4,gameChar_y - 45,gameChar_x + 4,gameChar_y - 45);
        
        //foot    
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x - 15,gameChar_y - 9, 10, 10);
        rect(gameChar_x + 5,gameChar_y - 9, 10, 10);
        
        //arm
        fill("black");
        stroke(112,128,144);
        rect(gameChar_x - 20,gameChar_y - 35, 10, 10);
        rect(gameChar_x + 10,gameChar_y - 35, 10, 10);    
	}

    
    //// SCREEN DISPLAY ////
    drawLives();
    pop();
    drawGameScore();

    if(lives < 1)
        {
            fill(255,0,0);
            textSize(30);  
            textStyle(BOLD);
            text("Game over. 😩", width/2 -70, height/2);
            text("Press CTRL+R to restart.", width/2 -150, height/2 + 50);
            return;
        }
    
    if(flagpole.isReached == true)
        {
            fill(0);
            textSize(30);
            textStyle(BOLD);
            text("Level complete! 🙌", width/2 -70, height/2);
            text("Press CTRL+R to continue.", width/2 -150, height/2 + 50);
            ambient.stop(); // the music stops when the flagpole is reached
            return;
        }

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
    if(isLeft == true)
    {
            gameChar_x -=5; //move to left
        }
        if(isRight == true)
        {
            gameChar_x +=5; //move to right
        }   
    
        if(isPlummeting == true)
        {
            gameChar_y += 4; // jump
        }
        
        if(gameChar_y < floorPos_y)
        {
            var isContact = false;
            for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_x, gameChar_y) == true)
                        {
                            isContact = true;
                            break;
                        }
                }
            if(isContact == false)
                {
                    gameChar_y +=4;
                }
        }
   
        else
        {
            isFalling = false; 
        }
    checkFlagpole();
    
    // Game Score Text
    fill(0);
    noStroke();
    textSize(25);
    textStyle(BOLD);
    text("score: " + game_score, 20, 35);

    // info text
    fill(0, random(0,220),120);
    noStroke();
    textSize(15);
    textStyle(BOLD);
    text("Press double jump to fly", width*.65, 40);
    text("If you get stars ⭐️, the enemy will move faster!", width*.65, 60);
}

// renderFlagpole(
function renderFlagpole() {
    push();
    strokeWeight(5);
    stroke(0);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 150);

    // Draw the flag
    fill(255);
    noStroke();

    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - random(135,150), random(45,55), 50);
        ellipse(flagpole.x_pos, floorPos_y - 150, 10, 10);
    
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - random(50,60), random(45,55), 50);
        ellipse(flagpole.x_pos, floorPos_y - 150, 10, 10);
    }
    // Add enemies
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();

        var isContact = enemies[i].checkContact(this.gameChar_x, gameChar_y);

        if(isContact)
        {
            if(lives >= 0)
            {
                lives -= 1;
                knifeSound.play();
                startGame();
                break;
            }
        }
    } 

    pop();
}

// checkFlagPole
function checkFlagpole()
{
    var d = abs(gameChar_x - flagpole.x_pos);
    
    if(d < 15)
        {
            flagpole.isReached = true;
            wowSound.play();
        }
}

// checkPlayerDie
function checkPlayerDie()
{
    if(gameChar_y > height)
    {
        dieSound.play();
        lives -= 1;
        isPlummeting == false;
        startGame();
    } 
   if(lives <= 0) startGame();
   if(lives <1)
   {
        gameOver.play();
        ambient.stop();
   }
}

// keyPressed
function keyPressed()
{
    //Freezing controls
    if(!isPlummeting)
    {
        if(keyCode == 65 && !isPlummeting) //left
        {
            footsteps.play();
            isLeft = true;           
        }
        else if(keyCode == 68 && !isPlummeting) //right
        {
            footsteps.play();
            isRight = true;   
        }
        else if((keyCode == 87 && !isFalling) && !isPlummeting) //jump
        {
            gameChar_y = gameChar_y -200;
            jumpSound.play();
        } 
    }
        
}

// keyReleased
function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
    if(keyCode == 65)
    {
        isLeft = false;    
    }
    
    if(keyCode == 68)
    {
        isRight = false;   
    }   
}

// Refactoring clouds
function drawClouds()
{
    for (var i = 0; i < clouds_x.length; i++)
    {   
        fill(255,255,255,100);
        ellipse(clouds_x[i] + 100, clouds_y +90,75,80);
        ellipse(clouds_x[i] + 60, clouds_y +90,30,40);
        ellipse(clouds_x[i] + 150, clouds_y +90,40,40);
    }
}

// drawTrees
function drawTrees() 
{
    for (var i = 0; i < trees_x.length; i++)
    {   
        fill(120,100,40);
        rect(trees_x[i],treePos_y,60,150);
        
        //branch
        fill(0,155,0);
        triangle(trees_x[i] - 50, treePos_y + 50, trees_x[i] + 30, treePos_y - 50, trees_x[i] + 110, treePos_y + 50)
        triangle(trees_x[i] - 50, treePos_y, trees_x[i] + 30, treePos_y - 100, trees_x[i] + 110, treePos_y)
    }    
}

// drawCanyon
function drawCanyon(t_canyon)
{
    fill(63, 191, 191);    
	noStroke();
    quad(t_canyon.x_pos + 60, 432, t_canyon.x_pos + 200, 432, t_canyon.x_pos + 260, 576, t_canyon.x_pos + 120, 576);
    
    fill(128,128,150);
    triangle(t_canyon.x_pos + 200, 432, t_canyon.x_pos + 260, 576, t_canyon.x_pos + 200, 576);

    fill("brown");
    triangle(t_canyon.x_pos + 200 , 481 , t_canyon.x_pos + 234, 575, t_canyon.x_pos + 205, 575);
}

// Draw Collectable
function drawCollectable(t_collectable)
{
    if(t_collectable.isFound == false)
    {
        // Set the x and y position of the star using the t_collectable object
        let x = t_collectable.x_pos + random(-15,15);
        let y = t_collectable.y_pos -15 + random(-5,5);

        // Set the size of the star
        let size = 30;

        // Calculate the points of the star using trigonometry
        let angle = TWO_PI / 5;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * size + random(-5,5);
            let sy = y + sin(a) * size + random(-5,5);
            vertex(sx, sy);
            // strokeWeight(4);
            fill(255, random(0,255),random(0,255));
            stroke(255);
            sx = x + cos(a + angle / 2) * size / 2 + random(-5,5);
            sy = y + sin(a + angle / 2) * size / 2 + random(-5,5);
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }
}

// Check Collectable
function checkCollectable(t_collectable)
{
    // Check if character is intersecting with the t_collectable
    if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 20)
    {
        t_collectable.isFound =  true;
        game_score += 1;
        coinSound.play();
    }
}

// drawLives
function drawLives()
{
    for (var i = 0; i < lives; i++)
    {
        fill(0);
        noStroke();
        textSize(25);
        textStyle(BOLD);
        text("lives: ", gameChar_x -490, 68);
        
        fill(255,0,0);
        ellipse(gameChar_x - 405+30*i, 60, 20);
        noStroke(); 
    }
}

// drawGameScore
function drawGameScore()
{
    fill(0);
    noStroke();
    textSize(25);
    textStyle(BOLD);
    text("score: " + game_score, 20, 35);
}

// createPlatforms
function createPlatforms(x, y, length)
{
    var p = {
        x: x+random(-100,500), // platforms are generated randomly.
        y: y+random(-100,50),
        length: length,
        draw: function(){
            fill(random(150,255), 0, random(0,10));
            stroke(2);
            stroke(255)
            rect(this.x, this.y, this.length, 20);
            },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
        {
            var d = this.y - gc_y;
            if(d >= 0 && d < 5)
                {
                    return true;
                }
        }
            return false;
        }
    }
    
    return p; 
}

// draw enemies
function Enemy(x,y,range)
{
    this.x = x+random(-100,100); // update enemy to be randomly spawn
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 1; // increment and update the enemy's position

    this.update = function()
    {
    // increases the value of the enemy by increment(inc)
   this.currentX += this.inc;

    // When it gets to the range, moves back to -1
    if(this.currentX >= this.x + this.range)
        {
            this.inc = -1 * (game_score+0.4);

        }

        else if(this.currentX < this.x)
        {
            this.inc = 1 * (game_score+0.4); // multiply the enemy's speed when the gameScore increased
        }
    }

    this.draw = function()
    {
        this.update();
        image(img, this.currentX, this.y, 100, 100); // Enemy's update

    }

    this.checkContact = function(gc_x, gc_y)
    {
        // compare the  game character and enemy's distance
        var d = dist(gc_x-80, gc_y-100, this.currentX, this.y)

        if(d < 30)
        {
            return true;
        }
        return false;
    } 
}

// footsteps sounds
function playFootstepsSound() {
    if (keyIsDown(65) || keyIsDown(68) && gameChar_y == floorPos_y) { // 'a' or 'd' keys
      if (!footsteps.isPlaying()) {
        footsteps.loop();
      }
    } else {
      footsteps.stop();
    }
  }

// preload assets
  function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    // flagpole sound
    wowSound = loadSound('assets/wow.mp3');
    wowSound.setVolume(0.1);
    // collectable sound
    coinSound = loadSound('assets/heheboy.mp3');
    coinSound.setVolume(0.5);

    dieSound = loadSound('assets/dieSound.mp3');

    // footsteps sounds
    footsteps = loadSound('assets/footstep.mp3')
    footsteps.setVolume(0.5);

    //ambient music
    ambient = loadSound('assets/ambient.mp3');
    ambient.setVolume(0.1);

    //game over sound
    gameOver = loadSound('assets/gameOver.mp3');
    gameOver.setVolume(0.1);

    knifeSound = loadSound('assets/knifeSound.mp3');
    knifeSound.setVolume(0.5);

    // Enemy image - made in pixel art
    img = loadImage('assets/michael_myers.png');
        
}

