(function(){
    const canvas = document.querySelector("#welcomeCanvas");
    const ctx = canvas.getContext("2d");   
    
    let triangleWidth = 30;
    let b2 = Math.pow(triangleWidth,2) - Math.pow((triangleWidth/2),2);
    let triangleHeight = Math.sqrt(b2);
    const colors = ["yellow","red","blue","white","black","white"];
    let line = 0;
    let x = 0;
    let y = -0.5*triangleWidth; 
    let allTriangles = [];

    const changeColor = () => {
        let randomNum = Math.floor(Math.random()*(colors.length));
        return colors[randomNum];
    };

    class Triangle{
        constructor(x,y){
            this.x1 = x;
            this.y1 = y;
            this.x2 = x;
            this.y2 = y+triangleWidth;
            this.x3 = x+triangleHeight;
            this.y3 = y+(triangleWidth/2);
        }
        drawSingleTriangle(){
            ctx.beginPath();
            ctx.fillStyle = changeColor();               
            ctx.moveTo(this.x1,this.y1);        
            ctx.lineTo(this.x2,this.y2);
            ctx.lineTo(this.x3,this.y3);
            ctx.fill();
            ctx.closePath();
        }

        mouseInside(x,y){
            if(x>=this.x1 && x<=this.x3 && y>=this.y1+(triangleWidth*0.5*((x-this.x1)/(this.x3-this.x1))) && y<=this.y2-(triangleWidth*0.5*((x-this.x1)/(this.x3-this.x1)))){
                this.drawSingleTriangle();
            }
        }        
    }

    class Triangle2{
        constructor(x,y){
            this.x1 = x;
            this.y1 = y;
            this.x2 = x;
            this.y2 = y+triangleWidth;
            this.x3 = x-triangleHeight;
            this.y3 = y+(triangleWidth/2);
        }

        drawSingleTriangle(){
            ctx.beginPath();
            ctx.fillStyle = changeColor();              
            ctx.moveTo(this.x1,this.y1);        
            ctx.lineTo(this.x2,this.y2);
            ctx.lineTo(this.x3,this.y3);
            ctx.fill();
            ctx.closePath();
        }
        mouseInside(x,y){
            if(x>=this.x3 && x<=this.x1 && y>=this.y1+(triangleWidth*0.5*((x-this.x3)/(this.x1-this.x3))) && y<=this.y2-(triangleWidth*0.5*((x-this.x3)/(this.x1-this.x3)))){
                this.drawSingleTriangle();
            }
        }        
    }

    const drawTriangle = () => {
        let singleTriangle = new Triangle(x,y);        
        singleTriangle.drawSingleTriangle();
        allTriangles.push(singleTriangle);
        x+=2*triangleHeight;
    };

    const drawTriangle2 = () => {
        let singleTriangle = new Triangle2(x,y);        
        singleTriangle.drawSingleTriangle();
        allTriangles.push(singleTriangle);
    };

    const createWindow = () => {
        if(x<=canvas.width+2*triangleHeight && y<canvas.height){
            drawTriangle();
            drawTriangle2();
            createWindow();
        }else if(x>canvas.width+2*triangleHeight && y<canvas.height){
            y+=triangleWidth/2;
            x = line === 0 ? -1*triangleHeight : 0;
            line = line === 0 ? 1:0;
            createWindow();
        }else if(y>=canvas.height){
            return;
        }  
    };

    const resizeCanvas = () => {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        x = 0;
        y = -0.5*triangleWidth; 
        allTriangles = [];
        createWindow();
    };    

    window.addEventListener("resize", resizeCanvas, false);   
    canvas.addEventListener("mousemove", e => { 
        let mouseX = e.clientX;
        let mouseY = e.clientY; 
        allTriangles.forEach(item => {
            item.mouseInside(mouseX,mouseY);
        });
    });
    
    resizeCanvas();
})();