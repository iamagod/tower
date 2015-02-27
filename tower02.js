/*
Tower Defence.

11x13 game field
game field is 100,100 x 750x650

TODO:
- add remove tower
- add sound
- add kill animation
- add waves
- add colors to monsters
- add blocksizes for better resizing
- add multiple towers
- add upgrades
- add half size to level
*/

var width = 1000;
var heigth = 700;
var game = new Phaser.Game(width, heigth, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var towerBase;
var gun01;
var gun02;
var numbers;
var selectedTower = 0;
var selected;
var selectedInField;
var running = false;
var monsterArray = [];
var bulletArray = [];
var gunArray = [];
var towerBaseArray =[];
var money = 50;
var life = 20;
var kill = 0;
var towerPrice =[];
var bg;
var blocked;

var resetState = false;
var gameOverState = false;
var gameOver;
var pauseState = false;
var counter = 0;


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
    game.load.spritesheet('guns'     , 'assets/guns.png'    ,50,50,6 );
    game.load.spritesheet('bullets'  , 'assets/bullets.png' ,10,10,5 );
    game.load.spritesheet('monster01', 'assets/baddie01.png',50,50,4 );
    game.load.spritesheet('numbers'  , 'assets/numbers.png' ,40,50,10);
    game.load.image      ('reset'    , 'assets/reset.png'            );
    game.load.image      ('gameover' , 'assets/game over.png'        );
    game.load.image      ('blocked'  , 'assets/blocked.png'          );
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bg = game.add.sprite(0, 0, 'field');
    blocked = game.add.sprite(Math.round(width/3),Math.round(heigth/2),"blocked");
    blocked.scale.setTo(0.5,0.5);
    blocked.alpha = 0;

    for (x=0;x<15;x++){
        for (y=0;y<13;y++){
            fieldArray[x][y] = matrix[y * 15 + x];
        }
    }

    //printGrid(fieldArray)
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(swapGrid(fieldArray), 0);

    pathfinderUD = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinderLR = game.plugins.add(Phaser.Plugin.PathFinderPlugin);



    numbers = game.add.group();
    lifeDigit100 = numbers.create(145, 5, 'numbers',0);
    lifeDigit10 = numbers.create(180, 5, 'numbers',0);
    lifeDigit1 = numbers.create(215, 5, 'numbers',0);

    changeLife(life);

    killDigit100 = numbers.create(360, 5, 'numbers',0);
    killDigit10 = numbers.create(395, 5, 'numbers',0);
    killDigit1 = numbers.create(430, 5, 'numbers',0);

    changeKill(kill);

    moneyDigit1000 = numbers.create(560, 5, 'numbers',0);
    moneyDigit100 = numbers.create(595, 5, 'numbers',0);
    moneyDigit10 = numbers.create(630, 5, 'numbers',0);
    moneyDigit1 = numbers.create(665, 5, 'numbers',0);

    changeMoney(money);

    items = game.add.group();

    towerBase = items.create(800,100, 'guns',2);
    gun01 = items.create(800,100, 'guns',0);
    gun01.inputEnabled = true;
    gun01.events.onInputDown.add(selectTower);
    towerPrice[1] = 5;

    towerBase = items.create(850,100, 'guns',2);
    gun02 = items.create(850,100, 'guns',1);
    gun02.inputEnabled = true;
    gun02.events.onInputDown.add(selectTower);
    towerPrice[2] = 10;

    towerBase = items.create(800,300, 'guns',2);
    removeTower = items.create(800,300, 'guns',5);
    removeTower.inputEnabled = true;
    removeTower.events.onInputDown.add(selectTower);

    guns = game.add.group();
    guns.enableBody = true;
    monsters = game.add.group();
    monsters.enableBody = true;
    bullets = game.add.group();
    bullets.enableBody = true;
    game.input.onDown.add(click, self);

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
    if (event.x >= gun01.position.x && event.x <= gun01.position.x && event.y >= gun01.position.y && event.y <= gun01.position.y){
        if (selectedTower === 1){
            selectedTower = 0;
            selected.destroy();
        }
        else{
            selectedTower = 1;
            if (selected){selected.destroy();}
            selected = items.create(800,100, 'guns');
            selected.frame = 3;
        }
    }
    else if (event.x >= gun02.position.x && event.x <= gun02.position.x && event.y >= gun02.position.y && event.y <= gun02.position.y){
        if (selectedTower === 2){
            selectedTower = 0;
            selected.destroy();
        }
        else{
            selectedTower = 2;
            if (selected){selected.destroy();}
            selected = items.create(850,100, 'guns');
            selected.frame = 3;
        }
    }
    else if (event.x >= removeTower.position.x && event.x <= removeTower.position.x && event.y >= removeTower.position.y && event.y <= removeTower.position.y)
        if (selectedTower === 9){
            selectedTower = 0;
            selected.destroy();
        }
        else{
            selectedTower = 9;
            if (selected){selected.destroy();}
            selected = items.create(800,300, 'guns');
            selected.frame = 3;
        }
}

