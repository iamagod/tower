var width = 1024
var heigth = 768
var game = new Phaser.Game(width, heigth, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//var PF = require('pathfinding');

// 11x13 game field
// game field is 100,100 x 750x650
function preload()
{
    game.load.image      ('field'    , 'assets/field.png'           );
    game.load.spritesheet('guns'     , 'assets/guns.png'    ,50,50,5);
    game.load.spritesheet('bullets'  , 'assets/bullets.png' ,10,10,5);
    game.load.spritesheet('monster01', 'assets/baddie01.png', 50, 50,4);

}
var towerBase
var gun01
var gun02
var selectedTower = 0
var gunArray = []
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


var selected
var selectedInField
var running = false
var monsterArray = []
var bulletArray = []

function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    for (x=0;x<15;x++)
    {
        for (y=0;y<13;y++)
        {
            //console.log(x+" "+y+":"+matrix[y * 15 + x])
            //console.log(fieldArray[x])
            fieldArray[x][y] = matrix[y * 15 + x];
        }

    }
    console.log(fieldArray.length)
    console.log(fieldArray[0].length)

    console.log("fieldarray "+fieldArray[14][12])
    console.log("fieldarray "+fieldArray[3][2])

    printGrid(fieldArray)
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(swapGrid(fieldArray), 0);

    game.add.sprite(0, 0, 'field');
    items = game.add.group();

    towerBase = items.create(800,100, 'guns');
    towerBase.frame = 2;
    gun01 = items.create(800,100, 'guns');
    gun01.frame = 0;
    gun01.inputEnabled = true;
    gun01.events.onInputDown.add(placeTower);

    towerBase = items.create(850,100, 'guns');
    towerBase.frame = 2;
    gun02 = items.create(850,100, 'guns');
    gun02.frame = 1;
    gun02.inputEnabled = true;
    gun02.events.onInputDown.add(placeTower);

    guns = game.add.group();
    guns.enableBody = true;
    monsters = game.add.group();
    monsters.enableBody = true;
    bullets = game.add.group();
    bullets.enableBody = true;
    game.input.onDown.add(click, self);

}

