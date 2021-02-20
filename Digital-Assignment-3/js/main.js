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
let bob;
let orcs;
let physics;
var score = 0;
let gameScene;

let isButton1 = false;
let isButton2 = false; 
let isButton3 = false; 
let isButton4 = false;
let isButton5 = false; 

let speed = 25;
let pointer;
let text;

let gameOver = false;
let mainScene;
let canDoInput = false;
let introText = 
`Pirate Bob has done it again! He's gotten wasted on the rum. Now we need to save him from the orcs!
We don't know why there are orcs on a tropical island, but we don't have time to ask questions!
Press 1, 2, 3, or 4 to select a cannon from left to right.
Click with the Left Mouse button on a screen location to fire.
You can only fire a cannon once every two seconds. Switch between cannons to maximize firepower!
There are three orc waves ahead! Save Pirate Bob!`

class MyScene extends Phaser.Scene {
    
    constructor() {
        super('main');
        
        this.bouncy = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'ocean', 'assets/ocean.png' );
        this.load.image( 'cannon', 'assets/cannon.png' );
        this.load.image( 'rock', 'assets/rock.png' );
        this.load.image( 'ship', 'assets/ship.png' );


        //this.load.audio('cannon', 'assets/cannon.mp3')
        
        this.load.spritesheet('bob', 'assets/bob.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('orc', 'assets/orcsEdit.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('fireButton', 'assets/fire.png', {frameWidth: 32, frameHeight: 32});
        
    }
    
    create() {
        gameScene = this;
        score = 0;
        isButton1 = false;
        isButton2 = false; 
        isButton3 = false; 
        isButton1 = false;
        isButton5 = false; 
        physics = this.physics;

        mainScene = this;    
        cursors = this.input.keyboard.createCursorKeys();

        let bg = this.add.image(400,300,'ocean'); //bg
        bg.setScale(2.8);
        let ship = this.add.image(300,225,'ship');
        ship.setScale(4,4)
        //let attackSound = this.sound.add('attack', {volume:0.85});

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('orc', {start:0,end:9}),
            frameRate:10,
            repeat:-1
        });
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('orc', {start:23,end:25}),
            frameRate:15,
            repeat:0
        });

        function spawnOrcs()
        {
            orcs = physics.add.group({ //creates one child auto so repeat 11 is 12
                key:'orc', //key image
                repeat: 12, //12 time
                setXY: {x:-800,y:460,stepX:75} //start at 12 seperate each one by 70
            });
            iterateOrcs();
        }

        function iterateOrcs()
        {
            orcs.children.iterate(function (child) 
            {
                orcs.ad
                child.setScale(3.5);
                child.anims.play('walk',true);   
                child.setVelocityX((Math.random() * 50) + 100);
                //child.setVelocityY(200);
            });
        }

        spawnOrcs();


        ////////////////bob
        bob = this.physics.add.sprite(720,475,'bob');
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('bob', {start:0,end:5}),
            frameRate:6,
            repeat:-1
        });
        bob.setScale(2.5)
        bob.anims.play('idle',true);




        /////////////////////rocks
        var rocks = this.physics.add.staticGroup();
        let rock = this.add.tileSprite(0, 600, 1600, 170, 'rock');
        rocks.add(rock);
        this.physics.add.collider(orcs,rocks);



        var style = { font: "20px Papyrus", fill: '000', align: "left" };
        var style2 = { font: "30px Papyrus", fill: '0000', align: "center" };
        text = this.add.text(50, 50, '',style);
        var text2 = this.add.text(300, 350, '',style2);


        //////////////////////button//////////////////////
        let button1 = this.add.sprite(170, 350, 'fireButton', 0).setInteractive();
        button1.setFrame(1);
        button1.setScale(2);

        let button2 = this.add.sprite(340, 350, 'fireButton', 0).setInteractive();
        button2.setFrame(1);
        button2.setScale(2);

        let button3 = this.add.sprite(510, 350, 'fireButton', 0).setInteractive();
        button3.setFrame(1);
        button3.setScale(2);

        let button4 = this.add.sprite(680, 350, 'fireButton', 0).setInteractive();
        button4.setFrame(1);
        button4.setScale(2);

        button1.on('pointerover', function () {
            isButton1 = true;
            this.setFrame(0);
        });
        button1.on('pointerout', function () {
            isButton1 = false;
            this.setFrame(1);
        });

        button2.on('pointerover', function () {
            isButton2 = true;
            this.setFrame(0);
        });
        button2.on('pointerout', function () {
            isButton2 = false;
            this.setFrame(1);
        });

        button3.on('pointerover', function () {
            isButton3 = true;
            this.setFrame(0);
        });
        button3.on('pointerout', function () {
            isButton3 = false;
            this.setFrame(1);
        });

        button4.on('pointerover', function () {
            isButton4 = true;
            this.setFrame(0);
        });
        button4.on('pointerout', function () {
            isButton4 = false;
            this.setFrame(1);
        });


        
        this.input.mouse.disableContextMenu();
        this.input.on('pointerup', function(pointer)
        {
            if (pointer.leftButtonReleased())
            {
                let cannonNumber = isButton1 ? 1 : isButton2 ? 2 : isButton3 ? 3 : 4;
                let whereToSpawnSpriteX = isButton1 ? 150 : isButton2 ? 320 : isButton3 ? 490 : 660;
                let whereToSpawnSpriteY = 410
                let cannonBall = physics.add.sprite(whereToSpawnSpriteX,whereToSpawnSpriteY,'cannon');
                //cannonBall.setBounce(2.0);
                cannonBall.body.setGravityY(3000);
                cannonBall.body.setVelocityX(-100);

                physics.add.overlap(cannonBall, orcs, killOrc, null, this);
                //physics.add.collider(cannonBall,rocks);
                console.log(cannonNumber);
            }     
        });

        const reset = () =>
        {
            mainScene.scene.start('main');
        }

        function killOrc(cannonBall,orc)
        {
            score++;
            orc.anims.play('die',false);
            orc.setVelocityX(0);
            cannonBall.disableBody(true,true)
            setTimeout(()=>{orc.disableBody(true,true)},300);
            console.log(score);
            if(score-10 === 0)
            {
                gameScene.scene.start('main');
            }
        }
    }
    
    update() 
    {
        
        
    }
}

/*
class IntroScene extends Phaser.Scene
{
    constructor() {
        super('intro');
    }

    preload() {
        this.load.audio('song', 'assets/Blade.mp3');
        // Load an image and call it 'logo'.
        this.load.image('introDesert','assets/open-desert.png');
    }

    create()
    {
        var music = this.sound.add('song', {volume:0.5})
        music.play();
        var style2 = { font: "22px Papyrus", fill: '#fff', align: "center" };
        var desert = this.add.image(400,300,'introDesert');
        desert.setScale(1.3);
        var newText = this.add.text(100, 170, '',style2);
        newText.setText(introText);

        this.input.on('pointerdown', () => {
            this.scene.start('main') 
        });
    }
}*/
const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 1800,
    height: 600,
    scene: [MyScene],
    physics: { default: 'arcade' },
    });
