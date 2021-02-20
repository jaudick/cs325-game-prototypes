import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var timeEvent;
var text;
var cursors;
var employees;
var timer;
var currentTime;
var timerText;
var doSwitch = false;
var xRandom = 1;
var xResult = 1;
var firedCycle = 0;
var yellText;
var lastInputWasRight = true;
var gameOverBool = false;
var musicAlreadyPlaying = false;
var firedOptions = 
[
    "You are fired!", 
    "I've said it once and I'll say it again,\nfired, thats what you are!",
    "Good evening! You are fired!",
    "Hi there! Just letting you know\nthat you're fired!",
    "It's that time of the month,\nyou are fired!",
    "Forget the paycheck, how about being\nfired instead!",
    "Looking forward to getting fired today!",
    "Lovely day to get fired!",
    "I'm excited to say\nthat you no longer have a job!",
    "Happy Birthday Jim\nyour present is getting fired!"
]

var introText = "It's the end of the month again. We need to make budget cuts\nfor the Space Coporation." 
    + " Fire as many employees as possible\non the asteroid mining facility. Do not get hit by the " 
    + "asteroids\nor you will die instantly.\n\nMove with the left arrow and right arrow keys.\nJump with the up arrow key."
    + "\nUse your downward booster with the down arrow key.\n"
    + "Touch an employee to fire them.\n\n"
    + "There isn't much time left till the end of the month.\nFire as many employees before time runs out.\n"
    + "The fate of the company is in your hands. Fire them all."
    + "\n\nClick the screen with left mouse to begin.";