function printGrid(grid)
{

    for (y=0;y<grid[0].length;y++)
    {
        s = ""
        for (x=0;x<grid.length;x++)
        {
            s += grid[x][y].toString()
        }
        console.log(s+":"+y)
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
    newgrid = []
    for (y=0;y<grid[0].length;y++) //4
    {
        tempgrid = []
        for (x=0;x<grid.length;x++) //3
        {
            tempgrid.push(grid[x][y])
        }
        newgrid.push(tempgrid)
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
    if (selectedTower === 1 || selectedTower === 2)
    {
        if (event.x >100 && event.x<750 && event.y>100 && event.y<650 )
        {
            placeX = event.x - event.x % 50;
            placeY = event.y - event.y % 50;
            console.log("fA: "+fieldArray[fieldX][fieldY])
            if (fieldArray[fieldX][fieldY] === 0)
            {
                if (selectedInField){selectedInField.kill();}
                towerBase = guns.create(placeX,placeY, 'guns');
                towerBase.frame = 2;
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
            console.log("games continue")
        }
        else
        {
            game.paused = true;
            console.log("games paused")
        }
    }
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
        console.log(path)
    });

    pathfinder.preparePathCalculation([0, 6], [tilex,tiley]);
    pathfinder.calculatePath();
}



function bulletHit(bullet,monster)
{

    bullet.exists = false;
    //console.log(monster.health+" "+bullet.damage)
    monster.damage(bullet.damage);
    bullet.kill;

}

var counter =50000;
var globalMonster;

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
    globalMonster = monster;
    globalMonster.pathFound = false;

    pathfinder.setCallbackFunction(function(path)
    {
        temp = []
        for (x=0;x<fieldArray.length;x++)
        {
            temp.push(fieldArray[x].slice(0))
        }
        //console.log(path)
        if (path !== null && path.length !== 0)
        {
            for (k=0;k<9;k++)
            {
                //console.log("path found go to "+k+": [" + path[k].x+","+path[k].y+"]")
                temp[path[k].x][path[k].y] = k+2;

            }
            console.log("path found go to: [" + path[1].x+","+path[1].y+"]")
            globalMonster.goTo[0] = path[1].x;
            globalMonster.goTo[1] = path[1].y;
            globalMonster.pathFound = true;
            printGrid(temp)

            /*
            //fieldX = globalMonster.body.position.x*50 + 50;
            //fieldY = globalMonster.body.position.y*50 + 50;
            fieldX = Math.round(path[1].x * 50 + 50);
            fieldY = Math.round(path[1].y * 50 + 50);

            currentFieldX = calculateCurrent([monster.body.position.x,monster.body.position.y])[0];
            currentFieldY = calculateCurrent([monster.body.position.x,monster.body.position.y])[1];

            //temp[currentFieldX,currentFieldY] = 2;
            printGrid(temp)

            monX = Math.round(monster.body.position.x);
            monY = Math.round(monster.body.position.y);

            console.log("current: "+monX+","+monY+" - "+currentFieldX+","+currentFieldY+" goto: "+fieldX+","+fieldY+" - "+path[1].x+","+path[1].y)
            //console.log("current: "+currentFieldX+","+currentFieldY+" goto: "+path[1].x+","+path[1].y)
            //if (path[1].x === currentFieldX)
            if (fieldX === monX)
            {
                // move in Y
                //if (path[1].y > currentFieldY)
                if (fieldY > monY)
                {
                    globalMonster.body.velocity.y = globalMonster.speed;
                    globalMonster.body.velocity.x = 0;
                }
                else
                {
                    globalMonster.body.velocity.y = -globalMonster.speed;
                    globalMonster.body.velocity.x = 0;
                }
            }
            else
            {
                // move in X
                //if (path[1].x > currentFieldX)
                if (fieldX > monX)
                {
                    globalMonster.body.velocity.x = globalMonster.speed;
                    globalMonster.body.velocity.y = 0;
                }
                else
                {
                    globalMonster.body.velocity.x = -globalMonster.speed;
                    globalMonster.body.velocity.y = 0;
                }
            }
            console.log("Velo: "+globalMonster.body.velocity.x +","+globalMonster.body.velocity.y );

            //console.log("Go to " +path[1].x +","+path[1].y)
            //pos = game.add.sprite(fieldX, fieldY, 'bullets');
            //pos.frame = 1;

            //globalMonster.body.velocity = game.physics.arcade.velocityFromRotation(game.physics.arcade.angleToXY(globalMonster,fieldX,fieldY)+Math.PI*2/4, globalMonster.speed)
            //+Math.PI*4/4
            */

        }

    });

    pathfinder.preparePathCalculation([currentFieldX, currentFieldY], [14,7]);
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

        if ( counter  >= 50000) //180
        {
            counter = 0;
            // should be 3* a second
            // Release a enemy
            console.log("release")
            monster = monsters.create(50, 350 , 'monster01');
            monsterArray[monsterArray.length] = monster;
            monster.speed = 50;
            monster.body.velocity.x = 0;
            monster.body.velocity.y = 0;
            //monster.anchor.setTo(0.5, 0.5);
            monster.anchor.setTo(1, 1);
            monster.animations.add('move', [0,1,2,3], 10, true);
            monster.animations.play('move');
            monster.health = 10000;
            monster.scale.setTo(0.5, 0.5)
            pos = calculateCurrent([monster.body.position.x,monster.body.position.y])
            monster.goTo = []
            monster.goTo[0] = pos[0]
            monster.goTo[1] = pos[1]

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
                bulletArray.push( bullet);
                //bullet.body.rotation = game.physics.arcade.angleBetween(monster,gun);
                bullet.body.velocity = game.physics.arcade.velocityFromRotation(game.physics.arcade.angleBetween(monster,gun)+Math.PI*4/4,400 - gun.type*100);
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

        currentField = calculateCurrent([monster.body.position.x,monster.body.position.y]);
        field = calculateGoToToWorldCor(monster.goTo);


        //temp[currentFieldX,currentFieldY] = 2;
        //printGrid(temp)

        monX = Math.round(monster.body.position.x);
        monY = Math.round(monster.body.position.y);
        console.log("current: "+monX+","+monY+" - "+currentField[0]+","+currentField[1]+" goto: "+field[0]+","+field[1]+" - "+monster.goTo[0]+","+monster.goTo[1])

        //console.log("GoTo: "+monster.goTo[0]+","+monster.goTo[1]+" Current: "+currentField[0]+","+currentField[1])
        //if (monster.goTo[0] === currentField[0] && monster.goTo[1] === currentField[1] || calculateDistanceDouble(monster.goTo,currentField) > 1)
        //if (fieldX === monX && fieldY === monY || calculateDistanceDouble(monster.goTo,currentField) > 1)
        if (field[0] === monX && field[1] === monY || monX <=100 || monY <= 100)
        {
            setGoTo(monster);
        }

        //if (monster.pathFound)
        if (true)
        {
            monster.pathFound = false;
            // Calculate new velocity

            field = calculateGoToToWorldCor(monster.goTo);
            currentField = calculateCurrent([monster.body.position.x,monster.body.position.y]);


            //temp[currentFieldX,currentFieldY] = 2;
            //printGrid(temp)

            monX = Math.round(monster.body.position.x);
            monY = Math.round(monster.body.position.y);

            console.log("current2: "+monX+","+monY+" - "+currentField[0]+","+currentField[1]+" goto: "+field[0]+","+field[1]+" - "+monster.goTo[0]+","+monster.goTo[1])
            //console.log("current: "+currentFieldX+","+currentFieldY+" goto: "+path[1].x+","+path[1].y)
            //if (path[1].x === currentField[0])
            //if (fieldX === monX)
            if (monX <= 100)
            {
                // always first push them into the field.
                monster.body.velocity.y = 0;
                monster.body.velocity.x = monster.speed;

            }
            else if (monY <= 100)
            {
                // always first push them into the field.
                monster.body.velocity.x = 0;
                monster.body.velocity.y = monster.speed;

            }
            else if ((field[0] - monX)*(field[0] - monX) >= (field[1] - monY)*(field[1] - monY) || field[0] === monX)
            {
                // move in Y
                //if (path[1].y > currentField[1])
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
            else if ((field[0] - monX)*(field[0] - monX) < (field[1] - monY)*(field[1] - monY) || field[1] === monY)
            {
                // move in X
                //if (path[1].x > currentField[0])
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

            }
            console.log("Velo: "+monster.body.velocity.x +","+monster.body.velocity.y );

            //console.log("Go to " +path[1].x +","+path[1].y)
            //pos = game.add.sprite(fieldX, fieldY, 'bullets');
            //pos.frame = 1;

            //globalMonster.body.velocity = game.physics.arcade.velocityFromRotation(game.physics.arcade.angleToXY(globalMonster,fieldX,fieldY)+Math.PI*2/4, globalMonster.speed)
            //+Math.PI*4/4
        }





        //console.log("monster pos: "+currentFieldX+" "+currentFieldY)


        if (monster.body.position.x > 750 )
        {
            monster.kill();
            toBeRemoved.push(i);

        }
    }
    for (i=0;i<toBeRemoved.length;i++)
    {
        monsterArray.splice(toBeRemoved[i],1);
    }

    toBeRemoved = []
    for (i=0;i<bulletArray.length;i++)
    {
        // check up on bullet
        bullet = bulletArray[i];
        if (bullet.body.position.x > 750 || bullet.body.position.x < 100 || bullet.body.position.y > 650||bullet.body.position.y < 100)
        {
            bullet.kill();
            toBeRemoved.push(i);

        }
    }
    for (i=0;i<toBeRemoved.length;i++)
    {
        bulletArray.splice(toBeRemoved[i],1);
    }
}
