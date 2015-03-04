/*
Tower Defence.

11x13 game field
game field is 100,100 x 750x650

TODO:
- add multiple towers
- add upgrades

- add life bar to monsters

- add half size to level
- update sound
- make counter bar nicer
- add more monster versions
- fix build in front of gate bug
*/

var blockSize = 50;

var matrixSizeX = 15;
var matrixSizeY = 13;

var width = 20 * blockSize; //1000
var heigth = 14 * blockSize; //700
var game = new Phaser.Game(width, heigth, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var towerBase;
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
var money = 100;
var life = 20;
var kill = 0;
var towerPrice =[];
var toBeRemoved = [];
var bg;
var blocked;

var resetState = false;
var gameOverState = false;
var gameOver;
var pauseState = false;
var counter = 0;

var currentWave = 0;
var currentMonster = 0;
var timer = 180;
var counter = 1000;
var towerRange;
var bar;
var timerBar;
var emitter;

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

var fieldArray = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //0
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //1
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //2
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //3
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //4
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //5
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //6
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //7
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //8
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //9
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //10
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //11
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //12
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], //13
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]]; //14

var waves = [
    {order :[2,2,2,2,2],                                     betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[3,3,3,3,3],                                     betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[4,4,4,4,4],                                     betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[1,1,1,1,1],                                     betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[1,2,1,2,1],                                     betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[1,1,1,2,2,2],                                   betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[3,3,3,2,2,2],                                   betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,1,2],                               betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,1,2,1,2,1,2],                       betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,1,1,3,3,1,1,1,1],                   betweenMonstersTime :180 ,betweenWavesTime: 500},
    {order :[1,3,1,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], betweenMonstersTime :180 ,betweenWavesTime: 500},
    ];

var monsterTypes = [];
monsterTypes[1] = {
    life : 200,
    speed : 4 * blockSize,
    image : "monster01",
    price : 5,
    color : 0xff0000,
};

monsterTypes[2] = {
    life : 100,
    speed : 2 * blockSize,
    image : "monster02",
    price : 2,
    color : 0x00ff00,
};

monsterTypes[3] = {
    life : 150,
    speed : 3 * blockSize,
    image : "monster03",
    price : 4,
    color : 0x0000ff,
};

monsterTypes[4] = {
    life : 25,
    speed : 6 * blockSize,
    image : "monster04",
    price : 5,
    color : 0xff00ff,
};

