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
let cursors;
let player;

let physics;
let player1Score = 0;
let player2Score = 0;
let player1ScoreText;
let player2ScoreText;
let playerWhoOne = 0;
let gameScene;
let maxVelocity = 200;

let pointer;
let text;
let shootPlayerOne;
let shootPlayerTwo;
let shootPlayerOneMarine;
let shootPlayerTwoMarine;

let canFire1 = true;
let canFire2 = true;
let player1;
let player1Marine;
let player2;
let player2Marine;

let gameOver = false;
let mainScene;
let introText = 
`We have engaged the enemy in all out war.
Our only problems are that our troops are 
not trained, our guns are too heavy for us
to move and our big guns cannot hurt 
the enemy heavy gunner. We must shoot 
our own troops for them to fire their 
small guns at the enemy's heavy gunner.
Small troops will block each others shots.
Big guns cannot damage small troops either. 
The enemy is also controlled by a human 
and in the exact same predicament.

Heavy Gunner 1: 
Aim with Left and Right Arrows
Fire with Up Arrow

Heavy Gunner 2:
Aim with A and D
Fire with W

Click Left Mouse Button to Begin!`

class MyScene extends Phaser.Scene {
    
    constructor() {
        super('main');
        
        this.bouncy = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'playerOne', 'assets/BigMan.png');
        this.load.image( 'playerOneMarine', 'assets/SpaceMarin.png' );
        this.load.image( 'playerTwo', 'assets/ArmouredBigMan.png');
        this.load.image( 'playerTwoMarine', 'assets/BadGuy.png' );
        this.load.image( 'blueLaser', 'assets/blueLaserOne.png' );
        this.load.image( 'redLaser', 'assets/redLaserOne.png' );
        this.load.image('ground', 'assets/Ground.png');


