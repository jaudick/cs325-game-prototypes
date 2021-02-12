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
let fore,mid,far,back,sky,rock;
let cursors;
let player;
let speed = 5;
let move = false;
const totalNumberOfClicks = 5;
let currentNumberOfClicks = 0;
class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
        
        this.bouncy = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'logo', 'assets/phaser.png' );
        this.load.image('fore', 'assets/desert_parts/desert_0000_Layer-1.png');
        this.load.image('mid', 'assets/desert_parts/desert_0001_Layer-2.png');
        this.load.image('far', 'assets/desert_parts/far.png');
        this.load.image('back', 'assets/desert_parts/back.png');
        this.load.image('sky', 'assets/desert_parts/sky.png');
        this.load.image('rock', 'assets/rock.png');
        
        this.load.spritesheet('wanderer', 'assets/dworange.png', {frameWidth: 64, frameHeight:70});
        this.load.image('traveler', 'assets/mysterious_transparent.png')

        this.load.spritesheet('man', 'assets/DesertRogue.png', {frameWidth: 32, frameHeight: 32});
    }
    
    create() {
        cursors = this.input.keyboard.createCursorKeys();
        currentNumberOfClicks = 0;

        sky = this.add.tileSprite(400, 400, 1600, 1200, 'sky');
        back = this.add.tileSprite(400, 400, 1600, 1200, 'back');
        back.setScale(0.5);
        far = this.add.tileSprite(400, 400, 1600, 1200, 'far');
        far.setScale(0.5);
        mid = this.add.tileSprite(400, 400, 1600, 1200, 'mid');
        mid.setScale(0.5);
        fore = this.add.tileSprite(400, 400, 1600, 1200, 'fore');
        fore.setScale(0.5);

        player = this.physics.add.sprite(200,470,'man');
        player.setScale(2.75)

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('man', {start:0,end:9}),
            frameRate:4,
            repeat:-1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('man', {start:20,end:29}),
            frameRate:8,
            repeat:-1
        });

        this.anims.create({
            key: 'give',
            frames: this.anims.generateFrameNumbers('man', {start:10,end:19}),
            frameRate:8,
            repeat:1
        });

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('man', {start:40,end:49}),
            frameRate:8,
            repeat:1
        });


        let wanderer = this.physics.add.sprite(600,400,'wanderer');
        wanderer.setScale(4);
        this.anims.create({
            key: 'wandererIdle',
            frames: this.anims.generateFrameNumbers('wanderer', {start:0,end:3}),
            frameRate:3,
            repeat:-1
        });
        wanderer.anims.play('wandererIdle',true)

        /*
        // Make the camera shake when clicking/tapping on it.
        this.bouncy.setInteractive();
        this.bouncy.on( 'pointerdown', function( pointer ) {
            this.scene.cameras.main.shake(500);
            });
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        let text = this.add.text( this.cameras.main.centerX, 15, "Build something amazing.", style );
        text.setOrigin( 0.5, 0.0 );*/
        const moveFunction = function()
        {
            if(move)
                return
            if(!move)
            {
                move = true;
                currentNumberOfClicks++;
            }
            setTimeout(()=> {
                move = false;
                console.log(currentNumberOfClicks);
                processStory();
                
            }, 1500);
        }
        this.input.on('pointerdown', moveFunction);

        function processStory()
        {
            console.log("story");
            if(currentNumberOfClicks === 2)
            {
                
            }
        }

        

        rock = this.add.tileSprite(0, 600, 1600, 170, 'rock');
    }
    
    update() {
        if(move)
        {
            player.anims.play('give',true)
            rock.tilePositionX += speed;
            fore.tilePositionX += speed*0.9;
            mid.tilePositionX += speed*0.5;
            far.tilePositionX += speed*0.2;
            back.tilePositionX += speed*.1;
        }

        /*
        if (cursors.right.isDown)
        {
            player.anims.play('right',true)
            rock.tilePositionX += speed;
            fore.tilePositionX += speed*0.9;
            mid.tilePositionX += speed*0.5;
            far.tilePositionX += speed*0.2;
            back.tilePositionX += speed*.1;
        }
        else if(cursors.left.isDown)
        {
            rock.tilePositionX -= speed;
            fore.tilePositionX -= speed*0.9;
            mid.tilePositionX -= speed*0.5;
            far.tilePositionX -= speed*0.2;
            back.tilePositionX -= speed*.1;
        }*/

        else
        {
            player.anims.play('idle',true)
        }
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
        //if (cursors.left.isDown)
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
