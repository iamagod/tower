/*
Tower Defence.

11x13 game field
game field is 100,100 x 750x650

TODO:
- add more monster versions
- populate gun type in the right way.

- iphone size detect/retina size detect
- lose life sound

- add airplanes
- add small wall piece
- create nice graphics
- update sound

- explode into new monsters
*/
var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;
console.log(w + " " +h);

var blockSize = Math.floor((w-300)/20);
//blockSize = 50;

var BS = blockSize;

console.log("blockSize: "+BS);

var halfBlockSize = Math.floor(blockSize/2);

var matrixSizeX = 15*2;
var matrixSizeY = 13*2;

var width = 20 * blockSize; //1000
var heigth = 14 * blockSize; //700
var game = new Phaser.Game(width, heigth, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var towerBase = [];
var gun = [];
var numbers;
var selectedTower;
var selected;
var selectedInField;
var running = false;
var monsterArray = [];
var bulletArray = [];
var gunArray = [];
var towerBaseArray =[];
var money = 1000;
var life = 20;
var kill = 0;
var towerPrice =[];
var toBeRemoved = [];
var bg;
var blocked;
var blurX, blurY;

var resetState = false;
var gameOverState = false;
var gameOver;
var pauseState = false;
var counter = 0;
var graphics;
var currentWave = 0;
var currentMonster = 0;
var timer = 180;
var counter = 1000;
var towerRange;
var bar;
var timerBar;
var emitter;
var upgradeActive = false;

// watch out it is mirrored!
// 15x13
var matrix = [
    //0 1  2  3  4  5  6  7  8  9  10 11 12 13 14
     1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,//0
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//1
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//2
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//3
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//4
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,//5
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,//6
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,//7
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//8
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//9
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//10
     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,//11
     1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1];//12


var fieldArray = [];

//console.log(fill.join());
for (j=0;j<matrixSizeX;j++){
    fieldArray[j] = [];
    for (i=0;i<matrixSizeY;i++){
        fieldArray[j].push(9);
    }
}

var waves = [
    //max length of waves is 500
    {order :[4],                                     betweenMonstersTime :20 ,betweenWavesTime: 500},
    {order :[5,5,5,5,5],                                     betweenMonstersTime :5 ,betweenWavesTime: 500},
    {order :[3,3,3,3,3],                                     betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[4,4,4,4,4],                                     betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[1,1,1,1,1],                                     betweenMonstersTime :40 ,betweenWavesTime: 500},
    {order :[1,2,1,2,1],                                     betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[1,1,1,2,2,2],                                   betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[3,3,3,2,2,2],                                   betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,1,2],                               betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,1,2,1,2,1,2],                       betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,1,1,3,3,1,1,1,1],                   betweenMonstersTime :10 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], betweenMonstersTime :10 ,betweenWavesTime: 500},
    ];

var monsterTypes = [];
monsterTypes[1] = {
    life : 200,
    speed : 2.5 * blockSize,
    image : "monster01",
    price : 5,
    color : 0xff0000,
};
monsterTypes[2] = {
    life : 100,
    speed : 1.5 * blockSize,
    image : "monster02",
    price : 2,
    color : 0x00ff00,
};
monsterTypes[3] = {
    life : 150,
    speed : 2.5 * blockSize,
    image : "monster03",
    price : 4,
    color : 0x0000ff,
};
monsterTypes[4] = {
    life : 25,
    speed : 4.75 * blockSize,
    image : "monster04",
    price : 5,
    color : 0xff00ff,
};
monsterTypes[5] = {
    life : 50,
    speed : 1.5 * blockSize,
    image : "monster05",
    price : 5,
    color : 0xff00ff,
};

var gunTypes = [];

