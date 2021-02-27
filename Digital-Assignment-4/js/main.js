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
var score = 0;
let gameScene;

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
`Pirate Bob has done it again! He's gotten wasted on the rum. 
Now we need to save him from the orcs!
We don't know why there are orcs on a tropical island, 
but we don't have time to ask questions!
Click with the Left Mouse button on a fire button to fire!
You can only fire a cannon once every 2 seconds. 
Switch between cannons to maximize firepower!
There are 5 orc waves ahead! Save Pirate Bob!

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


        //this.load.audio('reload', 'assets/reload.mp3');      
    }
    
    create() {

        gameScene = this;
        score = 0;
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

        //let cannonSound = this.sound.add('cannonSound', {volume:0.7});
        

        let bg = this.add.image(400,400,'ground'); //bg
        bg.setScale(2.8);

        player1 = physics.add.image(400,525,'playerOne');
        player1.setScale(0.4,0.4);
        player2 = physics.add.image(400,75,'playerTwo');
        player2.setScale(0.4,0.4);
        player2.angle = 180;

        player1Marine = physics.add.image(400,350,'playerOneMarine');
        player1Marine.setScale(0.35,0.35);
        player2Marine = physics.add.image(400,250,'playerTwoMarine');
        player2Marine.setScale(0.35,0.35);
        player2Marine.angle = 180;

        player1Marine.setVelocityX(75);
        player2Marine.setVelocityX(-75);


        var style = { font: "30px Arial", fill: '0000', align: "center" };
        text = this.add.text(50, 50, '',style);





        
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
        }

        

        //physics.add.overlap(bob, orcs, killBob, null, this);

        let textStyle = { font: "30px Papyrus", fill: '#fff', align: "center" };


        shootPlayerOne = () =>
        {
            if(canFire1)
            {
                let blueLaser = physics.add.image(400,525,'blueLaser');
                blueLaser.setVelocity(player1.angle*4, -200);
                canFire1 = false;
                setTimeout(()=>{
                    canFire1 = true;
                    reloadSound.play();
                }, 1500);
            }
        }

        shootPlayerOneMarine = () =>
        {
            let blueLaser = physics.add.image(player1Marine.x,player1Marine.y,'blueLaser');
            blueLaser.setVelocity(player1Marine.angle*2, -200);
        }

        shootPlayerTwoMarine = () =>
        {
            let redLaser = physics.add.image(player2Marine.x,player2Marine.y,'redLaser');
            let angle = player2Marine.angle > 0 ? -(player2Marine.angle - 180) + 10 : -(player2Marine.angle + 180) - 10;
            redLaser.setVelocity((angle)*4, 200);
        }

        shootPlayerTwo = () =>
        {
            if(canFire2)
            {
                let redLaser = physics.add.image(400,75,'redLaser');
                let angle = player2.angle > 0 ? -(player2.angle - 180) + 10 : -(player2.angle + 180) - 10;
                redLaser.setVelocity((angle)*4, 200);
                canFire2 = false;
                setTimeout(()=>{
                    canFire2 = true;
                    reloadSound.play();
                }, 1500);
            }
        }

        function winGame()
        {
            //gameScene.scene.start('win');
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
            shootPlayerOneMarine();
            console.log('up');
        }

        if(player1Marine.x >= 800)
        {
            player1Marine.setVelocityX(-75);
        }

        if(player1Marine.x <= 0)
        {
            player1Marine.setVelocityX(75);
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
            console.log(angle)
        } 
        else if (cursors.right2.isDown)
        {
            let angle = player2.angle>0?player2.angle : -player2.angle;
            if(angle <= 90)
            {
                player2.angle += 10;
            }
            else player2.angle -= 1;
            console.log(angle)
        }

        if(cursors.up2.isDown && canFire2)
        {
            shootPlayerTwo();
            shootPlayerTwoMarine();
            console.log('up2');
        }

        if(player2Marine.x >= 800)
        {
            player2Marine.setVelocityX(-75);
        }

        if(player2Marine.x <= 0)
        {
            player2Marine.setVelocityX(75);
        }
        player2Marine.angle += 2;
        
    }
}
/*
class Win extends Phaser.Scene
{
    constructor() {
        super('win');
    }

    preload() {
        this.load.image('pirateShip','assets/pirates.png');
    }

    create()
    {
        let style2 = { font: "38px Papyrus", fill: '#fff', align: "center" };
        let ship = this.add.image(400,300,'pirateShip');
        //ship.setScale(1.3);
        var newText = this.add.text(80, 300, '',style2);
        newText.setText("We saved Pirate Bob");
    }
}
class Intro extends Phaser.Scene
{
    constructor() {
        super('intro');
    }

    preload() {
        this.load.image('intro','assets/intro.png');
        this.load.audio('song', 'assets/music.mp3');
    }

    create()
    {
        var music = this.sound.add('song', {volume:0.8})
        music.play();
        let start = this.add.image(470,300,'intro');
        start.setScale(1.2);
        cursors = this.input.keyboard;
        let style3 = { font: "20px Papyrus", fill: '#fff', align: "left" };
        text = this.add.text(100, 100,introText,style3);

        this.input.on('pointerdown', () => {
            this.scene.start('main') 
        });
    }
}*/

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [MyScene],
    physics: { default: 'arcade' },
    });