var gunTypes = [];
gunTypes[0] = {
    price : 5,
    speed : 2 * blockSize,
    range : 2 * blockSize,
    matrixNumber :1,
    image : 0,
    attackType : "closest",
};
gunTypes[1] = {
    price : 10,
    speed : 4 * blockSize,
    range : 4 * blockSize,
    matrixNumber :2,
    image : 1,
    attackType : "weakest",
};
gunTypes[2] = {
    price : 10,
    speed : 4 * blockSize,
    range : 4 * blockSize,
    matrixNumber :3,
    image : 2,
    attackType : "weakest",
};
gunTypes[3] = {
    price : 10,
    speed : 4 * blockSize,
    range : 4 * blockSize,
    matrixNumber :4,
    image : 3,
    attackType : "weakest",
};
gunTypes[4] = {
    price : 10,
    speed : 4 * blockSize,
    range : 4 * blockSize,
    matrixNumber :5,
    image : 4,
    attackType : "weakest",
};
gunTypes[5] = {
    price : 10,
    speed : 4 * blockSize,
    range : 4 * blockSize,
    matrixNumber :6,
    image : 5,
    attackType : "weakest",
};
gunTypes[6] = {
    price : 10,
    speed : 4 * blockSize,
    range : 4 * blockSize,
    matrixNumber :7,
    image : 6,
    attackType : "weakest",
};
gunTypes[7] = {
    price : 10,
    speed : 4 * blockSize,
    range : 4 * blockSize,
    matrixNumber :8,
    image : 7,
    attackType : "weakest",
};

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
    game.load.spritesheet('monster01', 'assets/baddie01.png',50,50,4 );
    game.load.spritesheet('monster02', 'assets/baddie02.png',50,50,4 );
    game.load.spritesheet('monster03', 'assets/baddie03.png',50,50,4 );
    game.load.spritesheet('monster04', 'assets/baddie04.png',50,50,4 );
    game.load.spritesheet('particle' , 'assets/particle.png',50,50,4 );
    game.load.spritesheet('numbers'  , 'assets/numbers.png' ,40,50,10);
    game.load.image      ('reset'    , 'assets/reset.png'            );
    game.load.image      ('gameover' , 'assets/game over.png'        );
    game.load.image      ('blocked'  , 'assets/blocked.png'          );
    game.load.audio      ("pop"      , 'assets/pop.m4a'              );
    game.load.audio      ("splash"   , 'assets/splash.m4a'           );
    game.load.audio      ("build"    , 'assets/build.m4a'            );
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    build = game.add.audio('build');
    pop = game.add.audio('pop');
    splash = game.add.audio('splash');

    bg = game.add.sprite(0, 0, 'field');
    bg.scale.setTo(20 * blockSize/1000, 14 * blockSize/700);
    blocked = game.add.sprite(Math.round(width/3),Math.round(heigth/2),"blocked");
    blocked.scale.setTo(0.5 * blockSize/50,0.5 * blockSize/50);
    blocked.alpha = 0;

    for (x = 0;x < matrixSizeX;x++){
        for (y = 0;y < matrixSizeY;y++){
            fieldArray[x][y] = matrix[y * matrixSizeX + x];
        }
    }

    //printGrid(fieldArray)
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(swapGrid(fieldArray), 0);

    pathfinderUD = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinderLR = game.plugins.add(Phaser.Plugin.PathFinderPlugin);

    numbers = game.add.group();
    lifeDigit100 = numbers.create(3 * blockSize + 0 * 0.7 * blockSize, 5, 'numbers',0); //150
    lifeDigit10 = numbers.create(3 * blockSize + 1 * 0.7 * blockSize, 5, 'numbers',0); //185
    lifeDigit1 = numbers.create(3 * blockSize + 2 * 0.7 * blockSize, 5, 'numbers',0); //220
    lifeDigit100.scale.setTo(blockSize/50,blockSize/50);
    lifeDigit10.scale.setTo(blockSize/50,blockSize/50);
    lifeDigit1.scale.setTo(blockSize/50,blockSize/50);
    changeLife(life);

    killDigit100 = numbers.create(7 * blockSize + 0 * 0.7 * blockSize, 5, 'numbers',0);
    killDigit10 = numbers.create(7 * blockSize + 1 * 0.7 * blockSize, 5, 'numbers',0);
    killDigit1 = numbers.create(7 * blockSize + 2 * 0.7 * blockSize, 5, 'numbers',0);
    killDigit100.scale.setTo(blockSize/50,blockSize/50);
    killDigit10.scale.setTo(blockSize/50,blockSize/50);
    killDigit1.scale.setTo(blockSize/50,blockSize/50);
    changeKill(kill);

    moneyDigit1000 = numbers.create(11 * blockSize + 0 * 0.7 * blockSize, 5, 'numbers',0);
    moneyDigit100 = numbers.create(11 * blockSize + 1 * 0.7 * blockSize, 5, 'numbers',0);
    moneyDigit10 = numbers.create(11 * blockSize + 2 * 0.7 * blockSize, 5, 'numbers',0);
    moneyDigit1 = numbers.create(11 * blockSize + 3 * 0.7 * blockSize, 5, 'numbers',0);
    moneyDigit1000.scale.setTo(blockSize/50,blockSize/50);
    moneyDigit100.scale.setTo(blockSize/50,blockSize/50);
    moneyDigit10.scale.setTo(blockSize/50,blockSize/50);
    moneyDigit1.scale.setTo(blockSize/50,blockSize/50);
    changeMoney(money);

    items = game.add.group();

    for (i=0; i<8;i++){
        towerBase = items.create((16 + i % 4) * blockSize,(2 + 2*Math.floor(i/4)) * blockSize, 'guns',8);
        towerBase.scale.setTo(blockSize/50,blockSize/50);
        gun[i] = items.create((16 + i % 4) * blockSize,(2 + 2*Math.floor(i/4)) * blockSize, 'guns',i);
        gun[i].scale.setTo(blockSize/50,blockSize/50);
        gun[i].inputEnabled = true;
        gun[i].events.onInputDown.add(selectTower);

        gunPrice10 = numbers.create((16 + i % 4) * blockSize,(3 + 2*Math.floor(i/4)) * blockSize, 'numbers', Math.floor(gunTypes[i].price / 10));
        gunPrice1 = numbers.create((16 + i % 4) * blockSize + 1 * 0.35 * blockSize,(3 + 2*Math.floor(i/4)) * blockSize, 'numbers', gunTypes[i].price % 10);
        gunPrice10.scale.setTo(blockSize/100,blockSize/100);
        gunPrice1.scale.setTo(blockSize/100,blockSize/100);

    }


    towerBase = items.create(16 * blockSize,6 * blockSize, 'guns',8);
    towerBase.scale.setTo(blockSize/50,blockSize/50);
    removeTower = items.create(16 * blockSize,6 * blockSize, 'guns',19);
    removeTower.scale.setTo(blockSize/50,blockSize/50);
    removeTower.inputEnabled = true;
    removeTower.events.onInputDown.add(selectTower);

    guns = game.add.group();
    guns.enableBody = true;
    monsters = game.add.group();
    monsters.enableBody = true;
    bullets = game.add.group();
    bullets.enableBody = true;
    game.input.onDown.add(click, self);

    emitter = game.add.emitter(100, 100, 15000);

    emitter.makeParticles('particle');
    emitter.minParticleSpeed.setTo(-16 * blockSize, -16 * blockSize);
    emitter.maxParticleSpeed.setTo(16 * blockSize, 16 * blockSize);
    emitter.gravity = 0;
    emitter.minParticleScale = 0.5;
    emitter.maxParticleScale = 0.5;

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
    for (i=0; i<8;i++){
        if (event.x >= gun[i].position.x && event.x <= gun[i].position.x &&
            event.y >= gun[i].position.y && event.y <= gun[i].position.y){
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
    }

    //remove tower
    if (event.x >= removeTower.position.x && event.x <= removeTower.position.x &&
        event.y >= removeTower.position.y && event.y <= removeTower.position.y)
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

function placeTower(){
    type = checkTowerPos.towerType;
    money -= gunTypes[type].price;
    changeMoney();
    if (selectedInField){
        selectedInField.destroy();
        }

    realPos = convertMatrix2Real(checkTowerPos.pos);

    towerBase = guns.create(realPos[0],realPos[1], 'guns', 8);
    towerBase.scale.setTo(blockSize/50,blockSize/50);
    towerBase.matrixPos = [checkTowerPos.pos[0],checkTowerPos.pos[1]];

    towerBaseArray.push(towerBase);

    var gun = guns.create(realPos[0] + 25 * blockSize/50, realPos[1] + 25 * blockSize/50, 'guns',type);
    gun.scale.setTo(blockSize/50,blockSize/50);
    //gun.anchor.setTo(1 - (0.5 * blockSize/50), 1 - (0.5 * blockSize/50));
    gun.anchor.setTo(0.5,0.5);

    gun.type = type;
    gun.range = gunTypes[type].range;
    gun.speed = gunTypes[type].speed;
    gun.counter = 0;
    gun.matrixPos = [checkTowerPos.pos[0],checkTowerPos.pos[1]];

    gunArray.push(gun);

    build.play();

    // So in matrix number is one higher.
    fieldArray[checkTowerPos.pos[0]][checkTowerPos.pos[1]] = gunTypes[type].matrixNumber;
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
    // Check if we click in field
    if (event.x > 2 * blockSize && event.x < 15 * blockSize && event.y > 2 * blockSize && event.y < 13 * blockSize ){
        if (pauseState === false && resetState === false){
            field = convertReal2Matrix([event.x,event.y]);
            // which tower?
            if (selectedTower <= 7 ){
                if (fieldArray[field[0]][field[1]] === 0 && money >= gunTypes[selectedTower].price){
                    temp = [];
                    for (x=0;x<fieldArray.length;x++){
                        temp.push(fieldArray[x].slice(0));
                    }
                    temp[field[0]][field[1]] = 1;

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
                            pathfinderLR.preparePathCalculation([0, 7], [14,7]);
                            pathfinderLR.calculatePath();
                        }
                        else{
                            blocked.alpha = 0.8;
                        }
                    });
                    pathfinderUD.preparePathCalculation([7, 0], [7,12]);
                    pathfinderUD.calculatePath();

                }
                else if (fieldArray[field[0]][field[1]] !== 0){
                    // Select tower for upgrade and show range
                    placeX = event.x - event.x % 50;
                    placeY = event.y - event.y % 50;
                    //if (selectedInField){
                    //    selectedInField.destroy();
                    //}
                    if (towerRange){
                        towerRange.destroy();
                    }
                    //selectedInField  = guns.create(placeX,placeY, 'guns',3);

                    var graphics = game.add.graphics(0, 0);
                    graphics.lineStyle(0);
                    graphics.beginFill(0xffff00, 0.25);
                    towerRange = graphics.drawCircle(placeX + blockSize/2, placeY + blockSize/2,2 * gunArray[findInMatrix(gunArray,field)].range);

                }
            }
            // remove tower
            if (selectedTower === 9 && fieldArray[field[0]][field[1]] !== 0){
                money += Math.floor(gunTypes[fieldArray[field[0]][field[1]]].price/2);
                changeMoney();
                fieldArray[field[0]][field[1]] = 0;
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

    // start button
    if (event.x > 16 * blockSize && event.x < 20 * blockSize && event.y > 12 * blockSize && event.y < 13 * blockSize ){
        //Start button was pressed
        console.log("start pressed");
        running = true;
    }

    // pause button
    if (event.x >16 * blockSize && event.x < 20 * blockSize && event.y > 11 * blockSize && event.y < 12 * blockSize ){
        //Pause button was pressed

        if(game.paused)
        {
            game.paused = false;
            reset.destroy();
            pauseState = false;
            console.log("games continue");
        }
        else
        {
            game.paused = true;
            pauseState = true;
            reset = game.add.sprite(width/2, heigth/2, 'reset');
            reset.scale.setTo(blockSize/50,blockSize/50);
            resetState = true;
            console.log("games paused");
        }
    }

    // reset button
    if (resetState && event.x >= width/2 && event.x <= width/2 + 7 * blockSize && event.y >= heigth/2 && event.y<= heigth/2 + 2 * blockSize){
        resetGame();
        reset.destroy();
        if (gameOverState){
            //gameOver.remove();
            gameOver.destroy();
            gameOverState = false;
        }
        if (game.paused === true){game.paused = false;}
        pauseState = false;
        resetState = false;
    }
}

function bulletHit(bullet,monster){
    //console.log(monster.health+" "+bullet.damage)

    monster.health -= bullet.damage;
    if (monster.health <= 0)
    {
        posX = monster.body.position.x;
        posY = monster.body.position.y;
        monster.destroy();
        kill++;
        changeKill();
        money += monster.price;
        changeMoney();

        splash.play();

        emitter.x = posX;
        emitter.y = posY;
        emitter.forEach(function(particle) {
            particle.tint = monster.tint;
        });
        emitter.start(true,250,null,5);

    }
    else{
        scale = monster.health / monster.startHealth;
        //monster.scale.setTo(scale, scale);
        monster.alpha = scale;
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
        pathfinder.preparePathCalculation([currentField[0], currentField[1]], [14,7]);
    }
    else if (monster.dir === "ud")
    {
        pathfinder.preparePathCalculation([currentField[0], currentField[1]], [7,12]);
    }
    pathfinder.calculatePath();
}

function convertMatrix2Real(pos){
    fieldX = Math.round(pos[0] * blockSize + blockSize);
    fieldY = Math.round(pos[1] * blockSize + blockSize);
    if (fieldX < 2 * blockSize)
    {fieldX = 2 * blockSize;}
    if (fieldY < 2 * blockSize)
    {fieldY = 2 * blockSize;}
    return [fieldX,fieldY];
}

function convertReal2Matrix(pos){
    currentFieldX = Math.floor((Math.round(pos[0]))/blockSize) -1;
    currentFieldY = Math.floor((Math.round(pos[1]))/blockSize) -1;
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
    for (x = 0; x < matrixSizeX; x++){
        for (y = 0; y < matrixSizeY; y++){
            fieldArray[x][y] = matrix[y * 15 + x];
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

function attackWeakestMonster(gun){
    var monsterToAttack = null;
    var lowestLive = 1000;
    for (i=0;i<monsters.length;i++){
        monster =monsters.getAt(i);
        delta = game.physics.arcade.distanceBetween(gun,monster);
        //console.log("Delta: "+delta);
        if ( delta < gun.range && monster.health < lowestLive){
            lowestLive = monster.health;
            monsterToAttack = monster;
        }
    }
    return monsterToAttack;
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
        if (bar){
            //bar.destroy();
            //timerBar.clear();
            bar.clear();
        }
        //console.log(time);
        timerBar = game.add.graphics(0, 0);
        timerBar.lineStyle(0);
        timerBar.beginFill((255 - Math.floor(time/2)) << 16, 1);
        //timerBar.beginFill(0xFF0000, 1);
        bar = timerBar.drawRect(16 * blockSize, Math.floor(blockSize / 2), time/3, 20);
    }

    // spawn monsters
    if (running && counter >= timer){
        counter = 0;

        if (currentMonster === 0){
            // timer in wave
            timer = waves[currentWave].betweenMonstersTime;
        }

        // Release a enemy
        if (Math.floor(Math.random()*10) % 2 === 0){
            // up down
            monster = monsters.create(9 * blockSize,  blockSize , monsterTypes[waves[currentWave].order[currentMonster]].image);
            monster.dir = "ud";
        }
        else{
            //left right
            monster = monsters.create(blockSize, 7 * blockSize , monsterTypes[waves[currentWave].order[currentMonster]].image);
            monster.dir = "lr";
        }
        monster.scale.setTo(blockSize/50,blockSize/50);
        monster.speed = monsterTypes[waves[currentWave].order[currentMonster]].speed;
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        monster.anchor.setTo(0.5, 0.5);
        monster.animations.add('move', [0,1,2,3], 5, true);
        monster.animations.play('move');
        monster.startHealth = monsterTypes[waves[currentWave].order[currentMonster]].life;
        monster.health = monster.startHealth;
        monster.goTo = convertReal2Matrix([monster.body.position.x,monster.body.position.y]);
        monster.alive = true;
        monster.price = monsterTypes[waves[currentWave].order[currentMonster]].price;
        monster.needsUpdate = true;
        monster.path = [monster.goTo];
        monster.newPathFound = false;
        monster.pathPos = 1;
        //color = Math.floor(Math.random() * 0xffffff);
        monster.tint = monsterTypes[waves[currentWave].order[currentMonster]].color;

        //monsterArray.push(monster);


        currentMonster ++;

        if (currentMonster >= waves[currentWave].order.length){
            // new wave

            currentWave ++;
            currentMonster = 0;
            console.log("Current wave: " + currentWave +" Current monster: " + currentMonster);
            timer  = waves[currentWave].betweenWavesTime;
        }
        if (currentWave >= waves.length){
            console.log("you won");
        }
        // should be 3* a second
    }

    // check up on guns
    guns.forEach(function(gun){
        gun.counter++;
        closest = gun.range + 1;
        if (gun.type === 0){
            monsterToAttack = attackClosestMonster(gun);
        }
        else if (gun.type >= 1){
            monsterToAttack = attackWeakestMonster(gun);
        }
        else{
            monsterToAttack = null;
        }

        /*
        monsters.forEach(function(monster){
            delta = game.physics.arcade.distanceBetween(gun,monster);
            if ( delta < gun.range && delta < closest){
                closest = delta;
                monsterToAttack = monster;
            }
        });*/

        if (monsterToAttack){
            gun.body.rotation = game.physics.arcade.angleBetween(monsterToAttack,gun)* 180 / Math.PI + 180+90;
            if (gun.counter >= gun.speed )
            {
                gun.counter = 0;
                gun.anchor.setTo(0.5, 0.5);
                var bullet = bullets.create(gun.position.x - 5, gun.position.y - 5, 'bullets', 18);
                bullet.scale.setTo(blockSize/50,blockSize/50);
                // gun.type 12 ==> turret 2 upgrade 1 so 2*5*2= 20
                // gun.type 01 ==> turret 2 upgrade 1 so 1*5*1= 5
                // gun.type 51 ==> turret 2 upgrade 1 so 1*5*5= 25
                bullet.damage = ((gun.type + 1) % 10) * 5 * (1 + Math.floor(gun.type / 10));
                bullet.alive = true;
                bullet.lifespan = (gun.type + 1) * 500;
                bullet.body.velocity = game.physics.arcade.velocityFromRotation(game.physics.arcade.angleBetween(monsterToAttack,gun)+Math.PI, gun.speed);
                pop.play();
            }
        }
    });

    // check up on monsters
    monsters.forEach(function(monster){
        if (monster !== undefined){
            goToRealX = convertMatrix2Real(monster.goTo)[0];
            goToRealY = convertMatrix2Real(monster.goTo)[1];

            monX = Math.round(monster.body.position.x);
            monY = Math.round(monster.body.position.y);
            blockSizeCorrection = Math.round(blockSize/10);
            if (Math.abs(goToRealX - monX) <= 2 * blockSizeCorrection &&
                Math.abs(goToRealY - monY) <= 2 * blockSizeCorrection ||
                monX <= 2 * blockSize - blockSizeCorrection ||
                monY <= 2 * blockSize - blockSizeCorrection){
                // monster has reached it's goto position.
                //calculateNewPath(monster);

                if (monster.needsUpdate)
                {
                    //console.log("New calculation!");
                    calculateNewPath(monster);
                    monster.pathPos = 1;
                    monster.needsUpdate = false;
                }
                if (monster.newPathFound && !monster.needsUpdate &&
                    monX > 2 * blockSize - blockSizeCorrection &&
                    monY > 2 * blockSize - blockSizeCorrection ){
                    monster.pathPos++;
                    if (monster.pathPos >= monster.path.length){
                        monster.pathPos = monster.path.length - 1;
                    }
                    //monster.newPathFound = false;
                    //console.log(monster.pathPos+":"+monster.path[monster.pathPos]+" goto: "+monster.goTo[0]+","+monster.goTo[1]+" field: "+ goToRealX+","+goToRealY);
                    monster.goTo[0] = monster.path[monster.pathPos][0];
                    monster.goTo[1] = monster.path[monster.pathPos][1];
                    goToRealX = convertMatrix2Real(monster.goTo)[0];
                    goToRealY = convertMatrix2Real(monster.goTo)[1];
                    //console.log(monster.pathPos+":"+monster.path[monster.pathPos]+" goto: "+monster.goTo[0]+","+monster.goTo[1]+" field: "+ goToRealX+","+goToRealY);

                }
            }


            //currentField = convertReal2Matrix([monster.body.position.x,monster.body.position.y]);

            //console.log("current: "+monX+","+monY+" - "+currentgoToRealX+","+currentgoToRealY+" goto: "+goToRealX+","+goToRealY+" - "+monster.goTo[0]+","+monster.goTo[1])
            if (monX <= 2 * blockSize - blockSizeCorrection){
                // always first push them into the field.
                monster.body.velocity.y = 0;
                monster.body.velocity.x = monster.speed;

            }
            else if (monY <= 2 * blockSize - 5){
                // always first push them into the field.
                monster.body.velocity.x = 0;
                monster.body.velocity.y = monster.speed;

            }
            else if (Math.abs(goToRealX - monX) >= Math.abs(goToRealY - monY) ||
                     Math.abs(goToRealX - monX) <= Math.floor(blockSizeCorrection/2)){
                // move in Y
                if (goToRealY > monY){
                    monster.body.velocity.y = monster.speed;
                    monster.body.velocity.x = 0;
                }
                else if (goToRealY < monY){
                    monster.body.velocity.y = -monster.speed;
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
                        monster.body.velocity.x = -monster.speed;
                        monster.body.velocity.y = 0;
                    }
                    else{
                        console.log("velo 0!");
                        monster.body.velocity.x = 0;
                        monster.body.velocity.y = 0;
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
                    monster.body.velocity.x = -monster.speed;
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
                        monster.body.velocity.y = -monster.speed;
                        monster.body.velocity.x = 0;
                    }
                    else{
                        console.log("velo 0!");
                        monster.body.velocity.x = 0;
                        monster.body.velocity.y = 0;
                    }
                }
                //console.log("Velo: "+monster.body.velocity.x +","+monster.body.velocity.y );
            }
            //console.log("monster pos: "+currentFieldX+" "+currentFieldY)

            if (monster.body.position.x >= (matrixSizeX * blockSize) - blockSizeCorrection ||
                monster.body.position.y >= (matrixSizeY * blockSize) - blockSizeCorrection )
            {
                // They made it!
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
                    reset = game.add.sprite(width/2, heigth/2, 'reset');
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
        //bullets.forEachExists(function (bullet){
        if (!bullet.exists || (bullet.body.position.x > 15 * blockSize || bullet.body.position.x < 2 * blockSize ||
             bullet.body.position.y > 13 * blockSize||bullet.body.position.y < 2 * blockSize) ){
            //bullet.exists = false;
            //bullet.destroy();
            //bullet.remove();
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
}