function setupGuns(){

    // gun 1 small gun
    gunTypes[0]  = {price : 5,   speed : 50, range : 2   * BS, attackType : "closest", damage : 10, bulletLife : 500,  bulletSpeed : 4   * BS, bulletImage :18};
    gunTypes[10] = {price : 10,  speed : 45, range : 2.1 * BS, attackType : "closest", damage : 12, bulletLife : 550,  bulletSpeed : 4.2 * BS,bulletImage :18};
    gunTypes[20] = {price : 20,  speed : 50, range : 2.2 * BS, attackType : "closest", damage : 14, bulletLife : 600,  bulletSpeed : 4.4 * BS,bulletImage :18};
    gunTypes[30] = {price : 40,  speed : 35, range : 2.3 * BS, attackType : "closest", damage : 16, bulletLife : 650,  bulletSpeed : 4.6 * BS,bulletImage :18};
    gunTypes[40] = {price : 80,  speed : 30, range : 2.4 * BS, attackType : "closest", damage : 18, bulletLife : 700,  bulletSpeed : 4.8 * BS,bulletImage :18};
    gunTypes[50] = {price : 250, speed : 20, range : 3   * BS, attackType : "weakest", damage : 35, bulletLife : 1000, bulletSpeed : 6   * BS,bulletImage :18};

    // gun 2 dubble gun
    gunTypes[1]  = {price : 10,  speed : 20, range : 1.5 * BS, attackType : "closest", damage : 3,  bulletLife : 300,  bulletSpeed : 6   * BS,bulletImage :18};
    gunTypes[11] = {price : 20,  speed : 15, range : 1.6 * BS, attackType : "closest", damage : 6,  bulletLife : 350,  bulletSpeed : 6.2 * BS,bulletImage :18};
    gunTypes[21] = {price : 40,  speed : 10, range : 1.7 * BS, attackType : "closest", damage : 9,  bulletLife : 400,  bulletSpeed : 6.4 * BS,bulletImage :18};
    gunTypes[31] = {price : 80,  speed : 7,  range : 1.8 * BS, attackType : "closest", damage : 12, bulletLife : 450,  bulletSpeed : 6.6 * BS,bulletImage :18};
    gunTypes[41] = {price : 160, speed : 5,  range : 1.9 * BS, attackType : "closest", damage : 15, bulletLife : 500,  bulletSpeed : 6.8 * BS,bulletImage :18};
    gunTypes[51] = {price : 400, speed : 5,  range : 3   * BS, attackType : "closest", damage : 20, bulletLife : 700,  bulletSpeed : 7.5 * BS,bulletImage :18};

    // gun sonic tower
    gunTypes[2]  = {price : 75,   speed : 50, range : 2   * BS, attackType : "strongest", damage : 10, bulletLife : 500,  bulletSpeed : 4   * BS,bulletImage :15};
    gunTypes[12] = {price : 100,  speed : 45, range : 2.5 * BS, attackType : "strongest", damage : 10, bulletLife : 550,  bulletSpeed : 4.2 * BS,bulletImage :15};
    gunTypes[22] = {price : 125,  speed : 50, range : 3   * BS, attackType : "strongest", damage : 10, bulletLife : 600,  bulletSpeed : 4.4 * BS,bulletImage :15};
    gunTypes[32] = {price : 150,  speed : 35, range : 3.5 * BS, attackType : "strongest", damage : 10, bulletLife : 650,  bulletSpeed : 4.6 * BS,bulletImage :15};
    gunTypes[42] = {price : 175,  speed : 30, range : 4   * BS, attackType : "strongest", damage : 10, bulletLife : 700,  bulletSpeed : 4.8 * BS,bulletImage :15};
    gunTypes[52] = {price : 250,  speed : 20, range : 5   * BS, attackType : "strongest", damage : 10, bulletLife : 1000, bulletSpeed : 6   * BS,bulletImage :15};

    // gun rocket launcher
    gunTypes[3]  = {price : 120, speed : 100, range : 4   * BS, attackType : "farest", damage : 30, bulletLife : 1500,  bulletSpeed : 6   * BS,bulletImage :16};
    gunTypes[13] = {price : 50,  speed : 90, range : 4.1 * BS, attackType : "farest", damage : 35, bulletLife : 1750,  bulletSpeed : 4.2 * BS,bulletImage :16};
    gunTypes[23] = {price : 100,  speed : 80, range : 4.2 * BS, attackType : "farest", damage : 40, bulletLife : 2000,  bulletSpeed : 4.4 * BS,bulletImage :16};
    gunTypes[33] = {price : 200, speed : 70, range : 2.3 * BS, attackType : "farest", damage : 45, bulletLife : 2250,  bulletSpeed : 4.6 * BS,bulletImage :16};
    gunTypes[43] = {price : 300, speed : 60, range : 4.4 * BS, attackType : "farest", damage : 50, bulletLife : 2500,  bulletSpeed : 4.8 * BS,bulletImage :16};
    gunTypes[53] = {price : 400, speed : 40, range : 5   * BS, attackType : "farest", damage : 70, bulletLife : 3000,  bulletSpeed : 6   * BS,bulletImage :16};

    // gun 5
    gunTypes[4]  = {price : 5,   speed : 50, range : 2   * BS, attackType : "closest", damage : 10, bulletLife : 500,  bulletSpeed : 4   * BS,bulletImage :18};
    gunTypes[14] = {price : 10,  speed : 45, range : 2.1 * BS, attackType : "closest", damage : 12, bulletLife : 550,  bulletSpeed : 4.2 * BS,bulletImage :18};
    gunTypes[24] = {price : 20,  speed : 50, range : 2.2 * BS, attackType : "closest", damage : 14, bulletLife : 600,  bulletSpeed : 4.4 * BS,bulletImage :18};
    gunTypes[34] = {price : 40,  speed : 35, range : 2.3 * BS, attackType : "closest", damage : 16, bulletLife : 650,  bulletSpeed : 4.6 * BS,bulletImage :18};
    gunTypes[44] = {price : 80,  speed : 30, range : 2.4 * BS, attackType : "closest", damage : 18, bulletLife : 700,  bulletSpeed : 4.8 * BS,bulletImage :18};
    gunTypes[54] = {price : 250, speed : 20, range : 3   * BS, attackType : "weakest", damage : 35, bulletLife : 1000, bulletSpeed : 6   * BS,bulletImage :18};

    // gun 6
    gunTypes[5]  = {price : 5,   speed : 50, range : 2   * BS, attackType : "closest", damage : 10, bulletLife : 500,  bulletSpeed : 4   * BS,bulletImage :18};
    gunTypes[15] = {price : 10,  speed : 45, range : 2.1 * BS, attackType : "closest", damage : 12, bulletLife : 550,  bulletSpeed : 4.2 * BS,bulletImage :18};
    gunTypes[25] = {price : 20,  speed : 50, range : 2.2 * BS, attackType : "closest", damage : 14, bulletLife : 600,  bulletSpeed : 4.4 * BS,bulletImage :18};
    gunTypes[35] = {price : 40,  speed : 35, range : 2.3 * BS, attackType : "closest", damage : 16, bulletLife : 650,  bulletSpeed : 4.6 * BS,bulletImage :18};
    gunTypes[45] = {price : 80,  speed : 30, range : 2.4 * BS, attackType : "closest", damage : 18, bulletLife : 700,  bulletSpeed : 4.8 * BS,bulletImage :18};
    gunTypes[55] = {price : 250, speed : 20, range : 3   * BS, attackType : "weakest", damage : 35, bulletLife : 1000, bulletSpeed : 6   * BS,bulletImage :18};

    // gun 7
    gunTypes[6]  = {price : 5,   speed : 50, range : 2   * BS, attackType : "closest", damage : 10, bulletLife : 500,  bulletSpeed : 4   * BS,bulletImage :18};
    gunTypes[16] = {price : 10,  speed : 45, range : 2.1 * BS, attackType : "closest", damage : 12, bulletLife : 550,  bulletSpeed : 4.2 * BS,bulletImage :18};
    gunTypes[26] = {price : 20,  speed : 50, range : 2.2 * BS, attackType : "closest", damage : 14, bulletLife : 600,  bulletSpeed : 4.4 * BS,bulletImage :18};
    gunTypes[36] = {price : 40,  speed : 35, range : 2.3 * BS, attackType : "closest", damage : 16, bulletLife : 650,  bulletSpeed : 4.6 * BS,bulletImage :18};
    gunTypes[46] = {price : 80,  speed : 30, range : 2.4 * BS, attackType : "closest", damage : 18, bulletLife : 700,  bulletSpeed : 4.8 * BS,bulletImage :18};
    gunTypes[56] = {price : 250, speed : 20, range : 3   * BS, attackType : "weakest", damage : 35, bulletLife : 1000, bulletSpeed : 6   * BS,bulletImage :18};

    // gun 8
    gunTypes[7]  = {price : 5,   speed : 50, range : 2   * BS, attackType : "closest", damage : 10, bulletLife : 500,  bulletSpeed : 4   * BS,bulletImage :18};
    gunTypes[17] = {price : 10,  speed : 45, range : 2.1 * BS, attackType : "closest", damage : 12, bulletLife : 550,  bulletSpeed : 4.2 * BS,bulletImage :18};
    gunTypes[27] = {price : 20,  speed : 50, range : 2.2 * BS, attackType : "closest", damage : 14, bulletLife : 600,  bulletSpeed : 4.4 * BS,bulletImage :18};
    gunTypes[37] = {price : 40,  speed : 35, range : 2.3 * BS, attackType : "closest", damage : 16, bulletLife : 650,  bulletSpeed : 4.6 * BS,bulletImage :18};
    gunTypes[47] = {price : 80,  speed : 30, range : 2.4 * BS, attackType : "closest", damage : 18, bulletLife : 700,  bulletSpeed : 4.8 * BS,bulletImage :18};
    gunTypes[57] = {price : 250, speed : 20, range : 3   * BS, attackType : "weakest", damage : 35, bulletLife : 1000, bulletSpeed : 6   * BS,bulletImage :18};

    // populate gunTypes Array.
    for (i=0;i<=5;i++){
        for (j=0;j<8;j++){
            gunTypes[i * 10 + j].matrixNumber = i*10+j +1;
            gunTypes[i * 10 + j].image = j;
        }
    }
}

var checkTowerPos = {
    pos : [0,0],
    UDOK : false,
    LROK : false,
    towerType : 1,
    checkUD : false,
    checkLR : false,
};

