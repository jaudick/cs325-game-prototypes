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
/*
let randomNumber = (min, max) => {  
    return Math.random() * (max - min) + min; 
};*/

let wave = 1;
let maxWaves = 5;
let score = 0;
let timer = 0;
let whichSide = 1;
let physics;
let enemiesShoot;
let enemiesTop;
let enemiesBottom;
let enemiesLeft;
let enemiesRight;
let enemiesAlreadyHit = [];
//let gameOver = false;
let mainScene;
let introText = 
`It's an ambush!

We are surrounded with only 30 bullets remaining.
The enenmy is alternating their shots from both sides.
They will keep shooting until all of them are hit once.
You have 5 health for the whole ambush. At 0 health you are K.I.A.
If a bullet hits your head you will lose 1 health.
If you make physcial contact with an enemy you are K.I.A instantly.
Small Victory is achieved by defeating 1 ambush wave.
Total Victory is achieved by defeating all 5 ambush waves.

Move: LEFT,RIGHT,UP,DOWN -> ARROW KEYS
Look: W,A,S,D
Shoot: Spacebar

Save us soldier!`

let bullets = 30;
let enemiesRemaining = 28;
let bulletText;
let speed = 200;
let playerBulletVelocity = 500;
let timeToSpawn = 1.2; //1
let enemyBulletVelocity = 400; //300
let canShoot = true;
let shoot = undefined;
let direction = "right";
let health = 5;
let maxHealth = 5;
let healthText;

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
        this.load.image('sand', 'assets/sand2.png');
        
        this.load.audio('shot1', 'assets/gun1.wav');
        this.load.audio('shot2', 'assets/gun2.wav');  
        this.load.audio('hit', 'assets/shout1.wav');   
        this.load.audio('hit2', 'assets/shout2.mp3')
    }
    
    create() {
        health = maxHealth;
        enemiesAlreadyHit = [];
        score = 0;
        enemiesRemaining = 28;
        bullets = 30;
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
        
        let shoot1 = this.sound.add('shot1', {volume:0.3});
        let shoot2 = this.sound.add('shot2', {volume:0.7});
        let hit = this.sound.add('hit', {volume:1});
        let hit2 = this.sound.add('hit2', {volume:1});


        let bg;
        bg = this.add.image(400,300,'sand'); //bg
        bg.setScale(3.9);

        player = physics.add.image(300,300,'player');
        player.setScale(0.19,0.19);
        player.setCollideWorldBounds(true);
        player.body.setSize(40, 40, 60, 60);

        bulletText = this.add.text(10,4,`Bullets Remaining: ${bullets}`);
        let enemyText = this.add.text(580,4,`Enemies Remaining: ${enemiesRemaining}`);
        let waveText = this.add.text(420,4,`Wave: ${wave}/${maxWaves}`);
        healthText = this.add.text(260,4,`Health: ${health}/${maxHealth}`);

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
        physics.add.overlap(enemiesTop, player, playerDie, null, this);
        physics.add.overlap(enemiesBottom, player, playerDie, null, this);
        physics.add.overlap(enemiesLeft, player, playerDie, null, this);
        physics.add.overlap(enemiesRight, player, playerDie, null, this);
        
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
            for(let i = 0; i<enemiesAlreadyHit.length; i++)
            {
                if(other.x == enemiesAlreadyHit[i].x && other.y == enemiesAlreadyHit[i].y)
                {
                    bullet.disableBody(true,true);
                    return;
                }
            }
            enemiesRemaining--;
            enemyText.setText(`Enemies Remaining: ${enemiesRemaining}`)
            hit.play();
            if(enemiesRemaining==0) win();
            other.setTint(0xff0000);
            bullet.disableBody(true,true);
            enemiesAlreadyHit.push({x:other.x,y: other.y});
        }

        enemiesShoot = function (enemies, direction, skipParameter)
        {
            shoot1.play();
            let skip = skipParameter;
            enemies.children.iterate(function (child) 
            {
                if(!skip)
                {
                    let enemyBullet = physics.add.image(child.x,child.y,'bulletRed');
                    enemyBullet.setTint(0x0000)
                    let velocityX = direction == "right" ? enemyBulletVelocity : direction == "left" ? -enemyBulletVelocity : 0;
                    let velocityY = direction == "up" ? -enemyBulletVelocity: direction == "down" ? enemyBulletVelocity : 0;
                    enemyBullet.setVelocity(velocityX,velocityY);
                    enemyBullet.angle = child.angle + 90;
                    enemyBullet.setScale(0.1,0.1);
                    physics.add.overlap(enemyBullet, player, playerDie, null, this);
                    skip = true;

                    let enemyBullet2 = physics.add.image(child.x,child.y,'bulletRed');
                    enemyBullet2.setTint(0x0000)
                    let velocityX2 = direction == "right" ? enemyBulletVelocity : direction == "left" ? -enemyBulletVelocity : 0;
                    let velocityY2 = direction == "up" ? -enemyBulletVelocity: direction == "down" ? enemyBulletVelocity : 0;
                    enemyBullet2.setVelocity(velocityX2/2,velocityY2/2);
                    enemyBullet2.angle = child.angle + 90;
                    enemyBullet2.setScale(0.1,0.1);
                    physics.add.overlap(enemyBullet, player, playerDie, null, this);
                }

                else 
                { 
                    skip = false;
                }
            });
        }

        function playerDie(enemyBullet, player)
        {
            enemyBullet.disableBody(true,true);
            health--;
            healthText.setText(`Health: ${health}/${maxHealth}`);
            mainScene.cameras.main.shake(300);
            hit2.play()
            if(health == 0 || (player.x >= 740 || player.x <= 100 || player.y <= 60 || player.y >= 540))
            {
                mainScene.scene.start('lose')
            }
        }

        function win()
        {
            wave++;
            if(wave == 6)
                mainScene.scene.start('win');
            else
            {
                timeToSpawn-=0.1;
                enemyBulletVelocity+=40;
                mainScene.scene.start('win');
            }
        }

        shoot = () =>
        {
            shoot2.play()
            bullets--;
            if(bullets <= 0)
            {
                playerDie();
            }
            bulletText.setText(`Bullets Remaining: ${bullets}`)
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


class Win extends Phaser.Scene
{
    constructor() {
        super('win');
    }

    preload() {
        this.load.image('bg2','assets/bg2.png');
    }

    create()
    {
        cursors = this.input.keyboard;
        cursors = this.input.keyboard.addKeys(
            { e:Phaser.Input.Keyboard.KeyCodes.E
        });
        mainScene = this;

        let win = this.add.image(400,300,'bg2');
        win.setScale(0.9);
        let style3 = { font: "18px"};

        if(wave<6)
        {
            let style2 = { font: "120px Papyrus", fill: '#000', align: "center" };
            let newText = this.add.text(100, 100, '', style2);
            newText.setText(`Victory`);
            let newText2 = this.add.text(150, 100, 'Press E to Fight the Next Wave', style3);
        }

        else
        
        {
            let style2 = { font: "100px Papyrus", align: "center" };
            let newText = this.add.text(20, 120, 'Total Victory', style2);
            let newText2 = this.add.text(100, 100, 'You took out the bad guys. Good Work Soldier!', style3);
        }
    }

    update()
    {
        if(cursors.e.isDown && wave<6)
        {
            mainScene.scene.start('main')
        }
    }
}

class Lose extends Phaser.Scene
{
    constructor() {
        super('lose');
    }

    preload() {
        this.load.image('bg1','assets/bg1.jfif');
    }

    create()
    {
        health = maxHealth;
        mainScene = this;
        cursors = this.input.keyboard;
        let lose = this.add.image(400,300,'bg1');
        lose.setScale(0.5);
        let style2 = { font: "90px Papyrus", fill: '#000', align: "center" };
        let newText = this.add.text(100, 300, '', style2);
        newText.setText(`Defeat`);

        let newText2 = this.add.text(500, 50, 'Press Space to Fight Again');

        cursors = this.input.keyboard.addKeys(
            { shoot:Phaser.Input.Keyboard.KeyCodes.SPACE
        });

    }

    update()
    {
        if(cursors.shoot.isDown)
        {
            mainScene.scene.start('main')
        }
    }
}


class Intro extends Phaser.Scene
{
    constructor() {
        super('intro');
    }

    preload() {
        this.load.image('bg','assets/bg3.png');
        this.load.audio('song', 'assets/song.mp3')
    }

    create()
    {
        var music = this.sound.add('song', {volume:0.2})
        music.play();
        mainScene = this;
        cursors = this.input.keyboard;
        let lose = this.add.image(400,300,'bg');
        lose.setScale(1);
        let style2 = { font: "18px", fill: '#ffff', align: "left" };
        let newText = this.add.text(50, 330, '', style2);
        newText.setText(introText);

        let style4 = { font: "40px", fill: '#ffff', align: "left" };
        let newText3 = this.add.text(50, 280, 'OPERATION AMBUSH', style4);

        let style3 = { font: "30", fill: '#000', align: "center" };
        let newText2 = this.add.text(550, 550, 'Press Space to Fight');

        cursors = this.input.keyboard.addKeys(
            { shoot:Phaser.Input.Keyboard.KeyCodes.SPACE
        });

    }

    update()
    {
        if(cursors.shoot.isDown)
        {
            mainScene.scene.start('main')
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [Intro, SinglePlayer, Win,Lose],
    physics: { default: 'arcade' },
    });
