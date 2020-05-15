(function(){

    const sudokuArea = document.querySelector("#sudokuArea");
    const check = document.querySelector("#check");
    const hint = document.querySelector("#hint");
    const helpSelectionNumber = document.querySelector("#helpSelectionNumber");
    const notes = document.querySelector("#notes");
    const startWindow = document.querySelector("#startWindow");
    const easy = document.querySelector("#easy");
    const medium = document.querySelector("#medium");
    const hard = document.querySelector("#hard");
    const min = document.querySelector("#min");
    const sec = document.querySelector("#sec");
    const pause = document.querySelector("#pause");
    const pauseWindow = document.querySelector("#pauseWindow");
    const endpause = document.querySelector("#endpause");
    document.querySelectorAll(".manual").forEach(item => {
        item.addEventListener("click", () => document.querySelector("#manual").style.display ="flex");
    });    
    document.querySelector("#manualExit").addEventListener("click", () => document.querySelector("#manual").style.display ="none");
    const newgame = document.querySelector("#newgame");
    const endGame = document.querySelector("#endGame");
    const restart = document.querySelector("#restart");
    const counterCellAll = document.querySelectorAll(".counterCell");

    const sudokuGridSolution = [[],[],[],[],[],[],[],[],[]];
    let sudokuGridSolve = [];
    let allSudokuCells = [];
    //Check columns, rows, and boxes 9x(3x3), if true, the value can be appended to sudokuGridSolution[row][column]
    const notDouble = (sudokuGrid,row,column,value) => {
        for(let i = 0; i < 9; i++){
            boxRow = Math.floor(row/3)*3 + Math.floor(i / 3);
            boxColumn = Math.floor(column/3)*3 + i%3;
            if(sudokuGrid[row][i] === value || sudokuGrid[i][column] === value || sudokuGrid[boxRow][boxColumn] === value){
                return false;
            }                
        }
        return true;
    }
    //Get all Sudoku Numbers, stored in sudokuGridSolution
    const setSudoku = (cells) => {      

        //Random first row
        let numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const firstRow = num => {
            let randomNum = Math.floor(Math.random() * numArray.length);        
            sudokuGridSolution[0][num] = numArray[randomNum];
            numArray.splice(randomNum,1);
            num++;
            if(num<9){
                firstRow(num);
            }
        }
        firstRow(0);

        //backtracking algorithm
        const otherRows = sudokuGrid => {
            //iterate over rows
            for(let row = 1; row < 9; row++){
                //iterate over columns
                for(let column = 0; column < 9; column++){
                    if(!sudokuGrid[row][column]){
                        for(let value = 1; value <=9; value++){
                            if (notDouble(sudokuGrid,row,column,value)) {
                                sudokuGrid[row][column] = value;  
                                if (otherRows(sudokuGrid)) {                                
                                    return true;
                                } else {
                                    sudokuGrid[row][column] = 0;                                                                     
                                }
                            }  
                        }
                        return false;
                    }                
                }                
            } 
            return true;    
        }         
        otherRows(sudokuGridSolution); 

        //get a new Array with all empty cells        
        for ( let item of sudokuGridSolution){
            sudokuGridSolve.push([...item]);
        }        
        //Erase numbers for difficulty level
        const setDifficulty = (erase,arr) => {
            let randomRow = new Number, randomColumn = new Number;
            //erase number of cells random
            const randomCells = () => {
                randomRow = Math.floor(Math.random() * 9); 
                randomColumn = Math.floor(Math.random() * 9);
                if(!arr[randomRow][randomColumn]){
                    randomCells();
                } else {
                    arr[randomRow][randomColumn] = "";
                }
            } 
            randomCells();  
            erase--;            
            if(erase>0){
                setDifficulty(erase,arr);
            } 
        }
        setDifficulty(cells, sudokuGridSolve);
        startWindow.style.display = "none";
    }   
      
    const gamePlay = () => {

    
        //Create the Sudoku GameArea
        for(let i = 1; i<10; i++){
            for(let j = 1; j<10; j++){
                if (i%3 === 0 && j%3 === 0){
                    sudokuArea.innerHTML += `<div class='cell numbersBorderRightBottom'>${sudokuGridSolve[i-1][j-1]}</div>`;
                } else if( i%3 === 0 && j%3 !== 0) {
                    sudokuArea.innerHTML += `<div class='cell numbersBorderBottom'>${sudokuGridSolve[i-1][j-1]}</div>`;
                } else if(j%3 === 0 && i%3 !== 0 ){
                    sudokuArea.innerHTML += `<div class='cell numbersBorderRight'>${sudokuGridSolve[i-1][j-1]}</div>`
                } else {
                    sudokuArea.innerHTML += `<div class='cell numbers'>${sudokuGridSolve[i-1][j-1]}</div>`;
                }            
            }        
        }  

        function SudokuCell(row, column, value, guess){
            this.row = row,
            this.column = column,
            this.value = value,
            this.guess = guess,
            this.instant = 0,
            this.dependent = []
        }

        SudokuCell.prototype.getDependents = function(){
            for(let i = 0; i < 9; i++){
                boxRow = Math.floor(this.row/3)*3 + Math.floor(i / 3);
                boxColumn = Math.floor(this.column/3)*3 + i%3;
                if(sudokuGridSolve[this.row][i]){
                    this.dependent.push(sudokuGridSolve[this.row][i]);
                }
                if(sudokuGridSolve[i][this.column]){
                    this.dependent.push(sudokuGridSolve[i][this.column]);
                }
                if(sudokuGridSolve[boxRow][boxColumn]){
                    this.dependent.push(sudokuGridSolve[boxRow][boxColumn]);
                }        
            }
            this.dependent.sort(function(a, b){return a-b});
        }

        SudokuCell.prototype.instantE = function(){
            if(this.guess !== ""){
                this.instant = 1;
            }
        }

        SudokuCell.prototype.compare = function(){
            if(this.value !== this.guess && this.guess !== ""){
                return false
            } else if(this.value === this.guess){
                return "correct";
            } else{
                return true;
            }
        }

        const setSudokuCell = () => {
            for(let i = 0;i<9; i++){
                for (let j = 0; j<9; j++){
                    let value = sudokuGridSolution[i][j];
                    let guess = sudokuGridSolve[i][j];
                    let cell = new SudokuCell(i,j,value,guess);
                    cell.getDependents();
                    cell.instantE();
                    allSudokuCells.push(cell);
                }
            }

        }
        setSudokuCell();

        const sudokuAreaChildren = [...sudokuArea.childNodes];

        //count Numbers in Sudoku area and highlight them
        const counterCellArray = [...counterCellAll];
        let pointNumbersArr = [];

        const pointNumbers = numindex => {
            pointNumbersArr =  allSudokuCells
                                    .map((item,index) => {
                                        if((item.value===numindex+1 && item.instant===1) || (item.guess===numindex+1 && item.instant===2)){
                                            return index;
                                        }
                                    })
                                    .filter(item => item>=0);
            pointNumbersArr.forEach(item => sudokuAreaChildren[item].classList.add("highlight"));
        }

        const hideNumbers = () => {
            pointNumbersArr.forEach(item => sudokuAreaChildren[item].classList.remove("highlight"));
        }
        
        counterCellArray.forEach((item, index) => {
            item.addEventListener("mouseenter", () => pointNumbers(index));
            item.addEventListener("touchmove", () => pointNumbers(index), {passive: true});
        });
        counterCellArray.forEach(item => {
            item.addEventListener("mouseleave", hideNumbers);
        });

        const countNumbers = number => { 
            const countNumbersArr =  allSudokuCells
                                    .map((item,index) => {
                                        if((item.value===number && item.instant===1) || (item.guess===number && item.instant===2)){
                                            return index;
                                        }
                                    })
                                    .filter(item => item>=0);
            counterCellArray[number-1].children[1].innerHTML = countNumbersArr.length;
        }
        for(let i=1;i<10;i++){
            countNumbers(i);
        }

        //Choose number for cell
        let selectedCellNote = "";         
        let highlightOn = "on";
        let helpSelectNumber = 0;
        helpSelectionNumber.addEventListener("click", () => {
            helpSelectNumber = helpSelectNumber === 1 ? 0 : 1;

            helpSelectionNumber.style.backgroundImage = helpSelectNumber === 1 ? 'URL("./images/possibleNumbers.PNG")'
                                        : 'URL("./images/allNumbers.PNG")';
        });

        let selectedCellBefore = "";
        const chooseNumber = e => {
            notes.removeEventListener("click", onoff);
            if(highlightOn === "on"){
                if(selectedCellBefore.childElementCount > 0 && selectedCellBefore.children[0].attributes[0].value==="selectNumber"){
                selectedCellBefore.innerText = "";
                selectedCellBefore.addEventListener("click", chooseNumber);               
                }
            } else {
                e.currentTarget.innerHTML = "";
                e.currentTarget.classList.remove("makeNote");
                selectedCellNote = "";
            } 
            
            const selectedCell = e.currentTarget;
            selectedCellBefore = selectedCell;
            const selectedCellNumber = e.currentTarget.innerHTML;
            let index = sudokuAreaChildren.indexOf(selectedCell);
            const helpArrayDependent = allSudokuCells[index].dependent;
            if(highlightOn === "on"){
                selectedCell.removeEventListener("click", chooseNumber);
            } else {
                selectedCell.removeEventListener("dblclick", chooseNumber);
            } 

            selectedCell.innerHTML = `<div class="selectNumber">
                                        <div>1</div>
                                        <div>2</div>
                                        <div>3</div>
                                        <div>4</div>
                                        <div>5</div>
                                        <div>6</div>
                                        <div>7</div>
                                        <div>8</div>
                                        <div>9</div>
                                    </div>`;

            const selectNumber = e => {
                e.stopPropagation();
                selectedCell.classList.add("cellselected");            
                let selectedNumber = e.currentTarget.innerText;
                selectedCell.innerHTML = selectedNumber; 
                let parseNumber = parseInt(selectedNumber)
                allSudokuCells[index].guess = parseNumber;
                allSudokuCells[index].instant = 2;
                countNumbers(parseNumber);
                if(!Number.isNaN(parseInt(selectedCellNumber))){
                    let num = parseInt(selectedCellNumber);
                    countNumbers(num);
                }
                document.querySelectorAll(".selectNumber>div").forEach(item => {
                    item.removeEventListener("click", selectNumber);
                }) 
                if(highlightOn === "on"){
                    selectedCell.addEventListener("click", chooseNumber);
                } else {
                    selectedCell.addEventListener("dblclick", chooseNumber);
                }
            }

            if(helpSelectNumber === 0){
                document.querySelectorAll(".selectNumber>div").forEach(item => {
                    item.addEventListener("click", selectNumber);                   
                    item.classList.add("selectBlink");
                })
            } else {
                document.querySelectorAll(".selectNumber>div").forEach(item => { 

                    if( !(helpArrayDependent.includes(parseInt(item.innerText)))){              
                        item.addEventListener("click", selectNumber);
                        item.classList.add("selectBlink");
                    } else {
                        item.classList.add("selecttransparent");
                    }

                })
            }                    
        }

        sudokuAreaChildren.forEach(item => {
            if(item.innerHTML === ""){
                item.addEventListener("click", chooseNumber);            
            }        
        });
               

        //Make notes        
        const noteCell = e => {            
            if(e.currentTarget.attributes[0].value.includes("cellcorrect")){ 
                selectedCellNote = "";
                return;
            } else {
                selectedCellNote = e.currentTarget; 
                if(selectedCellNote.innerHTML === "" || selectedCellNote.attributes[0].value.includes("cellselected")){
                    selectedCellNote.classList.remove("cellselected");
                    selectedCellNote.innerHTML = `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`;
                }  
            }          
        }

        const makeNotes = e => { 
            if(selectedCellNote){
                let num = parseInt(e.currentTarget.innerHTML);
                selectedCellNote.classList.add("makeNote");
                if(selectedCellNote.children[num-1].innerHTML === `${num}`){
                    selectedCellNote.children[num-1].innerHTML = "";
                } else if(selectedCellNote.children[num-1].innerHTML === ""){
                    selectedCellNote.children[num-1].innerHTML = num;
                }
            } else {
                return;
            }
            
        }

        //Either highlight numbers or make notes
        
        const onoff =  () => {
            if(highlightOn === "on"){
                highlightOn = "off";
                notes.style.backgroundImage = "url('./images/makeNotes.PNG')";
                counterCellArray.forEach((item, index) => {   
                    item.children[0].addEventListener("click", makeNotes);
                    item.children[1].style.visibility = "hidden";
                });
                sudokuAreaChildren.forEach(item => {
                    if(item.innerHTML === ""){
                        item.removeEventListener("click", chooseNumber);            
                    }        
                })
                sudokuAreaChildren.forEach(item => {
                    if(item.innerHTML === ""){
                        item.addEventListener("dblclick", chooseNumber);            
                    }        
                })
                sudokuAreaChildren.forEach(item => {
                    if(item.innerHTML === ""){
                        item.addEventListener("click", noteCell);            
                    }        
                })
            } else {
                highlightOn = "on";
                notes.style.backgroundImage = "url('./images/highlightNumber.PNG')";
                counterCellArray.forEach((item, index) => { 
                    item.children[0].removeEventListener("click", makeNotes);
                    item.children[1].style.visibility = "visible";
                });
                sudokuAreaChildren.forEach(item => {
                    if(item.innerHTML === ""){
                        item.removeEventListener("click", noteCell);            
                    }        
                })
                sudokuAreaChildren.forEach(item => {
                    if(item.innerHTML === ""){
                        item.removeEventListener("dblclick", chooseNumber);            
                    }        
                })
                sudokuAreaChildren.forEach(item => {
                    if(item.innerHTML === ""){
                        item.addEventListener("click", chooseNumber);            
                    }        
                })
            }
            
        }

        notes.addEventListener("click", onoff);

        //Give user a hint 
        const hintSudoku = () => {

            let allEmpty = allSudokuCells
                            .map((item,index)=> {return [item.value,item.instant,index];})
                            .filter(item => {return item[1] === 0});

            if(allEmpty.length===0){
                allEmpty = allSudokuCells
                            .map((item,index)=> {return [item.value,item.instant,index,item.guess];})
                            .filter(item => {return item[0]!==item[3] && item[1] === 2});
            } 
            if(allEmpty.length===0){
                return
            } 
            let randomNum = Math.floor(Math.random()*allEmpty.length);
            let randomCell = allEmpty[randomNum];
            sudokuAreaChildren[randomCell[2]].classList.remove("makeNote");
            sudokuAreaChildren[randomCell[2]].innerHTML = randomCell[0];
            sudokuAreaChildren[randomCell[2]].classList.remove("cellselected");
            sudokuAreaChildren[randomCell[2]].classList.add("cellhint");
            allSudokuCells[randomCell[2]].instant = 1;   
            allSudokuCells[randomCell[2]].guess = randomCell[0]; 
            sudokuAreaChildren[randomCell[2]].removeEventListener("click", noteCell);
            sudokuAreaChildren[randomCell[2]].removeEventListener("dblclick", chooseNumber);
            sudokuAreaChildren[randomCell[2]].removeEventListener("click", chooseNumber); 
            for(let i=1;i<10;i++){
                countNumbers(i);
            }   
        }
        //Check Sudoku if correct
        const checkSudoku = () => {
            let checkArray = []
            allSudokuCells.forEach( (item,index) => {                
                if(!item.compare()){
                    sudokuAreaChildren[index].classList.add("cellwrong");
                } else {
                    if(item.compare() === "correct"){
                        checkArray.push(item);
                    }                    
                    sudokuAreaChildren[index].classList.remove("cellwrong");
                    if(item.instant === 2){
                        sudokuAreaChildren[index].classList.add("cellcorrect");
                        sudokuAreaChildren[index].removeEventListener("click", noteCell);
                        sudokuAreaChildren[index].removeEventListener("dblclick", chooseNumber);
                        sudokuAreaChildren[index].removeEventListener("click", chooseNumber);
                    }
                }
            });
            if(checkArray.length === 81){
                clearInterval(timeInterval);
                endGame.style.display = "flex"; 
                restart.addEventListener("click", () => document.location.reload())               
            }
        }
        hint.addEventListener("click", hintSudoku)
        check.addEventListener("click", checkSudoku)

        //Timer
        let seconds = 1;
        let minutes = 0;
        let timeInterval;
        const timer = () => {
            if(seconds>0 && seconds<10){
                sec.innerHTML = `0${seconds}`;
                seconds++;
            }else if(seconds < 60){
                sec.innerHTML = seconds;
                seconds++;
            } else if(seconds === 60){
                minutes++;
                min.innerHTML = minutes;
                sec.innerHTML = "00";
                seconds = 1;
            }
        }
        timeInterval = setInterval(timer,1000);
        
        pause.addEventListener("click", () => {            
            clearInterval(timeInterval);
            pauseWindow.style.display = "flex";
            endpause.style.display = "block";            
        })

        endpause.addEventListener("click", () => {
            pauseWindow.style.display = "none";
            timeInterval = setInterval(timer,1000);              
        });

        newgame.addEventListener("click", () => document.location.reload());
    }

    easy.addEventListener("click", () => {
        setSudoku(45); 
        gamePlay();
    });
    medium.addEventListener("click", () => {
        setSudoku(51); 
        gamePlay();
    });
    hard.addEventListener("click", () => {
        setSudoku(59); 
        gamePlay();
    });
    

})();
