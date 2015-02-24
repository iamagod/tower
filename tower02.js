var width = 1024;
var heigth = 700;
var game = new Phaser.Game(width, heigth, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//var PF = require('pathfinding');

// 11x13 game field
// game field is 100,100 x 750x650
function preload()
{
    game.load.image      ('field'    , 'assets/field.png'            );
    game.load.spritesheet('guns'     , 'assets/guns.png'    ,50,50,5 );
    game.load.spritesheet('bullets'  , 'assets/bullets.png' ,10,10,5 );
    game.load.spritesheet('monster01', 'assets/baddie01.png',50,50,4 );
    game.load.spritesheet('numbers'  , 'assets/numbers.png' ,40,50,10);
    game.load.image      ('reset'    , 'assets/reset.png'            );
    game.load.image      ('gameover' , 'assets/game over.png'         );

}
var towerBase;
var gun01;
var gun02;
var numbers;
var selectedTower = 0;

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

var resetState = false;
var gameOverState = false;
var pauseState = false;

function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bg = game.add.sprite(0, 0, 'field');

    for (x=0;x<15;x++)
    {
        for (y=0;y<13;y++)
        {
            //console.log(x+" "+y+":"+matrix[y * 15 + x])
            //console.log(fieldArray[x])
            fieldArray[x][y] = matrix[y * 15 + x];
        }

    }

    //printGrid(fieldArray)
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(swapGrid(fieldArray), 0);


    numbers = game.add.group();
    lifeDigit100 = numbers.create(145, 5, 'numbers');
    lifeDigit100.frame = 0;
    lifeDigit10 = numbers.create(180, 5, 'numbers');
    lifeDigit10.frame = 0;
    lifeDigit1 = numbers.create(215, 5, 'numbers');
    lifeDigit1.frame = 0;

    changeLife(life);

    killDigit100 = numbers.create(360, 5, 'numbers');
    killDigit100.frame = 0;
    killDigit10 = numbers.create(395, 5, 'numbers');
    killDigit10.frame = 0;
    killDigit1 = numbers.create(430, 5, 'numbers');
    killDigit1.frame = 0;

    changeKill(kill);

    moneyDigit1000 = numbers.create(560, 5, 'numbers');
    moneyDigit1000.frame = 0;
    moneyDigit100 = numbers.create(595, 5, 'numbers');
    moneyDigit100.frame = 0;
    moneyDigit10 = numbers.create(630, 5, 'numbers');
    moneyDigit10.frame = 0;
    moneyDigit1 = numbers.create(665, 5, 'numbers');
    moneyDigit1.frame = 0;

    changeMoney(money);

    items = game.add.group();

    towerBase = items.create(800,100, 'guns');
    towerBase.frame = 2;
    gun01 = items.create(800,100, 'guns');
    gun01.frame = 0;
    gun01.inputEnabled = true;
    gun01.events.onInputDown.add(placeTower);
    towerPrice[1] = 5;

    towerBase = items.create(850,100, 'guns');
    towerBase.frame = 2;
    gun02 = items.create(850,100, 'guns');
    gun02.frame = 1;
    gun02.inputEnabled = true;
    gun02.events.onInputDown.add(placeTower);
    towerPrice[2] = 10;

    guns = game.add.group();
    guns.enableBody = true;
    monsters = game.add.group();
    monsters.enableBody = true;
    bullets = game.add.group();
    bullets.enableBody = true;
    game.input.onDown.add(click, self);

}

function changeLife()
{

    if (life > 1000) {life = 999;}
    else if (life < 0) {life =0;}
    lifeDigit100.frame = Math.floor(life/100);
    lifeDigit10.frame = Math.floor((life%100/10));
    lifeDigit1.frame = life%10;
}

function changeKill()
{
    var kill = kill;
    if (kill > 1000) {kill = 999;}
    else if (kill < 0) {kill =0;}
    killDigit100.frame = Math.floor(kill/100);
    killDigit10.frame = Math.floor((kill%100/10));
    killDigit1.frame = kill%10;
}

function changeMoney()
{
    if ( money > 10000) {money = 9990;}
    else if (money < 0) {money =0;}
    moneyDigit1000.frame = Math.floor(money/1000);
    moneyDigit100.frame = Math.floor((money%1000)/100);
    moneyDigit10.frame =  Math.floor((money%100) /10);
    moneyDigit1.frame = money%10;
}

