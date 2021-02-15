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
let speed = 25;
let move = false;
let attack = false;
let give = false;
const totalNumberOfClicks = 5;
let currentNumberOfClicks = 0;
let pointer;
let text;

const blue = '333399';
let correctDesicions = 0;

let goLeft;
let goRight;
let currentWanderer;
let processDecision = false;
let canMove = false;
let wanderer;
let whichWanderer = 1;
let showWanderer = false;
let gameOver = false;
let mainScene;
let processing = false;
let canDoInput = false;
let introText = 
`On the barren planet of Sikarra, you crashed your ship.
With now way off the planet, the only hope of survival is finding 
the rumored safehaven of the planet: the Oasis. Many in your shoes 
have tried and failed to reach this place. Wanderers will be ahead with
their stories. Will you trust them or will you defend yourself on your
path to salvation? 

Left click to move yourself. 
Left or right click to decide.
Left click to begin.`
let wandererTexts = [
`Traveler... I see you seek the Oasis. I was once on your path, now look at me. 
Endlessly wandering this desert. I may never find what we seek, but deaths horizon 
is near for my tired soul. Do you have a water to spare? 
I would reward you with my map marked with knowledge of this vast desert. 
You may see in it
what I could never find.

LMB to accept --- RMB to attack`,

`Hello lost one... the Oasis you seek is no more. 
It was destroyed long ago by men like you and I. All that is left of the 
paradise is the dead men once full of desire. I need water to surive this land.
Do you have some to spare? Should you gift me, 
I will tell of knowledge of a new Oasis.
If you do not, I will take the water from you myself.

LMB to accept --- RMB to attack`,

`My dear traverler. I see you have a map guiding you. 
That map is vast with knowledge of the great desert.
However, it does know where the desire you seek resides. I have a map myself
containing the knowledge. I will hand it for a simple barter. My map for yours...

LMB to accept --- RMB to attack`,

`Long ago I saw what you seek traveler. 
It still stands with it's wonder gleaming through 
this deserts lifeless land.
I travel to desitnations no more. Life is my destination now. 
Give me your water so I may continue on this path, 
and I will tell you where the great Oasis resides.

LMB to accept --- RMB to attack`
]
class MyScene extends Phaser.Scene {
    
    constructor() {
        super('main');
        
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
        this.load.image('oasis', 'assets/oasis.png');
        this.load.audio('die', 'assets/die.mp3')
        this.load.audio('attack', 'assets/attack.wav')
        this.load.audio('accept', 'assets/accept.wav')
        
        this.load.spritesheet('wanderer', 'assets/dworange.png', {frameWidth: 64, frameHeight:70});
        this.load.image('traveler', 'assets/mysterious_transparent.png')

        this.load.spritesheet('man', 'assets/DesertRogue.png', {frameWidth: 32, frameHeight: 32});
        
    }
    
