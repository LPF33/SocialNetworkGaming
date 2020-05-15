(function(){

    var memoryArea = document.getElementById("memorySurface");
    var memoryPairsArea = document.getElementById("memoryPairs");
    var scoreGrid = document.getElementById("scores");
    var triesGrid = document.getElementById("tries");
    var scores = 0;
    var tries = 0;    

    // How many pairs? What type? And start Game!
    var type = document.querySelectorAll("#right .sidebox.type");
    var typeSelect = 1;
    var memoryPictures = 50;
    var slider = document.getElementById("slider");
    var sliderBar = document.getElementById("sliderBar");        
    var sliderInput = document.getElementById("sliderInput");    
    sliderInput.innerHTML = memoryPictures;

    //Change input of slider
    function slide(e){ 
        e.preventDefault;        
        slider.addEventListener("mousemove", slide2);              
    };    

    function slide2(e){
        var clientX;
        e.preventDefault;
        if(e.touches){
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        var posXSliderBar = clientX - slider.offsetLeft;
        sliderBar.style.left = posXSliderBar + "px";
        if(posXSliderBar<=slider.offsetWidth/18){
            sliderBar.style.left = 0;
            memoryPictures = 16;
        } else if(posXSliderBar<=slider.offsetWidth*(2/18)){
            memoryPictures = 18;
        } else if(posXSliderBar<=slider.offsetWidth*(3/18)){
            memoryPictures = 20;
        } else if(posXSliderBar<=slider.offsetWidth*(4/18)){
            memoryPictures = 22;
        } else if(posXSliderBar<=slider.offsetWidth*(5/18)){
            memoryPictures = 24;
        } else if(posXSliderBar<=slider.offsetWidth*(6/18)){
            memoryPictures = 26;
        } else if(posXSliderBar<=slider.offsetWidth*(7/18)){
            memoryPictures = 28;
        } else if(posXSliderBar<=slider.offsetWidth*(8/18)){
            memoryPictures = 30;
        } else if(posXSliderBar<=slider.offsetWidth*(9/18)){
            memoryPictures = 32;
        } else if(posXSliderBar<=slider.offsetWidth*(10/18)){
            memoryPictures = 34;
        } else if(posXSliderBar<=slider.offsetWidth*(11/18)){
            memoryPictures = 36;
        } else if(posXSliderBar<=slider.offsetWidth*(12/18)){
            memoryPictures = 38;
        } else if(posXSliderBar<=slider.offsetWidth*(13/18)){
            memoryPictures = 40;
        } else if(posXSliderBar<=slider.offsetWidth*(14/18)){
            memoryPictures = 42;
        } else if(posXSliderBar<=slider.offsetWidth*(15/18)){
            memoryPictures = 44;
        } else if(posXSliderBar<=slider.offsetWidth*(16/18)){
            memoryPictures = 46;
        } else if(posXSliderBar<=slider.offsetWidth*(17/18)){
            memoryPictures = 48;
        } else {
            sliderBar.style.left = slider.offsetWidth-10 + "px";
            memoryPictures = 50;
        }                        
            
        sliderInput.innerHTML = memoryPictures;
        scores = 0;
        tries = 0;
        loadGame(memoryPictures, typeSelect);                        
    };

    sliderBar.addEventListener("mousedown", slide); 
    document.addEventListener("mouseup", function(){
        slider.removeEventListener("mousemove", slide2);
    }); 
    //Touch Events
    sliderBar.addEventListener("touchmove", slide2, {passive: true});
    
    //Change of type    
    type.forEach(function(item, index){
        item.addEventListener("click",function(){
            var typeBefore = document.querySelector("#right .sidebox.type.active");
            typeBefore.classList.remove("active");
            item.classList.add("active");
            typeSelect = index;
            scores = 0;
            tries = 0;
            loadGame(memoryPictures, typeSelect);
        })
    });

    // Restart Game
    document.getElementById("button").addEventListener("click", function(){
        window.location.reload();
    });

    // Function for Game
    function loadGame(memoryPictures, typeSelect){

        memoryArea.innerHTML = "";
        memoryPairsArea.innerHTML = "";
                      
        var boxStorage = [];
        var numbers = [];
        

        //Generate boxes on memorySurface
        for ( let i = 1; i<= memoryPictures*2; i++){
            memoryArea.innerHTML += `<div id="${i}" class="box select"></div>`;
        }

        //Generate boxes for Memory Pairs
        for ( let k = 1; k<= memoryPictures*2; k++){
            memoryPairsArea.innerHTML += `<div id="p${k}" class="box2"></div>`;
        }

        // Store colours in boxes
        for ( let j = 1 ; j <= memoryPictures*2; j++){
            numbers.push(j);
        }
        
        var pair1 = new Number();
        var pair2 = new Number();     

        function createPairs(para){ 
            
            // Get a random pair
            function randomNumber(para){
                var number1 = Math.floor(Math.random()*para);
                var number2 = Math.floor(Math.random()*para);
                if(number1 === number2){
                    randomNumber(para);
                } else {        
                    pair1 = numbers[number1];
                    pair2 = numbers[number2];          
                    numbers.splice(number1,1);
                    if(number2 == 0){
                        numbers.splice(0,1);
                    } else if ( number1 > number2) {
                        numbers.splice(number2,1);
                    } else {
                        number2--;
                        numbers.splice(number2,1);
                    }
                }   
            }

            if(para > 0){
            randomNumber(para); 
            } else {
                pair1 = numbers[0];
                pair2 = numbers[0];
            }

            // Set type of memory and get random color/picture/numbers
            if(typeSelect === 0){
                var red = Math.round(Math.random()*255);
                var green = Math.round(Math.random()*255);
                var blue = Math.round(Math.random()*255);
                boxStorage[pair1] = `rgb(${red},${green},${blue})`;
                boxStorage[pair2] = `rgb(${red},${green},${blue})`;
                document.getElementById(`p${pair1}`).style.backgroundColor = `rgb(${red},${green},${blue})`;
                document.getElementById(`p${pair2}`).style.backgroundColor = `rgb(${red},${green},${blue})`;

            } else if(typeSelect === 1){
                var picture = new Number();
                function picturePairs(){
                    function randomPicture(){
                        picture = Math.floor(Math.random()*50)+1;
                    }
                    randomPicture();

                    if ( boxStorage.includes(picture) ){
                        picturePairs();
                    } else {
                        boxStorage[pair1] = picture;
                        boxStorage[pair2] = picture;
                        document.getElementById(`p${pair1}`).style.backgroundImage = `URL("pictures/Memory${picture}.jpg")`;
                        document.getElementById(`p${pair2}`).style.backgroundImage = `URL("pictures/Memory${picture}.jpg")`;
                    }
                } 
                picturePairs();
                
            } else if(typeSelect === 2){
                var numPair = new Number();
                function numberPairs(){
                    function randomNum(){
                        numPair = Math.floor(Math.random()*1000);
                    }
                    randomNum();
                               

                    if ( boxStorage.includes(numPair) ){
                        numberPairs();
                    } else {
                        boxStorage[pair1] = numPair;
                        boxStorage[pair2] = numPair;
                        document.getElementById(`p${pair1}`).innerHTML = numPair;
                        document.getElementById(`p${pair2}`).innerHTML = numPair;
                    }                
                } 
                numberPairs();   
            }      
            para -= 2;

            if(para >= 2){
                createPairs(para);
            } 
        }  createPairs(memoryPictures*2);
                
        //Select box in memoryArea

        var boxPair = [];        
        var animationID;
        var memoryAll = document.querySelectorAll(".select");        
        
        memoryAll.forEach(function(item, index){        
            item.addEventListener("click", function(){
                item.classList.remove("box");
                item.classList.add("boxOut");
                boxPair.push({ID:item.id, INDEX: index});

                // Compare selected boxes
                if(boxPair.length === 2){ 

                    if(boxPair[0].ID === boxPair[1].ID && boxPair[0].INDEX === boxPair[1].INDEX){
                        boxPair.shift();
                    } else {            
                        var id1 = parseInt(boxPair[0].ID);
                        var id2 = parseInt(boxPair[1].ID);            
                        var compare1 = boxStorage[id1];
                        var compare2 = boxStorage[id2];

                        //Selected pairs are the same
                        if(compare1 == compare2){
                            scores++;
                            tries++;   
                            var save = [boxPair[0].ID,boxPair[1].ID];
                            
                            //Win game
                                if(scores == memoryPictures){
                                    document.getElementById("win").style.display = "flex";
                                    var endResult = Math.floor(scores*(10*(scores/tries)));
                                    var highestPoints = Math.floor(scores*(10*(scores/(2*scores-1))));
                                    document.getElementById("winScore").innerHTML += `${endResult} out of ${highestPoints}`;
                                }

                            function eliminate(){
                                var elem1 = document.getElementById(`${save[0]}`);
                                var elem1b = document.getElementById(`p${save[0]}`);
                                var elem2 = document.getElementById(`${save[1]}`);
                                var elem2b = document.getElementById(`p${save[1]}`);
                                var nextElem1 = document.getElementById("black").cloneNode(true);
                                var nextElem2 = document.getElementById("black").cloneNode(true);
                                var nextElem3 = document.getElementById("black").cloneNode(true);
                                var nextElem4 = document.getElementById("black").cloneNode(true);
                                document.getElementById("memorySurface").replaceChild(nextElem1,elem1);
                                document.getElementById("memoryPairs").replaceChild(nextElem2,elem1b);
                                document.getElementById("memorySurface").replaceChild(nextElem3,elem2);
                                document.getElementById("memoryPairs").replaceChild(nextElem4,elem2b);                            
                            } 
                            setTimeout(eliminate,1000);                          
                            boxPair=[]; 
                     
                            // Selected pairs are different        
                        } else {
                            tries++;

                            function cover(){
                                memoryAll[boxPair[0].INDEX].classList.add("box");
                                memoryAll[boxPair[0].INDEX].classList.remove("boxOut");
                                memoryAll[boxPair[1].INDEX].classList.add("box");
                                memoryAll[boxPair[1].INDEX].classList.remove("boxOut");
                                boxPair=[];
                            }                
                        animationID = setTimeout(cover, 1500);
                        }
                    }
                    // next click when two are open
                } else if (boxPair.length > 2){
                    clearTimeout(animationID);
                    memoryAll[boxPair[0].INDEX].classList.add("box");
                    memoryAll[boxPair[0].INDEX].classList.remove("boxOut");
                    memoryAll[boxPair[1].INDEX].classList.add("box");
                    memoryAll[boxPair[1].INDEX].classList.remove("boxOut");
                    boxPair.shift();  
                    boxPair.shift();                   
                }   
                triesGrid.innerHTML = tries;
                scoreGrid.innerHTML = scores;
            });
        });
        
    }
    
    loadGame(memoryPictures, typeSelect)
   
    

})();