function printGrid(grid)
{

    for (y=0;y<grid[0].length;y++)
    {
        s = "";
        for (x=0;x<grid.length;x++)
        {
            s += grid[x][y].toString();
        }
        console.log(s+":"+y);
    }
}

function swapGrid(grid)
{
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

    return newgrid
}

function click(event)
{
    fieldX = Math.floor(event.x/50) -1;
    fieldY = Math.floor(event.y/50) -1;
    console.log("click "+selectedTower+" "+fieldX+" "+fieldY );

    // Check if we click in field
    if (selectedTower === 1 || selectedTower === 2 && pauseState === false)
    {
        if (event.x >100 && event.x<750 && event.y>100 && event.y<650 )
        {
            placeX = event.x - event.x % 50;
            placeY = event.y - event.y % 50;

            if (fieldArray[fieldX][fieldY] === 0 && money >= towerPrice[selectedTower])
            {
                money -= towerPrice[selectedTower];
                changeMoney()
                if (selectedInField){selectedInField.kill();}
                towerBase = guns.create(placeX,placeY, 'guns');
                towerBase.frame = 2;
                towerBaseArray.push(towerBase);
                var gun = guns.create(placeX+25, placeY+25, 'guns');
                gun.frame = selectedTower - 1;
                gun.anchor.setTo(0.5, 0.5);
                gun.type = selectedTower;
                gun.range = 200;
                gun.speed = selectedTower * 50;
                gun.counter = 0;

                gunArray.push(gun);

                game.world.bringToTop(gun);

                fieldArray[fieldX][fieldY] = selectedTower;

            }
            else
            {
                // Select tower for upgrade
                if (selectedInField){selectedInField.kill();}
                selectedInField  = guns.create(placeX,placeY, 'guns');
                selectedInField.frame = 3;

            }

        }
    }
    if (event.x >800 && event.x<1000 && event.y>600 && event.y<650 )
    {
        //Start button was pressed
        console.log("start pressed")
        running = true
    }
    if (event.x >800 && event.x<1000 && event.y>550 && event.y<600 )
    {
        //Pause button was pressed

        if(game.paused)
        {
            game.paused = false;
            reset.destroy()
            pauseState = false;
            console.log("games continue")
        }
        else
        {
            game.paused = true;
            pauseState = true
            reset = game.add.sprite(width/2, heigth/2, 'reset');
            resetState = true;
            console.log("games paused")
        }
    }
    if (resetState && event.x >= width/2 && event.x <= width/2+350 && event.y >= heigth/2 && event.y<= heigth/2 +100)
    {
        resetState = false;
        reset.destroy()
        if (gameOverState)
        {
            gameOver.destroy();
            gameOverState = false;
        }
        ResetGame()
        game.paused = false;
        pauseState = false;
    }
}

function ResetGame()
{
    console.log("Resetting game.")
    money = 50;
    life = 20;
    kill = 0;
    counter = 0;
    running = false;
    changeKill();
    changeLife();
    changeMoney();
    for (x=0;x<15;x++)
    {
        for (y=0;y<13;y++)
        {
            //console.log(x+" "+y+":"+matrix[y * 15 + x])
            //console.log(fieldArray[x])
            fieldArray[x][y] = matrix[y * 15 + x];
        }
    }
    monsterArray.forEach(function (monster){
        monster.kill()
    });
    monsterArray = []
    bulletArray.forEach(function (bullet){
        bullet.kill()
        bullet.body.velocity = 20000;
    });
    bulletArray = []
    gunArray.forEach(function (gun){
        gun.kill()
    });
    gunArray = [];
    towerBaseArray.forEach(function (towerBase){
        towerBase.kill()
    });
    towerBaseArray = [];

}

function placeTower(event)
{
    console.log("placed Tower "+event.x+" "+event.y)
    if (event.x >= gun01.position.x && event.x <= gun01.position.x && event.y >= gun01.position.y && event.y <= gun01.position.y)
    {
        if (selectedTower === 1)
        {
            selectedTower = 0;
            selected.kill();

        }
        else
        {
            //console.log("selected")
            selectedTower = 1;
            if (selected){selected.kill();}
            selected = items.create(800,100, 'guns');
            selected.frame = 3;
            //game.world.bringToTop(selected);
        }

    }
    else if (event.x >= gun02.position.x && event.x <= gun02.position.x && event.y >= gun02.position.y && event.y <= gun02.position.y)
    {
        if (selectedTower === 2)
        {
            selectedTower = 0;
            selected.kill();
        }
        else
        {
            selectedTower = 2;
            if (selected){selected.kill();}
            selected = items.create(850,100, 'guns');
            selected.frame = 3;

        }

    }
}