function placeTower(){
    money -= towerPrice[checkTowerPos.towerType];
    changeMoney();
    if (selectedInField){
        selectedInField.destroy();
        }

    realPos = convertMatrix2Real(checkTowerPos.pos);

    towerBase = guns.create(realPos[0],realPos[1], 'guns', 2);
    towerBase.matrixPos = [checkTowerPos.pos[0],checkTowerPos.pos[1]];

    towerBaseArray.push(towerBase);

    var gun = guns.create(realPos[0] + 25, realPos[1] + 25, 'guns',checkTowerPos.towerType - 1);
    gun.anchor.setTo(0.5, 0.5);
    gun.type = checkTowerPos.towerType;
    gun.range = 200;
    gun.speed = checkTowerPos.towerType * 50;
    gun.counter = 0;
    gun.matrixPos = [checkTowerPos.pos[0],checkTowerPos.pos[1]];

    gunArray.push(gun);

    //game.world.bringToTop(gun);

    fieldArray[checkTowerPos.pos[0]][checkTowerPos.pos[1]] = checkTowerPos.towerType;
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
    if (event.x >100 && event.x<750 && event.y>100 && event.y<650 ){
        if (pauseState === false && resetState === false){
            field = convertReal2Matrix([event.x,event.y]);
            // which tower?
            if ((selectedTower === 1 || selectedTower === 2)){
                if (fieldArray[field[0]][field[1]] === 0 && money >= towerPrice[selectedTower]){
                    temp = [];
                    for (x=0;x<fieldArray.length;x++){
                        temp.push(fieldArray[x].slice(0));
                    }
                    temp[field[0]][field[1]] = 1;

                    checkTowerPos.pos = [field[0],field[1]];
                    pathfinderUD.setGrid(swapGrid(temp), 0);
                    pathfinderUD.setCallbackFunction(function(path1){
                        if (path1 !== null && path1.length !== 0){
                            pathfinderLR.setGrid(swapGrid(temp), 0);
                            pathfinderLR.setCallbackFunction(function(path2){
                                if (path2 !== null && path2.length !== 0){
                                    placeTower();
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
                    checkTowerPos.towerType = selectedTower;
                }
                else if (fieldArray[field[0]][field[1]] !== 0){
                    // Select tower for upgrade
                    placeX = event.x - event.x % 50;
                    placeY = event.y - event.y % 50;
                    if (selectedInField){
                        selectedInField.destroy();
                        }
                    selectedInField  = guns.create(placeX,placeY, 'guns');
                    selectedInField.frame = 3;
                }
            }
            // remove tower
            else if (selectedTower === 9 && fieldArray[field[0]][field[1]] !== 0){
                money += Math.floor(towerPrice[fieldArray[field[0]][field[1]]]/2);
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
            }
        }
    }

    // start button
    if (event.x >800 && event.x<1000 && event.y>600 && event.y<650 ){
        //Start button was pressed
        console.log("start pressed");
        running = true;
    }

    // pause button
    if (event.x >800 && event.x<1000 && event.y>550 && event.y<600 ){
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
            resetState = true;
            console.log("games paused");
        }
    }

    // reset button
    if (resetState && event.x >= width/2 && event.x <= width/2+350 && event.y >= heigth/2 && event.y<= heigth/2 +100){
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
        monster.destroy();
        //monster.alive = false;
        //monster.exists = false;
        kill++;
        changeKill();
        money += monster.price;
        changeMoney();
    }
    else{
        //scale = monster.health / monster.startHealth;
        //monster.scale.setTo(scale, scale);
    }

    bullet.exists = false;
    //bullet.destroy();
    //bullet.alive = false;
    //bullets.remove(bullet);
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
    fieldX = Math.round(pos[0] * 50 + 50);
    fieldY = Math.round(pos[1] * 50 + 50);
    if (fieldX < 100)
    {fieldX = 100;}
    if (fieldY<100)
    {fieldY = 100;}
    return [fieldX,fieldY];
}

function convertReal2Matrix(pos){
    currentFieldX = Math.floor((Math.round(pos[0]))/50) -1;
    currentFieldY = Math.floor((Math.round(pos[1]))/50) -1;
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
    money = 50;
    life = 20;
    kill = 0;
    counter = 0;
    running = false;
    changeKill();
    changeLife();
    changeMoney();
    for (x=0;x<15;x++){
        for (y=0;y<13;y++){
            fieldArray[x][y] = matrix[y * 15 + x];
        }
    }
    monsters.removeAll();
    bullets.removeAll();
    guns.removeAll();
    gunArray = [];
    monsterArray = [];
}

function update(){
    counter++;
    game.physics.arcade.overlap(bullets, monsters, bulletHit, null, this);

    // spawn monsters
    if (running ){
        if ( counter  >= 180){
            counter = 0;
            // should be 3* a second
            // Release a enemy
            if (Math.floor(Math.random()*10) % 2 === 0){
                // up down
                monster = monsters.create(450, 50 , 'monster01');
                monster.dir = "ud";
            }
            else{
                //left right
                monster = monsters.create(50, 350 , 'monster01');
                monster.dir = "lr";
            }
            monsterArray.push(monster);
            monster.speed = 100;
            monster.body.velocity.x = 0;
            monster.body.velocity.y = 0;
            monster.anchor.setTo(0.5, 0.5);
            monster.animations.add('move', [0,1,2,3], 5, true);
            monster.animations.play('move');
            monster.startHealth = 200;
            monster.health = monster.startHealth;
            monster.goTo = convertReal2Matrix([monster.body.position.x,monster.body.position.y]);
            monster.alive = true;
            monster.price = 5;
            monster.needsUpdate = true;
            monster.path = [monster.goTo];
            monster.newPathFound = false;
            monster.pathPos = 1;
            color = Math.floor(Math.random() * 0xffffff);
            console.log(color.toString(16));
            monster.tint = color;
        }
    }


    // check up on guns
    for (g=0;g<gunArray.length;g++){
        gun = gunArray[g];
        gun.counter++;
        closest = gun.range + 1;
        monster = null;
        for (m = 0; m < monsterArray.length; m++){
            delta = game.physics.arcade.distanceBetween(gun,monsterArray[m]);
            if ( delta < gun.range && delta < closest){
                closest = delta;
                monster = monsterArray[m];
            }
        }
        if (monster){
            gun.body.rotation = game.physics.arcade.angleBetween(monster,gun)* 180 / Math.PI + 180+90;
            if (gun.counter >= gun.speed )
            {
                gun.counter = 0;
                gun.anchor.setTo(0.5, 0.5);
                var bullet = bullets.create(gun.position.x - 5, gun.position.y - 5, 'bullets', gun.type - 1);

                // gun.type 12 ==> turret 2 upgrade 1 so 2*5*2= 20
                // gun.type 01 ==> turret 2 upgrade 1 so 1*5*1= 5
                // gun.type 51 ==> turret 2 upgrade 1 so 1*5*5= 25
                bullet.damage = (gun.type%10)*5*(1+Math.floor(gun.type/10));
                bullet.alive = true;
                bullet.lifespan = 500;
                bullet.body.velocity = game.physics.arcade.velocityFromRotation(game.physics.arcade.angleBetween(monster,gun)+Math.PI, 400 - gun.type*100);
            }
        }
        else
        {
            // no monster in range stop shooting
        }


    }

    // check up on monsters
    for (i=0;i<monsterArray.length;i++){
        monster = monsterArray[i];

        goToRealX = convertMatrix2Real(monster.goTo)[0];
        goToRealY = convertMatrix2Real(monster.goTo)[1];

        monX = Math.round(monster.body.position.x);
        monY = Math.round(monster.body.position.y);
        if (Math.abs(goToRealX - monX) <= 10 && Math.abs(goToRealY - monY) <= 10 || monX <=95 || monY <= 95)
        {
            // monster has reached it's goto position.
            //calculateNewPath(monster);
            ///*
            if (monster.needsUpdate)
            {
                //console.log("New calculation!");
                calculateNewPath(monster);
                monster.pathPos = 1;
                monster.needsUpdate = false;
            }
            if (monster.newPathFound && !monster.needsUpdate &&  monX > 95 && monY > 95){
                monster.pathPos++;
                if (monster.pathPos >= monster.path.length){
                    monster.pathPos = monster.path.length - 1;
                }
                //monster.newPathFound = false;
                //console.log(monster.pathPos+":"+monster.path[monster.pathPos]+" goto: "+monster.goTo[0]+","+monster.goTo[1]+" field: "+ goToRealX+","+goToRealY);
                monster.goTo[0] = monster.path[monster.pathPos][0];
                monster.goTo[1] = monster.path[monster.pathPos][1];
            }//*/
        }

        //currentField = convertReal2Matrix([monster.body.position.x,monster.body.position.y]);

        //console.log("current: "+monX+","+monY+" - "+currentgoToRealX+","+currentgoToRealY+" goto: "+goToRealX+","+goToRealY+" - "+monster.goTo[0]+","+monster.goTo[1])
        if (monX <= 95)
        {
            // always first push them into the field.
            monster.body.velocity.y = 0;
            monster.body.velocity.x = monster.speed;

        }
        else if (monY <= 95)
        {
            // always first push them into the field.
            monster.body.velocity.x = 0;
            monster.body.velocity.y = monster.speed;

        }
        else if (Math.abs(goToRealX - monX) >= Math.abs(goToRealY - monY) || Math.abs(goToRealX - monX)<=2)
        {
            // move in Y

            if (goToRealY > monY)
            {
                monster.body.velocity.y = monster.speed;
                monster.body.velocity.x = 0;
            }
            else if (goToRealY < monY)
            {
                monster.body.velocity.y = -monster.speed;
                monster.body.velocity.x = 0;
            }
            else
            {
                //fieldY === monY
                //console.log("fieldY === monY");
                if (goToRealX > monX)
                {
                    monster.body.velocity.x = monster.speed;
                    monster.body.velocity.y = 0;
                }
                else if (goToRealX < monX)
                {
                    monster.body.velocity.x = -monster.speed;
                    monster.body.velocity.y = 0;
                }
                else
                {
                    console.log("velo 0!");
                    monster.body.velocity.x = 0;
                    monster.body.velocity.y = 0;
                }
            }
        }
        else if (Math.abs(goToRealX - monX) < Math.abs(goToRealY - monY) || Math.abs(goToRealY - monY) <= 2)
        {
            // move in X
            //console.log("move in X");
            if (goToRealX > monX)
            {
                monster.body.velocity.x = monster.speed;
                monster.body.velocity.y = 0;
            }
            else if (goToRealX < monX)
            {
                monster.body.velocity.x = -monster.speed;
                monster.body.velocity.y = 0;
            }
            else
            {
                // fieldX === monX
                console.log("fieldX === monX");
                if (goToRealY > monY)
                {
                    monster.body.velocity.y = monster.speed;
                    monster.body.velocity.x = 0;
                }
                else if (goToRealY < monY)
                {
                    monster.body.velocity.y = -monster.speed;
                    monster.body.velocity.x = 0;
                }
                else
                {
                    console.log("velo 0!");
                    monster.body.velocity.x = 0;
                    monster.body.velocity.y = 0;
                }
            }
            //console.log("Velo: "+monster.body.velocity.x +","+monster.body.velocity.y );

        }

        //console.log("monster pos: "+currentFieldX+" "+currentFieldY)


        if (monster.body.position.x >= 745 || monster.body.position.y >= 645)
        {
            // They made it!
            monster.destroy();
            monster.alive = false;
            life--;
            changeLife();
            if (life <= 0)
            {
                //Game Over!
                gameOver = game.add.sprite(Math.round(width/4), Math.round(heigth/4), 'gameover');
                if (game.paused === false) {game.paused = true;}
                reset = game.add.sprite(width/2, heigth/2, 'reset');
                resetState = true;
                gameOverState = true;
            }

        }
    }

    monsterArray = monsterArray.filter(function(monster){
        return (monster.alive);
    });

    // check up on bullets
    bullets.forEachExists(function (bullet){
        if ((bullet.body.position.x > 750 || bullet.body.position.x < 100 || bullet.body.position.y > 650||bullet.body.position.y < 100) ){
            bullet.exists = false;
            //bullet.destroy();
            //bullet.remove();
        }
    });

    // fade blocked away
    if (blocked.alpha > 0.04){
        blocked.alpha -= 0.02;
    }
    else{
        blocked.alpha = 0;
    }
}