class MyScene extends Phaser.Scene {
    constructor() {
        super('main');
        this.player = undefined;
        this.bouncy = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'logo', 'assets/phaser.png' );
        this.load.image('space','assets/space.jpg');
        this.load.image('platform','assets/plateforme0.png');
        this.load.image('asteroid', 'assets/asteroid2.png');
        this.load.spritesheet('astroWhite', 'assets/astronautwhite.png', {frameWidth: 29, frameHeight: 37});
        this.load.audio('theme', [
            'assets/Billions_of_Lightyears.mp3'
        ]);
        this.load.audio('hit', 'assets/hit.wav')
        this.load.audio('collect', 'assets/collect.wav')
        //this.load.spritesheet('redAstro', 'assets/astronaut3.png', {frameWidth: 29, frameHeight: 37});
    }
    
    create() {
        gameOverBool = false;
        var hit = this.sound.add('hit');
        var collect = this.sound.add('collect');
        if(!musicAlreadyPlaying)
        {
            var music = this.sound.add('theme');
            musicAlreadyPlaying = true
            music.play();
        }
        timer = 0;
        cursors = this.input.keyboard.createCursorKeys(); //input

        //order matters
        var bg = this.add.image(400,400,'space'); //bg
        var platforms = this.physics.add.staticGroup();
        platforms.create(0,568, 'platform');
        platforms.create(400,568, 'platform');
        platforms.create(800,568, 'platform');
        platforms.create(600,400, 'platform');
        platforms.create(50,250, 'platform');
        platforms.create(750,220, 'platform');

        //player
        this.player = this.physics.add.sprite(100,450,'whiteAstro');
        this.player.setBounce(0.0);
        this.player.body.setGravityY(200);
        this.physics.add.collider(this.player,platforms);
        this.physics.world.wrap(this.player);

        employees = this.physics.add.group({ //creates one child auto so repeat 11 is 12
            key:'astroWhite', //key image
            repeat: 2, //12 time
            setXY: {x:200,y:Math.floor(Math.random() * 800) + 1,stepX:200} //start at 12 seperate each one by 70
        });

        employees.children.iterate(function (emp) {
            emp.setGravityY(300);
            emp.setBounce(0.7)
            emp.setTint(0xff0000);
        });

        this.physics.add.collider(employees,platforms);
        //creating animation and labeling it
        //-1 loops it
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('astroWhite', {start:0,end:2}),
            frameRate:10,
            repeat:-1
        });

        //one frame animation
        this.anims.create({
            key:'stationaryLeft',
            frames:[{key:'astroWhite', frame:2}],
            framerate:20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('astroWhite', {start:3, end:5}),
            frameRate: 10,
            repeat:-1
        });

        //one frame animation
        this.anims.create({
            key:'stationaryRight',
            frames:[{key:'astroWhite', frame:3}],
            framerate:20
        });
        

        this.physics.add.overlap(this.player, employees, fireTheEmployee, null, this);
        var style = { font: "12px Verdana", fill: "#84D9E5", align: "center" };
        yellText = this.add.text(0,0,'I must save the company!', style);

        //bad guys
        var asteroids = this.physics.add.group({
            key:'asteroid', //key image
            repeat: 5, //12 time
            setXY: {x:40,y:Math.floor(Math.random() * 400) + 20,stepX:150} //start at 12 seperate each one by 70
        });

        this.physics.add.collider(this.player,asteroids, hitAsteroid, null, this);
        setAsteroidVelocity();

        function fireTheEmployee(player,employee)
        {
            collect.play();
            employee.y = 1200;
            score++;
            scoreText.setText('Employees Fired: ' + score);
            yellText.setText(firedOptions[firedCycle]);
            firedCycle++;
            firedCycle = firedCycle >= firedOptions.length ? 0 : firedCycle;

            setAsteroidVelocity();
        }

        function setAsteroidVelocity()
        {
            asteroids.children.iterate(function (asteroid) {
                asteroid.setBounce(0.5);
                asteroid.setCollideWorldBounds(true);
                asteroid.setVelocityX((Phaser.Math.Between(-10,10) + 1) * 25);
                asteroid.setVelocityY((Phaser.Math.Between(-10,10) + 1) * 25);
            });
        }

        //score
        //let style = { font: "32px Verdana", fill: "#84D9E5", align: "center" };
        var scoreText = this.add.text(16,32,'Employees Fired: 0');
        var score = 0;

        function hitAsteroid(player,asteroid)
        {
            hit.play();
            gameOverBool = true;
            //this.physics.pause();
            this.player.setTint(0xff0000);
            //player.anims.play('turn');
            this.physics.pause();
            timeEvent = this.time.delayedCall(2000, gameOver, [], this);
            var style = { font: "40px Verdana", fill: "#84D9E5", align: "center" };
            var endText = this.add.text(200,300,'Employees Fired: ' + score, style);
            //music.stop();
        }

        function gameOver()
        { 
            this.scene.start('main');
        }

        timeEvent = this.time.delayedCall(10000 * 60, hitAsteroid, [], this);
        text = this.add.text(550, 32);
        //timerText = this.add.text(300, 32);

        function gameOver() //game over
        {
            this.scene.start('main');
        }
    }

    update() {

        //timerText.setText(timer.toString())

        if(timer%50==0)
        employees.children.iterate(function (child) 
        {
            var x = (Math.random() * 100) + 1;    
            child.setVelocityY(x);
        });
        if(timer%100==0) {
            timer = 0;
            employees.children.iterate(function (child) 
            {
                var x = (Math.random());    
                var y;
                if(x < 0.5)
                {
                    y = -x*200;
                    child.anims.play('left',true)
                }
                else
                {
                    y = x*200;
                    child.anims.play('right',true)
                }
                child.setVelocityX(y);
            })
        };
        timer++;

        employees.children.iterate(function (child)
        {
            if(child.x < 0) 
            {
                child.x = 800
            }

            if(child.x > 800) 
            {
                child.x = 0
            }

            if(child.y > 750) 
            {
                child.y = 0
            }
        });
        

        ///////////////////////////////fired text ///////////////////////////////////////////
        yellText.x = this.player.x - 100;
        yellText.y = this.player.y - 40;

        if(!gameOverBool)
            text.setText('Time Till\nEnd of the Month: ' + (100 - timeEvent.getProgress()*100*6).toString().substr(0, 5));
        if(this.player.x < 0) 
        {
            this.player.x = 800
        }

        if(this.player.x > 800) 
        {
            this.player.x = 0
        }

        if(this.player.y > 750) 
        {
            this.player.y = 0
        }
        if(cursors.left.isDown)
        {
            this.player.setVelocityX(-250);
            this.player.anims.play('left',true)
            lastInputWasRight = false;
        } 
        else if (cursors.right.isDown)
        {
            this.player.setVelocityX(250);
            this.player.anims.play('right',true);
            lastInputWasRight = true;
        }
        else{
            this.player.setVelocityX(0);
            if(lastInputWasRight)
                this.player.anims.play('stationaryRight',true);
            else
            this.player.anims.play('stationaryLeft',true);
        }

        if (cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-400);
            this.player.anims.play('stationaryRight',true);
        }

        if (cursors.down.isDown)
        {
            this.player.setVelocityY(400);
            this.player.anims.play('stationaryRight',true);
        }
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
    }
}

class InputScene extends Phaser.Scene
{
    constructor() {
        super('input');
    }

    preload() {
        // Load an image and call it 'logo'.
        this.load.image('space','assets/space.jpg');
    }

    create()
    {
        var space = this.add.image(400,400,'space');
        cursors = this.input.keyboard;
        text = this.add.text(100, 225);
        text.setText(introText);

        this.input.on('pointerdown', () => {
            this.scene.start('main') 
        });
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:300},
            debug: false
        }
    },
    scene: [InputScene, MyScene],
    physics: { default: 'arcade' },
    });