function findPathTo(tilex, tiley) {

    pathfinder.setCallbackFunction(function(path) {
        //console.log(path)
    });

    pathfinder.preparePathCalculation([0, 6], [tilex,tiley]);
    pathfinder.calculatePath();
}



function bulletHit(bullet,monster)
{

    bullet.exists = false;
    //console.log(monster.health+" "+bullet.damage)
    monster.health -= bullet.damage;
    if (monster.health <= 0)
    {
        monster.kill();
        monster.alive = false;
        kill++
        changeKill();
        money += monster.price;
        changeMoney();
    }
    else{
        scale = monster.health / monster.startHealth;
        monster.scale.setTo(scale, scale)
    }
    bullet.kill;
}

var counter = 0;
//var globalMonster;

function calculateCurrent(pos)
{
    currentFieldX = Math.floor((Math.round(pos[0]))/50) -1;
    currentFieldY = Math.floor((Math.round(pos[1]))/50) -1;
    if (currentFieldX < 0){currentFieldX=0;}
    else if (currentFieldX > 14){currentFieldX=14;}
    if (currentFieldY < 0){currentFieldY=0;}
    else if (currentFieldY > 12){currentFieldY=12;}

    return [currentFieldX,currentFieldY]
}

function setGoTo(monster)
{
    /*
    Calculates the goto position.
    */
    pathfinder.setGrid(swapGrid(fieldArray), 0);
    //globalMonster = monster;
    //globalMonster.pathFound = false;

    pathfinder.setCallbackFunction(function(path)
    {
        /*
        temp = []
        for (x=0;x<fieldArray.length;x++)
        {
            temp.push(fieldArray[x].slice(0))
        }
        */
        //console.log(path)
        if (path !== null && path.length !== 0)
        {
            monster.goTo[0] = path[1].x;
            monster.goTo[1] = path[1].y;
            /*
            //monster.pathFound = true;
            if (path.length > 7){l = 7;}
            else{l=path.length;}
            for (k=0;k<l;k++)
            {
                //console.log("path found go to "+k+": [" + path[k].x+","+path[k].y+"]")
                temp[path[k].x][path[k].y] = k+2;

            }
            //console.log("path found go to: [" + path[1].x+","+path[1].y+"]")

            printGrid(temp)
            */

        }

    });

    currentField = calculateCurrent([monster.body.position.x,monster.body.position.y]);
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

function calculateDistanceDouble(x,y)
{
    return (x[0]-y[0])*(x[0]-y[0])+(x[1]-y[1])*(x[1]-y[1])
}

function calculateGoToToWorldCor(pos)
{
    fieldX = Math.round(pos[0] * 50 + 50);
    fieldY = Math.round(pos[1] * 50 + 50);
    if (fieldX < 100)
    {fieldX = 100;}
    if (fieldY<100)
    {fieldY = 100;}
    return [fieldX,fieldY]
}

function update()
{

    //console.log(counter)
    counter++;
    game.physics.arcade.overlap(bullets, monsters, bulletHit, null, this);

    if (running )
    {

        if ( counter  >= 180)
        {
            counter = 0;
            // should be 3* a second
            // Release a enemy
            if (Math.floor(Math.random()*10) % 2 === 0)
            {
                // up down
                monster = monsters.create(450, 50 , 'monster01');
                monster.dir = "ud";

            }
            else
            {
                //left right
                monster = monsters.create(50, 350 , 'monster01');
                monster.dir = "lr"

            }
            //monster = monsters.create(50, 350 , 'monster01');
            monsterArray.push(monster);
            monster.speed = 50;
            monster.body.velocity.x = 0;
            monster.body.velocity.y = 0;
            monster.anchor.setTo(0.5, 0.5);
            //monster.anchor.setTo(1, 1);
            monster.animations.add('move', [0,1,2,3], 10, true);
            monster.animations.play('move');
            monster.startHealth = 100;
            monster.health = monster.startHealth;
            //monster.goTo = []
            monster.goTo = calculateCurrent([monster.body.position.x,monster.body.position.y])
            monster.alive = true;
            monster.price = 5;
            //monster.goTo[1] = pos[1]

        }
    }


    for (g=0;g<gunArray.length;g++)
    {

        gun = gunArray[g];
        gun.counter++;
        closest = gun.range + 1;
        monster = null
        for (m = 0; m < monsterArray.length; m++)
        {

            delta = game.physics.arcade.distanceBetween(gun,monsterArray[m])
            if ( delta < gun.range)
            {
                if (delta < closest)
                {
                    closest = delta;
                    monster = monsterArray[m];
                }
            }
        }
        if (monster)
        {
            gun.body.rotation = game.physics.arcade.angleBetween(monster,gun)* 180 / Math.PI + 180+90;
            if (gun.counter >= gun.speed )
            {
                gun.counter = 0;
                var bullet = bullets.create(gun.position.x - 5, gun.position.y - 5, 'bullets');
                bullet.frame = gun.type - 1;
                // gun.type 12 ==> turret 2 upgrade 1 so 2*5*2= 20
                // gun.type 01 ==> turret 2 upgrade 1 so 1*5*1= 5
                // gun.type 51 ==> turret 2 upgrade 1 so 1*5*5= 25
                bullet.damage = (gun.type%10)*5*(1+Math.floor(gun.type/10));
                gun.anchor.setTo(0.5, 0.5);
                bulletArray.push(bullet);
                //bullet.body.rotation = game.physics.arcade.angleBetween(monster,gun);
                bullet.body.velocity = game.physics.arcade.velocityFromRotation(game.physics.arcade.angleBetween(monster,gun)+Math.PI, 400 - gun.type*100);
            }
        }
        else
        {
            // no monster in range stop shooting
        }


    }

    toBeRemoved = []
    for (i=0;i<monsterArray.length;i++)
    {
        // check up on monsters
        monster = monsterArray[i];

        field = calculateGoToToWorldCor(monster.goTo);

        monX = Math.round(monster.body.position.x);
        monY = Math.round(monster.body.position.y);
        if (Math.abs(field[0] - monX) <= 10 && Math.abs(field[1] - monY) <= 10 || monX <=95 || monY <= 95)
        {
            setGoTo(monster);
        }

        currentField = calculateCurrent([monster.body.position.x,monster.body.position.y]);

        //console.log("current: "+monX+","+monY+" - "+currentField[0]+","+currentField[1]+" goto: "+field[0]+","+field[1]+" - "+monster.goTo[0]+","+monster.goTo[1])
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
        else if (Math.abs(field[0] - monX) >= Math.abs(field[1] - monY) || Math.abs(field[0] - monX)<=2)
        {
            // move in Y

            if (field[1] > monY)
            {
                monster.body.velocity.y = monster.speed;
                monster.body.velocity.x = 0;
            }
            else if (field[1] < monY)
            {
                monster.body.velocity.y = -monster.speed;
                monster.body.velocity.x = 0;
            }
            else
            {
                //fieldY === monY
                if (field[0] > monX)
                {
                    monster.body.velocity.x = monster.speed;
                    monster.body.velocity.y = 0;
                }
                else if (field[0] < monX)
                {
                    monster.body.velocity.x = -monster.speed;
                    monster.body.velocity.y = 0;
                }
                else
                {
                    monster.body.velocity.x = 0;
                    monster.body.velocity.y = 0;
                }
            }
        }
        else if (Math.abs(field[0] - monX) < Math.abs(field[1] - monY) || Math.abs(field[1] - monY) <= 2)
        {
            // move in X

            if (field[0] > monX)
            {
                monster.body.velocity.x = monster.speed;
                monster.body.velocity.y = 0;
            }
            else if (field[0] < monX)
            {
                monster.body.velocity.x = -monster.speed;
                monster.body.velocity.y = 0;
            }
            else
            {
                // fieldX === monX
                if (field[1] > monY)
                {
                    monster.body.velocity.y = monster.speed;
                    monster.body.velocity.x = 0;
                }
                else if (field[1] < monY)
                {
                    monster.body.velocity.y = -monster.speed;
                    monster.body.velocity.x = 0;
                }
                else
                {
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
            monster.kill();
            monster.alive = false;
            life--;
            changeLife()
            if (life<=0)
            {
                //Game Over!
                gameOver = game.add.sprite(width/4, heigth/4, 'gameover');
                game.pause = true;
                reset = game.add.sprite(width/2, heigth/2, 'reset');
                resetState = true;
                gameOverState = true;
            }

        }
    }

    monsterArray = monsterArray.filter(function (monster){
        return (monster.alive)
    });

    bulletArray = bulletArray.filter(function (bullet){
        if (bullet.body.position.x > 750 || bullet.body.position.x < 100 || bullet.body.position.y > 650||bullet.body.position.y < 100){
                bullet.kill();
                return true;
            }
        else{
            return false
        }
    });

}