    create() {
        canDoInput = true;
        mainScene = this;
        goLeft = false;
        goRight = false;
        move = false;
        give = false;
        attack = false;
        processDecision = false;
        showWanderer = false;
        canMove = true;
        correctDesicions = 0;
        gameOver = false;
        
        cursors = this.input.keyboard.createCursorKeys();
        currentNumberOfClicks = 0;
        var attackSound = this.sound.add('attack', {volume:0.85});
        var acceptSound = this.sound.add('accept', {volume:0.85});
        var dieSound = this.sound.add('die', {volume:0.85});

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
            frameRate:12,
            repeat:-1
        });

        this.anims.create({
            key: 'give',
            frames: this.anims.generateFrameNumbers('man', {start:10,end:19}),
            frameRate:8,
            repeat:0
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('man', {start:30,end:39}),
            frameRate:8,
            repeat:0
        });

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('man', {start:40,end:49}),
            frameRate:8,
        });


        wanderer = this.physics.add.sprite(1000,400,'wanderer');
        wanderer.setScale(4);
        this.anims.create({
            key: 'wandererIdle',
            frames: this.anims.generateFrameNumbers('wanderer', {start:0,end:3}),
            frameRate:3,
            repeat:-1
        });
        wanderer.anims.play('wandererIdle',true)
        rock = this.add.tileSprite(0, 600, 1600, 170, 'rock');
        wanderer.setTint('1');
        player.setTint('0');
        
        var bg = this.add.image(2000,200,'oasis'); //bg
        bg.setScale(1.5);

        var style = { font: "20px Papyrus", fill: '000', align: "left" };
        var style2 = { font: "30px Papyrus", fill: '0000', align: "center" };
        text = this.add.text(50, 50, '',style);
        var text2 = this.add.text(300, 350, '',style2);

        
        
        const moveFunction = function()
        {
            if(move || !canMove || showWanderer)
                return
            if(!move && canMove && !showWanderer)
            {
                move = true;
            }
            setTimeout(()=> {
                move = false;
                //console.log(currentNumberOfClicks);
                processStory();
                
            }, 4000);
        }



        this.input.mouse.disableContextMenu();
        this.input.on('pointerup', function(pointer)
        {
            if(canDoInput)
            {
                if (pointer.leftButtonReleased())
                {
                    console.log('left');
                    if(processDecision)
                    {
                        if(give === false && attack===false)
                            give = true;
                        processStory();
                    }
                    else
                    {
                        moveFunction();
                    }
                }
                else if (pointer.rightButtonReleased())
                {
                    if(processDecision)
                    {
                        if(give === false && attack===false)
                            attack = true;
                        processStory();
                    }
                    console.log('right');
                }
            }
        });



        function processStory()
        {
            if(give || attack)
            {
                //if(!processing)
                //{
                    //processing = true;
                    //setTimeout(()=> 
                    //{
                        console.log('processing...');
                        if(give)
                        {
                            goLeft = true;
                            acceptSound.play()
                            
                        }

                        else if(attack)
                        {
                            attackSound.play()
                            goRight = true;
                        }
                        give = false;
                        attack = false;
                        processDecision = false;
                        move = false;
                        player.anims.play('idle',true);
                        canDoInput = false;
                        //processing = false;
                        return;
                    //}, 1000);
                //}
            }
            else
            {
                console.log(correctDesicions +'!!!!!!!!!!!!!')
                if(!move && canMove)
                {
                    currentNumberOfClicks++;
                    console.log("CLICKS: " + currentNumberOfClicks)
                }
                if(currentNumberOfClicks === 1)
                {
                    whichWanderer = 1;
                    doShowWanderer(whichWanderer);
                }

                if(currentNumberOfClicks === 2)
                {
                    
                    if(correctDesicions !== 1)
                    {
                        dieSound.play();
                        gameOver = true;
                        player.anims.play('die',8,false);
                        text2.setText('You Got Lost and Died')
                        setTimeout(()=>{reset()}, 3000);
                    }
                }

                if(currentNumberOfClicks === 3)
                {
                    whichWanderer = 2;
                    doShowWanderer(whichWanderer);
                }

                if(currentNumberOfClicks === 4)
                {
                    if(correctDesicions !== 2)
                    {
                        dieSound.play();
                        gameOver = true;
                        player.anims.play('die',8,false);
                        text2.setText('You Died from Lack of Water');
                        setTimeout(()=>{reset()}, 3000);
                    }
                }

                if(currentNumberOfClicks === 5)
                {
                    whichWanderer = 3;
                    doShowWanderer(whichWanderer);
                }

                if(currentNumberOfClicks === 6)
                {
                    if(correctDesicions !== 3)
                    {
                        dieSound.play();
                        gameOver = true;
                        player.anims.play('die',8,false);
                        text2.setText('You Wandered Too Far and Died');
                        setTimeout(()=>{reset()}, 3000);

                    }
                }

                if(currentNumberOfClicks === 7)
                {
                    whichWanderer = 4;
                    doShowWanderer(whichWanderer);
                }

                if(currentNumberOfClicks === 8)
                {
                    if(correctDesicions !== 4)
                    {
                        dieSound.play();
                        gameOver = true;
                        player.anims.play('die',8,false);
                        text2.setText('You Became Hopeless and Died');
                        setTimeout(()=>{reset()}, 3000);
                    }

                    else
                    {
                        acceptSound.play();
                        bg.x = 300;
                        text2.setText('You Found the Oasis');
                    }
                }
            }      
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        function doShowWanderer(id)
        {
            console.log("showing " + id)
            canMove = false;
            move = false;
            showWanderer = true;
            currentWanderer = wanderer;
        }

        const reset = () =>
        {
            mainScene.scene.start('main');
        }  
    }
    
    update() {
        
        pointer = this.input.activePointer;
        if(!gameOver)
        {
            if(move && canMove)
            {
                player.anims.play('right',true)
                rock.tilePositionX += speed;
                fore.tilePositionX += speed*0.9;
                mid.tilePositionX += speed*0.5;
                far.tilePositionX += speed*0.2;
                back.tilePositionX += speed*.1;
            }

            else if(attack)
            {
                player.anims.play('attack',true)
            }

            else if(give)
            {
                player.anims.play('give',true)
            }
            else
            {
                player.anims.play('idle',true)
            }

            if(showWanderer)
            {
                if(currentWanderer.x > 600)
                {
                    currentWanderer.x -= 2;
                    canMove = false;
                    move = false;
                }

                if(currentWanderer.x <= 600)
                {
                    text.setText(wandererTexts[whichWanderer-1]);
                    canMove = false
                    processDecision = true;
                }

                if(goLeft)
                {
                    text.setText('');
                    if(currentWanderer.x > -200)
                    {
                        currentWanderer.x -= 4;
                        canDoInput = false;
                    }
                    
                    if(currentWanderer.x <= -200)
                    {
                        processDecision = false;
                        showWanderer = false;
                        goLeft = false;
                        goRight = false;
                        canMove = true;
                        currentWanderer.x = 1000;
                        if(whichWanderer === 1) correctDesicions++;
                        else if(whichWanderer === 4) correctDesicions++;
                        canDoInput = true;
                        
                    }
                }

                else if(goRight)
                {
                    text.setText('');
                    if(currentWanderer.x < 1000)
                    {
                        currentWanderer.x += 4;
                        canDoInput = false;
                    }
                    if(currentWanderer.x >= 1000)
                    {
                        processDecision = false;
                        showWanderer = false;
                        goLeft = false;
                        goRight = false;
                        canMove = true;
                        currentWanderer.x = 1000;
                        if(whichWanderer === 2) correctDesicions++;
                        else if(whichWanderer === 3) correctDesicions++;
                        canDoInput = true;
                        
                    }
                }
                
            }
        }
    }

    //reset the wanderer position.
    //change the tint.
    //check which one we are one with ints to display text.
    //have a bool for each to see which ones we accepted.
    //if the right ones, walk off the screen.
    //if the wrong, walk off a bit then die.
}

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
}
const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [IntroScene, MyScene],
    physics: { default: 'arcade' },
    });