        this.load.audio('laserSound', 'assets/laserSound.wav'); 
        this.load.audio('bigLaserSound', 'assets/bigLaser.wav');     
    }
    
    create() {

        gameScene = this;
        physics = this.physics;
        mainScene = this;
        canFire1 = true;
        canFire2 = true;
        cursors = this.input.keyboard.addKeys(
            {left2:Phaser.Input.Keyboard.KeyCodes.A,
            right2:Phaser.Input.Keyboard.KeyCodes.D,
            up2:Phaser.Input.Keyboard.KeyCodes.W,
            left:Phaser.Input.Keyboard.KeyCodes.LEFT,
            right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:Phaser.Input.Keyboard.KeyCodes.UP});
        
        player1Score = 0;
        player2Score = 0;

        let laserSound = this.sound.add('laserSound', {volume:0.7});
        let bigLaserSound = this.sound.add('bigLaserSound', {volume:0.7});
        

        let bg = this.add.image(400,400,'ground'); //bg
        bg.setScale(2.8);

        player1 = physics.add.image(400,525,'playerOne');
        player1.setScale(0.4,0.4);
        player2 = physics.add.image(400,75,'playerTwo');
        player2.setScale(0.4,0.4);
        player2.angle = 180;

        player1Marine = physics.add.image(400,375,'playerOneMarine');
        player1Marine.setScale(0.35,0.35);
        player2Marine = physics.add.image(400,225,'playerTwoMarine');
        player2Marine.setScale(0.35,0.35);
        player2Marine.angle = 180;

        player1Marine.setVelocityX(maxVelocity);
        player2Marine.setVelocityX(-maxVelocity);


        //var style = { font: "20px", fill: '#ffff', align: "center" };
        //player1ScoreText = this.add.text(50, 550, "Points: " + player1Score,style);
        //player2ScoreText = this.add.text(650,50, "Points: " + player2Score,style);
        /*  
        this.input.mouse.disableContextMenu();
        this.input.on('pointerup', function(pointer)
        {
            if (pointer.leftButtonReleased())
            {
            }
        })
        const reset = () =>
        {
            mainScene.scene.start('main');
        }*/

        const killPlayer2 = (laser, player2) =>
        {
            laser.disableBody(true,true);
            player2.disableBody(true,true);
            player1Score++;
            winGame();
        }

        const killPlayer1 = (laser, player1) =>
        {
            laser.disableBody(true,true);
            player1.disableBody(true,true);
            player2Score++;
            winGame();
        }

        shootPlayerOne = () =>
        {
            if(canFire1)
            {
                bigLaserSound.play();
                let blueLaser = physics.add.image(400,525,'blueLaser');
                blueLaser.setVelocity(player1.angle*4, -200);
                canFire1 = false;
                blueLaser.angle = player1.angle;
                blueLaser.setScale(1.5);

                physics.add.overlap(blueLaser, player1Marine, shootPlayerOneMarine, null, this);
                setTimeout(()=>{
                    canFire1 = true;
                    //reloadSound.play();
                }, 1000);
            }
        }

        shootPlayerOneMarine = (blueLaserCollision,marine) =>
        {
            blueLaserCollision.disableBody(true,true);
            laserSound.play();
            let blueLaser = physics.add.image(player1Marine.x,player1Marine.y,'blueLaser');
            blueLaser.setVelocity(player1Marine.angle*2, -200);
            blueLaser.angle = player1Marine.angle;
            blueLaser.setScale(0.75);
            physics.add.overlap(blueLaser, player2, killPlayer2, null, this);
            physics.add.overlap(blueLaser, player2Marine, blockLaser, null, this);
        }

        shootPlayerTwoMarine = (redLaserCollision, marine) =>
        {
            redLaserCollision.disableBody(true,true);
            laserSound.play();
            let redLaser = physics.add.image(player2Marine.x,player2Marine.y,'redLaser');
            let angle = player2Marine.angle > 0 ? -(player2Marine.angle - 180) + 10 : -(player2Marine.angle + 180) - 10;
            redLaser.setVelocity((angle)*4, 200);
            redLaser.angle = player2Marine.angle;
            redLaser.setScale(0.75);
            physics.add.overlap(redLaser, player1, killPlayer1, null, this);
            physics.add.overlap(redLaser, player1Marine, blockLaser, null, this);
        }

        shootPlayerTwo = () =>
        {
            if(canFire2)
            {
                bigLaserSound.play();
                let redLaser = physics.add.image(400,75,'redLaser');
                let angle = player2.angle > 0 ? -(player2.angle - 180) + 10 : -(player2.angle + 180) - 10;
                redLaser.setVelocity((angle)*4, 200);
                canFire2 = false;
                redLaser.angle = player2.angle;
                redLaser.setScale(1.5);

                physics.add.overlap(redLaser, player2Marine, shootPlayerTwoMarine, null, this);
                setTimeout(()=>{
                    canFire2 = true;
                    //reloadSound.play();
                }, 1000);
            }
        }

        const blockLaser = (laser, marine) =>
        {
            laser.disableBody(true,true);
        }

        function winGame()
        {
            if(player1Score == 1)
            {
                playerWhoOne = 1;
                setTimeout(()=>{
                    gameScene.scene.start('win');
                }, 1000); 
            }
            else if(player2Score == 1)
            {
                playerWhoOne = 2;
                setTimeout(()=>{
                    gameScene.scene.start('win');
                }, 1000);
            }
            /*
            else 
            {
                setTimeout(()=>{
                    gameScene.scene.start('main');
                }, 1000);
            }*/
        }
    }
    
    update() 
    {
        if(cursors.left.isDown)
        {
            if(player1.angle < -92)
            {
                player1.angle += 7;
            }
            else player1.angle -= 1;
        } 
        else if (cursors.right.isDown)
        {
            if(player1.angle > 92)
            {
                player1.angle -= 7;
            }
            else player1.angle += 1;
        }

        if(cursors.up.isDown && canFire1)
        {
            shootPlayerOne();
            //shootPlayerOneMarine();
        }

        if(player1Marine.x >= 800)
        {
            player1Marine.setVelocityX(-maxVelocity);
        }

        if(player1Marine.x <= 0)
        {
            player1Marine.setVelocityX(maxVelocity);
        }

        player1Marine.angle += 2;
/////////////////////////////////////////////////////////////////
        if(cursors.left2.isDown)
        {
            let angle = player2.angle>0?player2.angle : -player2.angle; 
            if(angle < 90)
            {
                player2.angle -= 10;
            }
            else player2.angle += 1;
        } 
        else if (cursors.right2.isDown)
        {
            let angle = player2.angle>0?player2.angle : -player2.angle;
            if(angle <= 90)
            {
                player2.angle += 10;
            }
            else player2.angle -= 1;
        }

        if(cursors.up2.isDown && canFire2)
        {
            shootPlayerTwo();
            //shootPlayerTwoMarine();
        }

        if(player2Marine.x >= 800)
        {
            player2Marine.setVelocityX(-maxVelocity);
        }

        if(player2Marine.x <= 0)
        {
            player2Marine.setVelocityX(maxVelocity);
        }
        player2Marine.angle += 2;
        
    }
}

class Win extends Phaser.Scene
{
    constructor() {
        super('win');
    }

    preload() {
        this.load.image('bigun','assets/bigun.jfif');
    }

    create()
    {
        cursors = this.input.keyboard;
        let style2 = { font: "38px Papyrus", fill: '#fff', align: "center" };
        let win = this.add.image(400,525,'bigun');
        win.setScale(1.1);
        var newText = this.add.text(100, 300, '',style2);
        newText.setText(`Player ${playerWhoOne} Wins`);

        let style3 = { font: "20px Papyrus", fill: '000', align: "center" }
        var newText2 = this.add.text(500, 50, '',style3);
        newText2.setText(`Click LMB to Fight Again`);
        this.input.on('pointerdown', () => {
            this.scene.start('main') 
        });
    }
}

class Intro extends Phaser.Scene
{
    constructor() {
        super('intro');
    }

    preload() {
        this.load.image('intro','assets/intro.jpg');
        this.load.audio('song', 'assets/bass.mp3');
    }

    create()
    {
        var music = this.sound.add('song', {volume:0.6})
        music.play();
        let start = this.add.image(410,400,'intro');
        start.setScale(0.8);
        cursors = this.input.keyboard;
        let style3 = { font: "25px", fill: '#FFFF00', align: "left" };
        text = this.add.text(100, 50,introText,style3);

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
    scene: [Intro,MyScene, Win],
    physics: { default: 'arcade' },
    });
