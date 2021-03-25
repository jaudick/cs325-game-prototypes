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
let randomNumber = (min, max) => {  
    return Math.random() * (max - min) + min; 
};

let timer = 0;
let timeToSpawn = 3;
let whichSide = 1;
let physics;
let enemiesShoot;
let enemiesTop;
let enemiesBottom;
let enemiesLeft;
let enemiesRight;
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

Click Left Arrow for Singleplayer!
Click Right Arrow for Multiplayer!`


let speed = 200;
let playerBulletVelocity = 500;
let enemyBulletVelocity = 150;
let canShoot = true;
let shoot = undefined;
let direction = "right";

class SinglePlayer extends Phaser.Scene {
    
    constructor() {
        super('main');
        
        this.bouncy = null;
    }
    
    preload() {
        this.load.image( 'player', 'assets/player.png');
        this.load.image( 'enemy', 'assets/badguy2.png');
        this.load.image('bullet', 'assets/bulletYellow.png')
        this.load.image('bulletRed', 'assets/bulletred.png')
        this.load.image('sand', 'assets/sand.jpg');
        
        //this.load.audio('bigLaserSound', 'assets/bigLaser.wav');     
    }
    
    create() {
        timer = timeToSpawn;
        direction = "right";
        whichSide = 1;
        canShoot = true;
        physics = this.physics;
        mainScene = this;
        cursors = this.input.keyboard.addKeys(
            {left2:Phaser.Input.Keyboard.KeyCodes.A,
            right2:Phaser.Input.Keyboard.KeyCodes.D,
            up2:Phaser.Input.Keyboard.KeyCodes.W,
            down2:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.LEFT,
            right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:Phaser.Input.Keyboard.KeyCodes.UP,
            down:Phaser.Input.Keyboard.KeyCodes.DOWN,
            shoot:Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        

        //let laserSound = this.sound.add('laserSound', {volume:0.7});
        //startGame();
        let bg;
        bg = this.add.image(400,300,'sand'); //bg
        bg.setScale(4);

        player = physics.add.image(300,300,'player');
        player.setScale(0.2,0.2);
        player.setCollideWorldBounds(true);

        enemiesTop = this.physics.add.group({
            key:'enemy', //key image
            repeat: 7, //12 time
            setXY: {x:100,y:60,stepX:80}
        });
        enemiesBottom = this.physics.add.group({
            key:'enemy', //key image
            repeat: 7, //12 time
            setXY: {x:100,y:540,stepX:80}
        });

        enemiesLeft = this.physics.add.group({
            key:'enemy', //key image
            repeat: 5, //12 time
            setXY: {x:40,y:100,stepX:0, stepY:80}
        });

        enemiesRight = this.physics.add.group({
            key:'enemy', //key image
            repeat: 5, //12 time
            setXY: {x:740,y:100,stepX:0, stepY:80}
        });

        iterateEnemies(enemiesTop, 90);
        iterateEnemies(enemiesBottom, -90);
        iterateEnemies(enemiesLeft, 0);
        iterateEnemies(enemiesRight, 180);
        physics.add.overlap(player, enemiesTop, playerDie, null, this);
        physics.add.overlap(player, enemiesBottom, playerDie, null, this);
        physics.add.overlap(player, enemiesLeft, playerDie, null, this);
        physics.add.overlap(player, enemiesRight, playerDie, null, this);
        
        function iterateEnemies(enemies, angle)
        {
            enemies.children.iterate(function (child) 
            {
                child.setScale(0.25);
                child.angle = angle;
            });
        }

        function enemiesHit(bullet, other)
        {
            other.setTint(0xff0000);
            bullet.disableBody(true,true);
        }

        enemiesShoot = function (enemies, direction, skipParameter)
        {
            let skip = skipParameter;
            enemies.children.iterate(function (child) 
            {
                if(!skip)
                {
                    let enemyBullet = physics.add.image(child.x,child.y,'bulletRed');
                    let velocityX = direction == "right" ? enemyBulletVelocity : direction == "left" ? -enemyBulletVelocity : 0;
                    let velocityY = direction == "up" ? -enemyBulletVelocity: direction == "down" ? enemyBulletVelocity : 0;
                    enemyBullet.setVelocity(velocityX,velocityY);
                    enemyBullet.angle = child.angle + 90;
                    enemyBullet.setScale(0.1,0.1);
                    physics.add.overlap(enemyBullet, player, playerDie, null, this);
                    skip = true;
                }

                else 
                { 
                    skip = false;
                }
            });
        }

        function playerDie()
        {
            player.setTint(0xff0000);
            mainScene.scene.start('main')
        }

        shoot = () =>
        {
            let playerBullet = physics.add.image(player.x,player.y,'bullet');
            let velocityX = direction == "right" ? playerBulletVelocity : direction == "left" ? -playerBulletVelocity : 0;
            let velocityY = direction == "up" ? -playerBulletVelocity : direction == "down" ? playerBulletVelocity : 0;
            playerBullet.setVelocity(velocityX,velocityY);
            playerBullet.angle = player.angle + 90;
            playerBullet.setScale(0.08,0.08);

            physics.add.overlap(playerBullet, enemiesTop, enemiesHit, null, this);
            physics.add.overlap(playerBullet, enemiesBottom, enemiesHit, null, this);
            physics.add.overlap(playerBullet, enemiesLeft, enemiesHit, null, this);
            physics.add.overlap(playerBullet, enemiesRight, enemiesHit, null, this);
        }
    }
    
    update() 
    {
        if(cursors.left.isDown)
        {
            player.setVelocity(-speed,0);
        }
        else if(cursors.right.isDown)
        {
            player.setVelocity(speed,0);
        }
        else if(cursors.up.isDown)
        {
            player.setVelocity(0,-speed);
        }
        else if(cursors.down.isDown)
        {
            player.setVelocity(0,speed);
        }

        else
        {
            player.setVelocity(0,0);
        }
/////////////////////////////////////////////////////
        if(cursors.left2.isDown)
        {
            player.angle = 180;
            direction = "left";
        }

        else if(cursors.right2.isDown)
        {
            player.angle = 0;
            direction = "right";
        }

        else if(cursors.up2.isDown)
        {
            player.angle = -90;
            direction = "up";
        }

        else if(cursors.down2.isDown)
        {
            player.angle = 90;
            direction = "down";
        }

        if(cursors.shoot.isDown && canShoot)
        {
            canShoot = false;
            shoot();
        }

        else if(cursors.shoot.isUp)
        {
            canShoot = true;
        }

        timer+= 0.01;
        if(timer>=timeToSpawn)
        {
            if(whichSide == 1)
            {
                enemiesShoot(enemiesTop, "down", true);
                enemiesShoot(enemiesBottom, "up", false);
                enemiesShoot(enemiesLeft, "right", true);
                enemiesShoot(enemiesRight, "left", false);
                whichSide = 2;
            }
            else if(whichSide == 2)
            {
                enemiesShoot(enemiesTop, "down", false);
                enemiesShoot(enemiesBottom, "up", true);
                enemiesShoot(enemiesLeft, "right", false);
                enemiesShoot(enemiesRight, "left", true);
                whichSide = 1;
            }
            timer = 0;
        }
    }
}

/*
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


class BG extends Phaser.Scene
{
    constructor() {
        super('bg');
    }

    preload() {
        this.load.image('intro','assets/intro.jpg');
        this.load.audio('song', 'assets/bass.mp3');
    }

    create()
    {
        //var music = this.sound.add('song', {volume:0.6})
        //music.play();
        let start = this.add.image(410,400,'intro');
        start.setScale(0.8);
        cursors = this.input.keyboard.createCursorKeys();
        let style3 = { font: "40px", fill: '#FFFF00', align: "left" };
        text = this.add.text(-100, 75,"",style3);
        text.setText(
            `
            Level Selection

            Rocks : Left Arrow
            Snow : Up Arrow
            Sand : Right Arrow
            Grass : Down Arrow`);

         
    }
    update()
    {
        if(cursors.left.isDown)
        {
            bgNumber = 1;
            this.scene.start(gameMode)
        }
        else if(cursors.up.isDown)
        {
            bgNumber = 2;
            this.scene.start(gameMode)
        }
        else if(cursors.right.isDown)
        {
            bgNumber = 3;
            this.scene.start(gameMode)
        }
        else if(cursors.down.isDown)
        {
            bgNumber = 4;
            this.scene.start(gameMode)
        }
    }
}


class WinSingle extends Phaser.Scene
{
    constructor() {
        super('winSingle');
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
            this.scene.start('single') 
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
        cursors = this.input.keyboard.createCursorKeys();
        let style3 = { font: "25px", fill: '#FFFF00', align: "left" };
        text = this.add.text(100, 25,introText,style3);

         
    }
    update()
    {
        if(cursors.left.isDown)
        {
            gameMode = 'single';
            this.scene.start('bg')
        }
        if(cursors.right.isDown)
        {
            gameMode = 'main';
            this.scene.start('bg')
        }
    }
}*/

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [SinglePlayer],
    physics: { default: 'arcade' },
    });
