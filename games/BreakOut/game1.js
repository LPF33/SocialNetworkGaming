(function(){   
    
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    // Ball variables
    var x = canvas.width/2;
    var y = canvas.height-30;
    var ballradius = 10;
    var dx = 5;
    var dy = -5;

    // Paddle variables
    var paddleWidth = 70;
    var paddleHeight = 20;
    var paddleX = (canvas.width-paddleWidth)/2;

    // Create and store Blocks
    var blocks = [];
    var X = 10;
    var Y = 10;
    for( let i = 0; i < 40; i++){  

        var element = {x:X, y:Y};
        blocks[i] = element;

        if ( X <= 410){
            X += 50;
        } else {
            X = 10;
            Y += 20;
        }
    }
    // Scores
    var scores = 0;    

    // Win and End Game
    var ENDGAME = false;
    var winGame = document.getElementsByClassName("game")[0];
    var endGame = document.getElementsByClassName("game")[1];
    var button = document.getElementsByClassName("button")[0];
    var button2 = document.getElementsByClassName("button")[1];

    // Keydown handler for moving the paddle
    document.addEventListener("keydown", function(e){
        let keyCode = e.keyCode;
        if(keyCode == 37){
            paddleX -= 20;
            if(paddleX <= 0){
                paddleX = 0;
            }
        } else if ( keyCode == 39){
            paddleX += 20;
            if(paddleX+paddleWidth >= canvas.width){
                paddleX = canvas.width-paddleWidth;
            }
        }
    });

    //Function for Ball movements
    function moveBall(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        ctx.arc(x,y, ballradius, 0, 2*Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
        x += dx;
        y += dy; 

        // Collision with walls and paddle
        if(y+dy <= ballradius){
            dy = -dy;
        } else if(x+dx >= canvas.width-ballradius || x+dx <= ballradius){
            dx = -dx;
        } else if(y+dy >= canvas.height-paddleHeight){
            if(x >= paddleX && x <= paddleX+paddleWidth){
                dy = -dy;                
            } else {
                ENDGAME = true;
                endGame.style.display = "flex";
            }            
        }
        
        // Collision with blocks     
        for ( let i = 0; i< blocks.length; i++){
            if(x >= blocks[i].x && x <= blocks[i].x+30 && y >= blocks[i].y && y <= blocks[i].y+10){
                dy = -dy;
                scores++;
                document.getElementById("scores").innerHTML = "Your scores:"+scores;
                blocks.splice([i],1);
            }
        }

        if(scores === 40){
            winGame.style.display = "flex";
            ENDGAME = true;
        }

        
        placeBlocks();
        movePaddle();  
        if( ENDGAME == false){
            requestAnimationFrame(moveBall);    
        }        
    }   

    // Function to create/move the paddle
    function movePaddle(){
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle= "black";
        ctx.fill();
        ctx.closePath();   
    }

    button.addEventListener("click",function(){
        document.location.reload();
    });
    button2.addEventListener("click",function(){
        document.location.reload();
    });
    
    // Function to place the blocks
    function placeBlocks(){
        for ( let i = 0; i < blocks.length; i++){
            let posX = blocks[i].x;
            let posY = blocks[i].y;
            ctx.beginPath();
            ctx.rect(posX,posY,30,10);
            ctx.fillStyle = "teal";
            ctx.fill();
            ctx.closePath();
        }        
    }          

    moveBall();
      

})();