function preload(){
    game.load.image      ('field'    , 'assets/field.png'            );
    game.load.spritesheet('guns'     , 'assets/guns.png'    ,50,50,20 );
    game.load.spritesheet('bullets'  , 'assets/bullets.png' ,10,10,5 );
    game.load.spritesheet('monster01', 'assets/monster01.png',50,50,4 );
    game.load.spritesheet('monster02', 'assets/monster02.png',50,50,4 );
    game.load.spritesheet('monster03', 'assets/monster03.png',50,50,4 );
    game.load.spritesheet('monster04', 'assets/monster04.png',50,50,4 );
    game.load.spritesheet('monster05', 'assets/monster05.png',50,50,4 );
    game.load.spritesheet('particle' , 'assets/particle.png',50,50,4 );
    game.load.spritesheet('numbers'  , 'assets/numbers.png' ,40,50,10);
    game.load.image      ('reset'    , 'assets/reset.png'            );
    game.load.image      ('gameover' , 'assets/game over.png'        );
    game.load.image      ('upgrade' , 'assets/upgrade.png'           );
    game.load.image      ('blocked'  , 'assets/blocked.png'          );
    game.load.image      ('noMoney'  , 'assets/noMoney.png'          );
    game.load.image      ('lifeBar'  , 'assets/lifeBar.png'          );

    game.load.audio      ("pop"      , 'assets/pop.m4a'              );
    game.load.audio      ("splash"   , 'assets/splash.m4a'           );
    game.load.audio      ("build"    , 'assets/build.m4a'            );

    game.load.script     ('blurX'    , 'filters/BlurX.js'            );
    game.load.script     ('blurY'    , 'filters/BlurY.js'            );
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    build = game.add.audio('build');
    pop = game.add.audio('pop');
    splash = game.add.audio('splash');

    setupGuns();

    bg = game.add.sprite(0, 0, 'field');
    bg.scale.setTo(20 * blockSize/1000, 14 * blockSize/700);
    blocked = game.add.sprite(Math.round(width/3),Math.round(heigth/2),"blocked");
    blocked.scale.setTo(0.5 * blockSize/50,0.5 * blockSize/50);
    blocked.alpha = 0;

    noMoney = game.add.sprite(Math.round(width/3),Math.round(heigth/2),"noMoney");
    noMoney.scale.setTo(0.5 * blockSize/50,0.5 * blockSize/50);
    noMoney.alpha = 0;

	blurX = game.add.filter('BlurX');
	blurY = game.add.filter('BlurY');

    for (x = 0;x < matrixSizeX;x++){
        for (y = 0;y < matrixSizeY;y++){
            fieldArray[x][y] = matrix[Math.floor(y/2) * Math.floor(matrixSizeX/2) + Math.floor(x/2)];
        }
    }
    for (i=0;i<fieldArray.length;i++){
        //console.log(fieldArray[i].join());
    }

    //printGrid(fieldArray)
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(swapGrid(fieldArray), 0);

    pathfinderUD = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinderLR = game.plugins.add(Phaser.Plugin.PathFinderPlugin);

    numbers = game.add.group();
    lifeDigit100 = numbers.create(3 * blockSize + 0 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0); //150
    lifeDigit10 = numbers.create(3 * blockSize + 1 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0); //185
    lifeDigit1 = numbers.create(3 * blockSize + 2 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0); //220
    lifeDigit100.scale.setTo(blockSize/50,blockSize/50);
    lifeDigit10.scale.setTo(blockSize/50,blockSize/50);
    lifeDigit1.scale.setTo(blockSize/50,blockSize/50);
    changeLife(life);

    killDigit100 = numbers.create(7 * blockSize + 0 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    killDigit10 = numbers.create(7 * blockSize + 1 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    killDigit1 = numbers.create(7 * blockSize + 2 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    killDigit100.scale.setTo(blockSize/50,blockSize/50);
    killDigit10.scale.setTo(blockSize/50,blockSize/50);
    killDigit1.scale.setTo(blockSize/50,blockSize/50);
    changeKill(kill);

    moneyDigit1000 = numbers.create(11 * blockSize + 0 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    moneyDigit100 = numbers.create(11 * blockSize + 1 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    moneyDigit10 = numbers.create(11 * blockSize + 2 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    moneyDigit1 = numbers.create(11 * blockSize + 3 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    moneyDigit1000.scale.setTo(blockSize/50,blockSize/50);
    moneyDigit100.scale.setTo(blockSize/50,blockSize/50);
    moneyDigit10.scale.setTo(blockSize/50,blockSize/50);
    moneyDigit1.scale.setTo(blockSize/50,blockSize/50);
    changeMoney(money);

    fieldRec1 = new Phaser.Rectangle(2*BS, 2*BS, 13*BS, 11*BS);
    fieldRec2 = new Phaser.Rectangle(16*BS, 2*BS, 4*BS, 4*BS);
    fieldRec = fieldRec1.union(fieldRec2);

    items = game.add.group();
    //towerBase = [];
    for (i=0; i<8;i++){
        towerBase[i] = items.create((16 + i % 4) * blockSize,(2 + 2*Math.floor(i/4)) * blockSize, 'guns',8);
        towerBase[i].scale.setTo(blockSize/50,blockSize/50);
        towerBase[i].inputEnabled = true;
        //gun[i] = items.create((16 + i % 4) * blockSize,(2 + 2*Math.floor(i/4)) * blockSize, 'guns',i);
        gun[i] = items.create(0,0, 'guns',i);
        //gun[i].scale.setTo(blockSize/50,blockSize/50);
        //towerBase[i] = items.create(0,0, 'guns',8);

        towerBase[i].addChild(gun[i]);
        //game.world.bringToTop(gun[i]);

        towerBase[i].inputEnabled = true;
        towerBase[i].input.enableDrag(false,true,false,false,255,boundsRect = fieldRec1,null);
        towerBase[i].input.enableSnap(blockSize/2, blockSize/2, true, true);
        //towerBase[i].events.onInputUp.add(selectTower);

        towerBase[i].events.onDragStop.add(dragStop,[i,towerBase[i]]);

        gunPrice100 = numbers.create((16 + i % 4) * blockSize,(3 + 2*Math.floor(i/4)) * blockSize, 'numbers', Math.floor(gunTypes[i].price / 100));
        gunPrice10 = numbers.create((16 + i % 4) * blockSize+ 1 * 0.25 * blockSize,(3 + 2*Math.floor(i/4)) * blockSize, 'numbers', Math.floor((gunTypes[i].price%100) / 10));
        gunPrice1 = numbers.create((16 + i % 4) * blockSize + 2 * 0.25 * blockSize,(3 + 2*Math.floor(i/4)) * blockSize, 'numbers', gunTypes[i].price % 10);
        gunPrice100.scale.setTo(blockSize/130,blockSize/130);
        gunPrice10.scale.setTo(blockSize/130,blockSize/130);
        gunPrice1.scale.setTo(blockSize/130,blockSize/130);
    }


    towerBase[8] = items.create(16 * blockSize,6 * blockSize, 'guns',8);
    towerBase[8].scale.setTo(blockSize/50,blockSize/50);

    //removeTower = items.create(16 * blockSize,6 * blockSize, 'guns',19);
    removeTower = items.create(0,0, 'guns',19);
    //removeTower.scale.setTo(blockSize/50,blockSize/50);
    towerBase[8].addChild(removeTower);
    //removeTower.inputEnabled = true;
    //removeTower.events.onInputDown.add(selectTower);
    towerBase[8].inputEnabled = true;
    towerBase[8].input.enableDrag(false,true,false,false,255,boundsRect = fieldRec1,null);
    towerBase[8].input.enableSnap(blockSize/2, blockSize/2, true, true);
    towerBase[8].events.onDragStop.add(dragStop,[8,towerBase[8]]);
    //towerBase[9].events.onInputDown.add(selectTower);

    guns = game.add.group();
    guns.enableBody = true;
    monsters = game.add.group();
    monsters.enableBody = true;
    bullets = game.add.group();
    bullets.enableBody = true;
    game.input.onDown.add(click, self);

    timeBar = game.add.sprite(16 * blockSize, blockSize, 'lifeBar');
    timeBar.scale.setTo(blockSize/50, blockSize/100);

    levelDigit100 = numbers.create(17 * blockSize + 0.5 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    levelDigit10 = numbers.create(17 * blockSize + 1.5 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    levelDigit1 = numbers.create(17 * blockSize + 2.5 * 0.7 * blockSize, Math.floor(blockSize/10), 'numbers',0);
    levelDigit100.scale.setTo(blockSize/50,blockSize/50);
    levelDigit10.scale.setTo(blockSize/50,blockSize/50);
    levelDigit1.scale.setTo(blockSize/50,blockSize/50);



}

function dragStop(){
    i = this[0];
    tb = this[1];
    //console.log("drag of "+this[0]+" at "+event.x+","+event.y +"\n client "+ event.clientX+","+event.clientY+"\n page "+ event.pageX+","+event.pageY+"\nscreen"+ event.screenX+","+event.screenY);
    //console.log("object pos:"+tb.position.x+" "+tb.position.y);

    posX = tb.position.x;
    posY = tb.position.y;
    tb.position.x = (16 + i % 4) * blockSize;
    tb.position.y = (2 + 2*Math.floor(i/4)) * blockSize;

    selectedTower = i;

    if (upgradeActive){
        upgrade.destroy();
        upgrade = {};
        gunPrice100.destroy();
        gunPrice10.destroy();
        gunPrice1.destroy();
        upgradeActive = false;
    }

    if (posX >= 2 * blockSize && posX <= 15 * blockSize && posY >= 2 * blockSize && posY <= 13 * blockSize ){
        if (pauseState === false && resetState === false){
            field = convertReal2Matrix([posX,posY]);
            //console.log("pos: "+field[0]+" "+field[1]);
            // place a tower?
            if (selectedTower <= 7 ){
                //if (fieldArray[field[0]][field[1]] === 0 && money >= gunTypes[selectedTower].price){
                if (fieldArray[field[0]][field[1]] === 0 && fieldArray[field[0]+1][field[1]] === 0 &&
                    fieldArray[field[0]][field[1]+1] === 0 && fieldArray[field[0]+1][field[1]+1] === 0 &&
                    money >= gunTypes[selectedTower].price){
                    temp = [];
                    for (x=0;x<fieldArray.length;x++){
                        temp.push(fieldArray[x].slice(0));
                    }
                    temp[field[0]][field[1]] = 1;
                    temp[field[0]+1][field[1]] = 1;
                    temp[field[0]][field[1]+1] = 1;
                    temp[field[0]+1][field[1]+1] = 1;
                    /*for (x=0;x<fieldArray.length;x++){
                        console.log(temp[x].join()+":"+x);
                    }*/
                    checkTowerPos.pos = [field[0],field[1]];
                    checkTowerPos.towerType = selectedTower;
                    pathfinderUD.setGrid(swapGrid(temp), 0);
                    pathfinderUD.setCallbackFunction(function(path1){
                        if (path1 !== null && path1.length !== 0){
                            pathfinderLR.setGrid(swapGrid(temp), 0);
                            pathfinderLR.setCallbackFunction(function(path2){
                                if (path2 !== null && path2.length !== 0){
                                    placeTower();
                                    if (towerRange){
                                        towerRange.destroy();
                                    }
                                }
                                else{
                                    blocked.alpha = 0.8;
                                }
                            });
                            //pathfinderLR.preparePathCalculation([0, 6], [14,6]);
                            pathfinderLR.preparePathCalculation([0, 12], [28,12]);
                            pathfinderLR.calculatePath();
                        }
                        else{
                            blocked.alpha = 0.8;
                        }
                    });
                    //pathfinderUD.preparePathCalculation([7, 0], [7,12]);
                    pathfinderUD.preparePathCalculation([14, 0], [14,24]);
                    pathfinderUD.calculatePath();

                }
            else if (money < gunTypes[selectedTower].price){
                    console.log("No Money");
                    noMoney.alpha = 0.8;
                    game.world.bringToTop(noMoney);
                }
            }

            // remove tower
            if (selectedTower === 8 &&
                 fieldArray[field[0]][field[1]] !== 0
                 &&
                 fieldArray[field[0]+1][field[1]] === 99 &&
                 fieldArray[field[0]][field[1]+1] === 99 &&
                 fieldArray[field[0]+1][field[1]+1] === 99
                 ){
                if (running){
                    amount = Math.floor(gunTypes[fieldArray[field[0]][field[1]]-1].price/2);
                    console.log("returned "+amount);
                    money += amount;
                }else{
                    amount = Math.floor(gunTypes[fieldArray[field[0]][field[1]]-1].price);
                    console.log("returned "+amount);
                    money += amount;
                }
                changeMoney();
                fieldArray[field[0]][field[1]] = 0;
                fieldArray[field[0]+1][field[1]] = 0;
                fieldArray[field[0]][field[1]+1] = 0;
                fieldArray[field[0]+1][field[1]+1] = 0;
                monsters.forEachExists(function(monster){
                    monster.needsUpdate = true;
                });

                index = findInMatrix(gunArray,field);
                if (index !== -1){
                    gunArray[index].destroy();
                    gunArray.splice(index,1);
                }

                index = findInMatrix(towerBaseArray,field);
                if (index !== -1){
                    towerBaseArray[index].destroy();
                    towerBaseArray.splice(index,1);
                }
                if (selectedInField){
                    selectedInField.destroy();
                }
                if (towerRange){
                    towerRange.destroy();
                }
            }
        }
    }
}

function changeLife(){
    if (life > 1000) {life = 999;}
    else if (life < 0) {life =0;}
    lifeDigit100.frame = Math.floor(life/100);
    lifeDigit10.frame = Math.floor((life%100/10));
    lifeDigit1.frame = life%10;
}

function changeKill(){
    if (kill > 1000) {kill = 999;}
    else if (kill < 0) {kill =0;}
    killDigit100.frame = Math.floor(kill/100);
    killDigit10.frame = Math.floor((kill%100/10));
    killDigit1.frame = kill%10;
}

function changeMoney(){
    if ( money > 10000) {money = 9990;}
    else if (money < 0) {money =0;}
    moneyDigit1000.frame = Math.floor(money/1000);
    moneyDigit100.frame = Math.floor((money%1000)/100);
    moneyDigit10.frame =  Math.floor((money%100) /10);
    moneyDigit1.frame = money%10;
}

function changeLevel(){
    if ( currentWave > 1000) {currentWave = 999;}
    else if (currentWave < 0) {currentWave =0;}
    levelDigit100.frame = Math.floor((currentWave%1000)/100);
    levelDigit10.frame =  Math.floor((currentWave%100) /10);
    levelDigit1.frame = currentWave%10;
}

function printGrid(grid){
    for (y=0;y<grid[0].length;y++){
        s = "";
        for (x=0;x<grid.length;x++){
            s += grid[x][y].toString();
        }
        console.log(s+":"+y);
    }
}

function swapGrid(grid){
    /*
    [
    [1, 2, 3, 4]
    [5, 6, 7, 8]
    [9, 10,11,12]]

    [
    [1, 5, 9 ]
    [2, 6, 10]
    [3, 7, 11]
    [4, 8, 12]]

    */
    //printGrid(grid)
    newgrid = [];
    for (y=0;y<grid[0].length;y++) //4
    {
        tempgrid = [];
        for (x=0;x<grid.length;x++) //3
        {
            tempgrid.push(grid[x][y]);
        }
        newgrid.push(tempgrid);
    }
    //console.log("new:")
    //printGrid(newgrid)

    return newgrid;
}

function selectTower(event){
    //console.log("placed Tower "+event.x+" "+event.y);
    /*
    for (i=0; i<8;i++){
        console.log("selectTower "+i);
        if (event.x >= towerBase[i].position.x && event.x <= towerBase[i].position.x &&
            event.y >= towerBase[i].position.y && event.y <= towerBase[i].position.y){
            if (selectedTower === i ){
                selectedTower = 0;
                if (selected){selected.destroy();}
            }
            else{
                selectedTower = i;
                if (selected){selected.destroy();}
                selected = items.create((16 + i % 4) * blockSize,(2 + 2 * Math.floor(i/4)) * blockSize, 'guns',17);
                selected.scale.setTo(blockSize/50,blockSize/50);
            }
        }
    }*/

    //remove tower
    /*
    if (event.x >= towerBase[9].position.x && event.x <= towerBase[9].position.x &&
        event.y >= towerBase[9].position.y && event.y <= towerBase[9].position.y)*/
        if (selectedTower === 9 ){
            selectedTower = 0;
            if (selected){selected.destroy();}
        }
        else{
            selectedTower = 9;
            if (selected){selected.destroy();}
            selected = items.create(16 * blockSize,6 * blockSize, 'guns',17);
            selected.scale.setTo(blockSize/50,blockSize/50);

        }
    console.log("Selected tower is: "+selectedTower);
}

function createTower(realPos, matrixPos, type){
    towerBase = guns.create(realPos[0],realPos[1], 'guns', Math.floor(type/10) + 8);
    towerBase.scale.setTo(blockSize/50,blockSize/50);
    towerBase.matrixPos = [matrixPos[0],matrixPos[1]];

    towerBaseArray.push(towerBase);

    var gun = guns.create(realPos[0] + 25 * blockSize/50, realPos[1] + 25 * blockSize/50, 'guns',gunTypes[type].image);
    gun.scale.setTo(blockSize/50,blockSize/50);
    //gun.anchor.setTo(1 - (0.5 * blockSize/50), 1 - (0.5 * blockSize/50));
    gun.anchor.setTo(0.5,0.5);

    gun.type = type;
    gun.range = gunTypes[type].range;
    gun.speed = gunTypes[type].speed;
    gun.damage = gunTypes[type].damage;
    gun.bulletImage = gunTypes[type].bulletImage;
    gun.counter = 0;
    gun.matrixPos = [matrixPos[0],matrixPos[1]];
    gun.bulletSpeed = gunTypes[type].bulletSpeed;
    gun.bulletLife = gunTypes[type].bulletLife;
    gun.attackType =  gunTypes[type].attackType;
    gunArray.push(gun);

    build.play();
}

function placeTower(){
    type = checkTowerPos.towerType;
    money -= gunTypes[type].price;
    changeMoney();
    if (selectedInField){
        selectedInField.destroy();
        }

    realPos = convertMatrix2Real(checkTowerPos.pos);

    createTower(realPos,checkTowerPos.pos,type);


    // So in matrix number is one higher.
    fieldArray[checkTowerPos.pos[0]][checkTowerPos.pos[1]]     = gunTypes[type].matrixNumber;
    fieldArray[checkTowerPos.pos[0]+1][checkTowerPos.pos[1]]   = 99;
    fieldArray[checkTowerPos.pos[0]][checkTowerPos.pos[1]+1]   = 99;
    fieldArray[checkTowerPos.pos[0]+1][checkTowerPos.pos[1]+1] = 99;

    monsters.forEachExists(function(monster){
        monster.needsUpdate = true;
    });
}

function findInMatrix(array, pos){
    for (i=0;i<array.length;i++){
        if (array[i].matrixPos[0] === pos[0] && array[i].matrixPos[1] === pos[1]){
            return i;
            }
        }
    return -1;
    }

function click(event){
    //console.log("click at "+event.x+","+event.y +"\n client "+ event.clientX+","+event.clientY+"\n page "+ event.pageX+","+event.pageY+"\nscreen"+ event.screenX+","+event.screenY);

    // Check if we click in field

    if (event.x > 2 * blockSize && event.x < 15 * blockSize && event.y > 2 * blockSize && event.y < 13 * blockSize &&
        pauseState === false && resetState === false){
        field = convertReal2Matrix([event.x,event.y]);
        // Select tower for upgrade and show range
        if (fieldArray[field[0]][field[1]] !== 0){
            // detect click pos in block
            if (fieldArray[field[0]][field[1]] === 99){
                //##
                //#*
                if (fieldArray[field[0]-1][field[1]] === 99 && fieldArray[field[0]][field[1]-1] === 99 && fieldArray[field[0]-1][field[1]-1] !== 99){
                    field[0] -= 1;
                    field[1] -= 1;
                }
                //##
                //*#
                if (fieldArray[field[0]+1][field[1]] === 99 && fieldArray[field[0]+1][field[1]-1] === 99 && fieldArray[field[0]][field[1]-1] !== 99){
                    //field[0] -= 1;
                    field[1] -= 1;
                }
                //#*
                //##
                if (fieldArray[field[0]][field[1]+1] === 99 && fieldArray[field[0]-1][field[1]+1] === 99 && fieldArray[field[0]-1][field[1]] !== 99){
                    field[0] -= 1;
                    //field[1] -= 1;
                }

            }
            placeX = convertMatrix2Real(field)[0];
            placeY = convertMatrix2Real(field)[1];

            if (towerRange){
                towerRange.destroy();
            }

            graphics = game.add.graphics(0, 0);
            graphics.lineStyle(0);
            graphics.beginFill(0xffff00, 0.25);
            towerRange = graphics.drawCircle(placeX + halfBlockSize, placeY + halfBlockSize, 2 * gunArray[findInMatrix(gunArray,field)].range);
            towerRange.filters = [blurX, blurY];

            if (upgradeActive){
                upgrade.destroy();
                upgrade = {};
                gunPrice100.destroy();
                gunPrice10.destroy();
                gunPrice1.destroy();
            }
            upgradeActive = true;
            upgrade = game.add.sprite(16 * blockSize, 7 * blockSize, 'upgrade');
            upgrade.scale.setTo( blockSize/50, blockSize/50);
            //console.log("matrix value "+fieldArray[field[0]][field[1]]);
            upgrade.selectedGunIndex = findInMatrix(gunArray,field);

            //console.log("selected gun index "+findInMatrix(gunArray,field));
            upgrade.selectedTowerBaseIndex = findInMatrix(towerBaseArray,field);
            if (upgrade.selectedGunIndex !== -1 && upgrade.selectedTowerBaseIndex!== -1){
                upgrade.newType = gunArray[upgrade.selectedGunIndex].type + 10;

                if (upgrade.newType >= 60){
                    upgrade.newType -= 10;
                    upgrade.price = 0;
                    upgrade.destroy();
                    //upgrade = {};
                    gunPrice100.destroy();
                    gunPrice10.destroy();
                    gunPrice1.destroy();
                    //upgradeActive = false;
                }else{
                    upgrade.price = gunTypes[upgrade.newType].price;
                    gunPrice100 = numbers.create(18 * blockSize,8 * blockSize, 'numbers', Math.floor(upgrade.price / 100));
                    gunPrice10 = numbers.create (18 * blockSize+ 1 * 0.35 * blockSize,8 * blockSize, 'numbers', Math.floor((upgrade.price % 100) / 10));
                    gunPrice1 = numbers.create  (18 * blockSize+ 2 * 0.35 * blockSize, 8 * blockSize, 'numbers', upgrade.price % 10);
                    gunPrice100.scale.setTo(blockSize/100,blockSize/100);
                    gunPrice10.scale.setTo(blockSize/100,blockSize/100);
                    gunPrice1.scale.setTo(blockSize/100,blockSize/100);
                }
            }else{
                console.log("index error");
            }

        }
        // remove range and update text
        else if (fieldArray[field[0]][field[1]] === 0){
            if (upgradeActive){
                upgrade.destroy();
                upgrade = {};
                gunPrice100.destroy();
                gunPrice10.destroy();
                gunPrice1.destroy();
                upgradeActive = false;
            }
            if (towerRange){
                towerRange.destroy();
            }
        }
    }


    // upgrade tower yes
    if (upgradeActive && event.x > 16 * blockSize && event.x < 18 * blockSize &&
                         event.y > 9 * blockSize && event.y < 10 * blockSize ){
            if (money < upgrade.price){
                console.log("no Money");
                noMoney.alpha = 0.8;
                game.world.bringToTop(noMoney);
            }
            else{
                money -= upgrade.price;
                changeMoney();

                console.log("New Tower type is "+upgrade.newType );


                realPos = [gunArray[upgrade.selectedGunIndex].body.position.x,gunArray[upgrade.selectedGunIndex].body.position.y];
                matrixPos = gunArray[upgrade.selectedGunIndex].matrixPos;
                type = upgrade.newType;
                gunArray[upgrade.selectedGunIndex].destroy();
                gunArray.splice(upgrade.selectedGunIndex,1);
                towerBaseArray[upgrade.selectedTowerBaseIndex].destroy();
                towerBaseArray.splice(upgrade.selectedTowerBaseIndex,1);

                createTower(realPos,matrixPos,type);

                fieldArray[matrixPos[0]][matrixPos[1]] = gunTypes[type].matrixNumber;
                fieldArray[matrixPos[0]+1][matrixPos[1]] = 99;
                fieldArray[matrixPos[0]][matrixPos[1]+1] = 99;
                fieldArray[matrixPos[0]+1][matrixPos[1]+1] = 99;
                // no need to update monster.

                if (towerRange){
                    towerRange.destroy();
                }


                graphics = game.add.graphics(0, 0);
                graphics.lineStyle(0);
                graphics.beginFill(0xffff00, 0.25);
                towerRange = graphics.drawCircle(placeX + blockSize/2, placeY + blockSize/2, 2 * gunTypes[type].range);
                towerRange.filters = [blurX, blurY];

                upgrade.destroy();
                upgrade = {};
                gunPrice100.destroy();
                gunPrice10.destroy();
                gunPrice1.destroy();
                upgradeActive = false;
            }
        }
    // upgrade tower no
    else if (upgradeActive && event.x > 18 * blockSize && event.x < 20 * blockSize &&
                              event.y > 9 * blockSize && event.y < 10 * blockSize){
            upgrade.destroy();
            upgrade = {};
            gunPrice100.destroy();
            gunPrice10.destroy();
            gunPrice1.destroy();
            upgradeActive = false;
        }

    // start button
    if (event.x > 16 * blockSize && event.x < 20 * blockSize && event.y > 12 * blockSize && event.y < 13 * blockSize ){
        //Start button was pressed
        console.log("start pressed");
        running = true;
    }

    // pause button
    if (event.x >16 * blockSize && event.x < 20 * blockSize && event.y > 11 * blockSize && event.y < 12 * blockSize ){
        //Pause button was pressed

        if(game.paused){
            game.paused = false;
            reset.destroy();
            pauseState = false;
            resetState = false;
            console.log("games continue");

            //blurX.destroy();
            //blurY.destroy();
        }
        else{
            game.paused = true;
            pauseState = true;
            reset = game.add.sprite(width/4, heigth/2, 'reset');
            reset.scale.setTo(blockSize/50,blockSize/50);
            resetState = true;
            console.log("games paused");

            //bg.filters = [blurX, blurY];


        }
    }
    // unpause
    else if (game.paused && !(event.x >= width/4 && event.x <= width/4 + 7 * blockSize &&
                              event.y >= heigth/2 && event.y<= heigth/2 + 2 * blockSize)){
        game.paused = false;
        reset.destroy();
        pauseState = false;
        resetState = false;
        console.log("games continue");
    }

    // reset button
    if (resetState && event.x >= width/4 && event.x <= width/4 + 7 * blockSize &&
                      event.y >= heigth/2 && event.y<= heigth/2 + 2 * blockSize){
        resetGame();
        reset.destroy();
        if (gameOverState){
            //gameOver.remove();
            gameOver.destroy();
            gameOverState = false;
        }
        if (game.paused === true){
            game.paused = false;
        }
        pauseState = false;
        resetState = false;
    }

}

function explode(pos,tint){

    //emitter.on = true;
    emitter = game.add.emitter(100, 100, 25);

    emitter.makeParticles('particle');
    emitter.minParticleSpeed.setTo(-16 * blockSize, -16 * blockSize);
    emitter.maxParticleSpeed.setTo(16 * blockSize, 16 * blockSize);
    emitter.gravity = 50;
    emitter.minParticleScale = blockSize/100;
    emitter.maxParticleScale = blockSize/100;

    emitter.x = pos[0];
    emitter.y = pos[1];
    emitter.forEach(function(particle) {
        particle.tint = tint;
    });
    emitter.start(true,250,null,25);
}

function bulletHit(bullet,monster){
    // sonic hit
    if (bullet.towerType % 10 === 2){
        towerLevel = Math.floor(bullet.towerType/10);
        if  (towerLevel === 0){
            monster.health = Math.floor(monster.health/7);
        }
        else if (towerLevel === 1){
            monster.health = Math.floor(monster.health/6);
        }
        else if (towerLevel === 2){
            monster.health = Math.floor(monster.health/5);
        }
        else if (towerLevel === 3){
            monster.health = Math.floor(monster.health/4);
        }
        else if (towerLevel === 4){
            monster.health = Math.floor(monster.health/3);
        }
        else if (towerLevel === 5){
            monster.health = Math.floor(monster.health/2);
        }
    }
    // rocket hit
    else if (bullet.towerType % 10 === 3){
        // find monster in neigberhood
        monsters.forEach(function(monsterField){
            if (monsterField !== undefined && monsterField !== monster){
                X = monsterField.body.position.x - bullet.body.position.x;
                Y = monsterField.body.position.y - bullet.body.position.y;
                if (X*X + Y*Y <= 2 * blockSize*blockSize){
                    monsterField.health -= bullet.damage;
                    if (monster.health <= 0){
                        posX = monsterField.body.position.x;
                        posY = monsterField.body.position.y;

                        kill++;
                        changeKill();
                        money += monsterField.price;
                        changeMoney();
                        splash.play();
                        explode([posX,posY],monsterField.tint);
                        monsterField.destroy();
                    }
                    else{
                        scale = monsterField.health / monsterField.startHealth;
                        monsterField.lifeBar.scale.setTo(scale * blockSize/200, blockSize/400);
                    }
                }
            }
        });
        monster.health -= bullet.damage;
    }
    else{
        monster.health -= bullet.damage;
    }

    if (monster.health <= 0){
        posX = monster.body.position.x;
        posY = monster.body.position.y;

        kill++;
        changeKill();
        money += monster.price;
        changeMoney();
        splash.play();
        explode([posX,posY],monster.tint);
        monster.destroy();
    }
    else{
        scale = monster.health / monster.startHealth;
        monster.lifeBar.scale.setTo(scale * blockSize/200, blockSize/400);
    }

    bullet.exists = false;
    //bullet.destroy();
}

function calculateNewPath(monster){
    /*
    Calculates the goto position.
    */
    monster.newPathFound = false;
    pathfinder.setGrid(swapGrid(fieldArray), 0);

    pathfinder.setCallbackFunction(function(path)
    {
        if (path !== null && path.length !== 0)
        {
            monster.path = [];
            path.forEach(function(pos){
                monster.path.push([pos.x,pos.y]);
            });
            monster.needsUpdate = false;
            monster.newPathFound = true;
            monster.goTo[0] = path[1].x;
            monster.goTo[1] = path[1].y;
        }
    });

    currentField = convertReal2Matrix([monster.body.position.x,monster.body.position.y]);
    if (monster.dir === "lr")
    {
        //pathfinder.preparePathCalculation([currentField[0], currentField[1]], [14,7]);
        pathfinder.preparePathCalculation([currentField[0], currentField[1]], [28,14]);
    }
    else if (monster.dir === "ud")
    {
        //pathfinder.preparePathCalculation([currentField[0], currentField[1]], [7,12]);
        pathfinder.preparePathCalculation([currentField[0], currentField[1]], [14,24]);
    }
    pathfinder.calculatePath();
}

function convertMatrix2Real(pos){
    //console.log("In "+pos[0]+","+pos[1]);
    fieldX = Math.round((pos[0]+2) * 0.5 * blockSize);
    fieldY = Math.round((pos[1]+2) * 0.5 * blockSize);
    if (fieldX < 1 * blockSize)
    {fieldX = 1 * blockSize;}
    if (fieldY < 1 * blockSize)
    {fieldY = 1 * blockSize;}
    //console.log("Out "+fieldX+","+fieldY);
    return [fieldX,fieldY];
}

function convertReal2Matrix(pos){
    //console.log("in: "+pos[0]+" "+pos[1]);
    //50 = 0  /25 -2 = 0
    //100 = 2
    //150 = 4
    //200 = 6
    //250 = 8
    //300 = 10
    //350 = 12
    currentFieldX = Math.floor((Math.round(pos[0]))/(0.5*blockSize)) -2;
    currentFieldY = Math.floor((Math.round(pos[1]))/(0.5*blockSize))-2 ;
    //console.log("out: "+currentFieldX+" "+currentFieldY);
    if (currentFieldX < 0){
        currentFieldX=0;
        }
    else if (currentFieldX > fieldArray.length - 1){
        currentFieldX = fieldArray.length - 1;
        }
    if (currentFieldY < 0){
        currentFieldY=0;
        }
    else if (currentFieldY > fieldArray[0].length - 1){
        currentFieldY = fieldArray[0].length - 1;
        }

    return [currentFieldX,currentFieldY];
}

function resetGame(){
    console.log("Resetting game.");
    money = 100;
    life = 20;
    kill = 0;
    counter = 0;
    running = false;
    changeKill();
    changeLife();
    changeMoney();
    for (x = 0;x < matrixSizeX;x++){
        for (y = 0;y < matrixSizeY;y++){
            fieldArray[x][y] = matrix[Math.floor(y/2) * Math.floor(matrixSizeX/2) + Math.floor(x/2)];
        }
    }
    monsters.removeAll();
    bullets.removeAll();
    guns.removeAll();
    gunArray = [];
    if (towerRange){
        towerRange.destroy();
    }
    //monsterArray = [];
    currentWave = 0;
    currentMonster = 0;
    changeLevel()
}

function attackClosestMonster(gun){
    var monsterToAttack = null;
    for (i=0;i<monsters.length;i++){
        monster =monsters.getAt(i);
        delta = game.physics.arcade.distanceBetween(gun,monster);
        //console.log("Delta: "+delta);
        if ( delta < gun.range && delta < closest){
            closest = delta;
            monsterToAttack = monster;
        }
    }
    return monsterToAttack;
}

function attackFarestMonster(gun){
    var monsterToAttack = null;
    var farest = 0;
    for (i=0;i<monsters.length;i++){
        monster = monsters.getAt(i);
        delta = game.physics.arcade.distanceBetween(gun,monster);
        //console.log("Delta: "+delta);
        if ( delta < gun.range && delta > farest){
            farest = delta;
            monsterToAttack = monster;
        }
    }
    return monsterToAttack;
}

function attackWeakestMonster(gun){
    var monsterToAttack = null;
    var lowestLife = 1000;
    for (i=0;i<monsters.length;i++){
        monster =monsters.getAt(i);
        delta = game.physics.arcade.distanceBetween(gun,monster);
        //console.log("Delta: "+delta);
        if ( delta < gun.range && monster.health < lowestLife){
            lowestLife = monster.health;
            monsterToAttack = monster;
        }
    }
    return monsterToAttack;
}

function attackStrongestMonster(gun){
    var monsterToAttack = null;
    var highestLife = 0;
    for (i=0;i<monsters.length;i++){
        monster =monsters.getAt(i);
        delta = game.physics.arcade.distanceBetween(gun,monster);
        //console.log("Delta: "+delta);
        if ( delta < gun.range && monster.health > highestLife){
            highestLife = monster.health;
            monsterToAttack = monster;
        }
    }
    return monsterToAttack;
}

function callbackFunction(variable,callback){
    //console.log(variable);
    callback();
}

function releaseMonster(){

    if (Math.floor(Math.random()*10) % 2 === 0){
        // up down
        posX = convertMatrix2Real([14,0])[0];
        posY = convertMatrix2Real([14,0])[1];
        velo = [0,10];
        dir = "ud";
    }
    else{
        //left right
        posX = convertMatrix2Real([0,12])[0];
        posY = convertMatrix2Real([0,12])[1];
        velo = [10,0];
        dir = "lr";
    }
    console.log("monsterstart pos: "+posX+","+posY);
    monster = monsters.create(posX, posY , monsterTypes[waves[currentWave % waves.length].order[currentMonster]].image);
    monster.dir = dir;
    //monster.scale.setTo(blockSize/50,blockSize/50);
    monster.scale.setTo(blockSize/100,blockSize/100);
    monster.speed = monsterTypes[waves[currentWave % waves.length].order[currentMonster]].speed;
    monster.body.velocity.x = velo[0];
    monster.body.velocity.y = velo[1];
    monster.anchor.setTo(0.5, 0.5);
    monster.animations.add('move', [0,1,2,3], 5, true);
    monster.animations.play('move');
    monster.startHealth = monsterTypes[waves[currentWave % waves.length].order[currentMonster]].life;
    monster.health = monster.startHealth;
    monster.goTo = convertReal2Matrix([monster.body.position.x,monster.body.position.y]);
    monster.alive = true;
    monster.price = monsterTypes[waves[currentWave % waves.length].order[currentMonster]].price;
    monster.needsUpdate = true;
    monster.path = [monster.goTo];
    monster.newPathFound = false;
    monster.pathPos = 1;
    //color = Math.floor(Math.random() * 0xffffff);
    monster.tint = monsterTypes[waves[currentWave % waves.length].order[currentMonster]].color;

    monster.lifeBar = game.add.sprite(-halfBlockSize, -halfBlockSize, 'lifeBar');
    monster.lifeBar.scale.setTo(blockSize/200, blockSize/400);
    monster.addChild(monster.lifeBar);
}

function update(){
    counter++;

    game.physics.arcade.overlap(bullets, monsters, bulletHit, null, this);
    time = timer-counter;


    // timer bar
    if (running  && (time % 5 ===0  )){
        //console.log(timer-counter);
        //time = timer-counter;
        if (time <=0){
            time = 0;
        }
        callbackFunction(time,function(){
            timeBar.scale.setTo((time/500) * blockSize/50, blockSize/100);
            });

    }

    // spawn monsters
    if (running && counter >= timer){
        counter = 0;

        if (currentMonster === 0){
            // timer in wave
            timer = waves[currentWave % waves.length].betweenMonstersTime;
        }

        callbackFunction("",releaseMonster);

        currentMonster ++;
        // new wave
        if (currentMonster >= waves[currentWave % waves.length].order.length){
            currentWave  ++;

            changeLevel();
            currentMonster = 0;
            timer  = waves[currentWave % waves.length].betweenWavesTime;

        }
    }

    // check up on guns
    guns.forEach(function(gun){
        gun.counter++;
        closest = gun.range + 1;
        if (gun.attackType === "closest"){
            monsterToAttack = attackClosestMonster(gun);
        }
        else if (gun.attackType === "weakest"){
            monsterToAttack = attackWeakestMonster(gun);
        }
        else if (gun.attackType === "farest"){
            monsterToAttack = attackFarestMonster(gun);
        }
        else if (gun.attackType === "strongest"){
            monsterToAttack = attackStrongestMonster(gun);
        }
        else{
            monsterToAttack = attackClosestMonster(gun);
        }


        if (monsterToAttack){
            gun.body.rotation = game.physics.arcade.angleBetween(monsterToAttack,gun)* 180 / Math.PI + 180+90;
            if (gun.counter >= gun.speed )
            {
                gun.counter = 0;

                var bullet = bullets.create(gun.position.x - 5, gun.position.y - 5, 'guns', gun.bulletImage);
                bullet.scale.setTo(blockSize/50,blockSize/50);
                bullet.anchor.setTo(0.5, 0.5);
                bullet.damage = gun.damage;
                bullet.lifespan = gun.bulletLife;
                bullet.body.velocity = game.physics.arcade.velocityFromRotation(game.physics.arcade.angleBetween(monsterToAttack,gun)+Math.PI, gun.bulletSpeed);
                bullet.body.rotation = gun.body.rotation;
                bullet.towerType= gun.type;
                pop.play();
            }
        }
    });

    // check up on monsters
    monsters.forEach(function(monster){
        //monster.body.velocity.y = 0;
        //monster.body.velocity.x = monster.speed;


        if (monster !== undefined){
            goToRealX = convertMatrix2Real(monster.goTo)[0];
            goToRealY = convertMatrix2Real(monster.goTo)[1];

            monX = Math.round(monster.body.position.x);
            monY = Math.round(monster.body.position.y);
            blockSizeCorrection = Math.round(blockSize/10);
            //console.log("Pos: "+monX+","+monY);
            //console.log("Velo: "+monster.body.velocity.x+","+monster.body.velocity.y);
            //console.log("X: "+Math.abs(goToRealX - monX)+" Y:"+Math.abs(goToRealY - monY));
            if (Math.abs(goToRealX - monX) <= 3*blockSizeCorrection &&
                Math.abs(goToRealY - monY) <= 3*blockSizeCorrection ||
                monX <= 1.5 * blockSize - blockSizeCorrection ||
                monY <= 1.5 * blockSize - blockSizeCorrection){
                // monster has reached it's goto position.
                //calculateNewPath(monster);
                //console.log("reached goto pos.");
                if (monster.needsUpdate)
                {
                    //console.log("New calculation!");
                    calculateNewPath(monster);
                    monster.pathPos = 1;
                    monster.needsUpdate = false;
                }
                if (monster.newPathFound && !monster.needsUpdate &&
                    monX > 1.5 * blockSize - blockSizeCorrection &&
                    monY > 1.5 * blockSize - blockSizeCorrection ){
                    monster.pathPos++;
                    if (monster.pathPos >= monster.path.length){
                        monster.pathPos = monster.path.length - 1;
                        console.log("Monster goto at end of length.");
                    }
                    //monster.newPathFound = false;
                    console.log(monster.pathPos+":"+monster.path[monster.pathPos]+" goto: "+monster.goTo[0]+","+monster.goTo[1]+" field: "+ goToRealX+","+goToRealY);
                    monster.goTo[0] = monster.path[monster.pathPos][0];
                    monster.goTo[1] = monster.path[monster.pathPos][1];
                    goToRealX = convertMatrix2Real(monster.goTo)[0];
                    goToRealY = convertMatrix2Real(monster.goTo)[1];
                    console.log(monster.pathPos+":"+monster.path[monster.pathPos]+" goto: "+monster.goTo[0]+","+monster.goTo[1]+" field: "+ goToRealX+","+goToRealY);

                }
            }


            //currentField = convertReal2Matrix([monster.body.position.x,monster.body.position.y]);

            //console.log("current: "+monX+","+monY+" - "+currentgoToRealX+","+currentgoToRealY+" goto: "+goToRealX+","+goToRealY+" - "+monster.goTo[0]+","+monster.goTo[1])
            /*
            if (monX <= 1.5 * blockSize - blockSizeCorrection){
                // always first push them into the field.
                monster.body.velocity.y = 0;
                monster.body.velocity.x = monster.speed;

            }
            else if (monY <= 1.5 * blockSize - blockSizeCorrection){
                // always first push them into the field.
                monster.body.velocity.x = 0;
                monster.body.velocity.y = monster.speed;

            }
            */
            if (Math.abs(goToRealX - monX) >= Math.abs(goToRealY - monY) ||
                Math.abs(goToRealX - monX) <= Math.floor(blockSizeCorrection/2)){
                // move in Y
                if (goToRealY > monY){
                    monster.body.velocity.y = monster.speed;
                    monster.body.velocity.x = 0;
                }
                else if (goToRealY < monY){
                    monster.body.velocity.y = -monster.speed +halfBlockSize;
                    monster.body.velocity.x = 0;
                }
                else{
                    //fieldY === monY
                    //console.log("fieldY === monY");
                    if (goToRealX > monX){
                        monster.body.velocity.x = monster.speed;
                        monster.body.velocity.y = 0;
                    }
                    else if (goToRealX < monX){
                        monster.body.velocity.x = -monster.speed+halfBlockSize;
                        monster.body.velocity.y = 0;
                    }
                    else{
                        console.log("velo 0! in Y");
                        if (monster.dir === "lr"){
                            monster.body.velocity.x = 10;
                            monster.body.velocity.y = 0;
                            monster.needsUpdate = true;
                        }else{
                            monster.body.velocity.x = 0;
                            monster.body.velocity.y = 10;
                            monster.needsUpdate = true;
                        }

                    }
                }
            }
            else if (Math.abs(goToRealX - monX) < Math.abs(goToRealY - monY) ||
                     Math.abs(goToRealY - monY) <= Math.floor(blockSizeCorrection/2)){
                // move in X
                //console.log("move in X");
                if (goToRealX > monX){
                    monster.body.velocity.x = monster.speed;
                    monster.body.velocity.y = 0;
                }
                else if (goToRealX < monX){
                    monster.body.velocity.x = -monster.speed+halfBlockSize;
                    monster.body.velocity.y = 0;
                }
                else{
                    // fieldX === monX
                    console.log("fieldX === monX");
                    if (goToRealY > monY){
                        monster.body.velocity.y = monster.speed;
                        monster.body.velocity.x = 0;
                    }
                    else if (goToRealY < monY){
                        monster.body.velocity.y = -monster.speed+halfBlockSize;
                        monster.body.velocity.x = 0;
                    }
                    else{
                        console.log("velo 0! in X");
                        monster.body.velocity.x = 0;
                        monster.body.velocity.y = 0;
                    }
                }
                //console.log("Velo: "+monster.body.velocity.x +","+monster.body.velocity.y );
            }
            //console.log("monster pos: "+currentFieldX+" "+currentFieldY)

            // They made it!
            if (monster.body.position.x >= (matrixSizeX * blockSize/2) - blockSizeCorrection ||
                monster.body.position.y >= (matrixSizeY * blockSize/2) - blockSizeCorrection ){
                monsters.remove(monster,true);
                //monster.alive = false;
                life--;
                changeLife();
                if (life <= 0)
                {
                    //Game Over!
                    gameOver = game.add.sprite(Math.round(width/4), Math.round(heigth/4), 'gameover');
                    gameOver.scale.setTo(blockSize/50,blockSize/50);
                    if (game.paused === false) {game.paused = true;}
                    reset = game.add.sprite(width/4, heigth/2, 'reset');
                    resetState = true;
                    gameOverState = true;
                }

            }
        }
    });

    /*monsterArray = monsterArray.filter(function(monster){
        return (monster.alive);
    });*/


    // check up on bullets
    for (i=0;i<bullets.length;i++){
        bullet = bullets.getAt(i);
        if (!bullet.exists || (bullet.body.position.x > 15 * blockSize || bullet.body.position.x < 2 * blockSize ||
             bullet.body.position.y > 13 * blockSize||bullet.body.position.y < 2 * blockSize) ){
            toBeRemoved.push(bullet);
        }
    }
    // clean up bullets.
    for (i=0; i<toBeRemoved.length; i++){
        toBeRemoved[i].destroy();
    }

    // fade blocked away
    if (blocked.alpha > 0.04){
        blocked.alpha -= 0.02;
    }
    else{
        blocked.alpha = 0;
    }
    // fade noMoney away
    if (noMoney.alpha > 0.04){
        noMoney.alpha -= 0.02;
    }
    else{
        noMoney.alpha = 0;
    }


    // fade particles
    count = 0;
    if (emitter){
        emitter.forEachAlive(function(p){
    		p.alpha = p.lifespan / emitter.lifespan;
            count++;
        });
    }

}
