(function(){
    
    var GameArea = $("#gameArea");
    var player1 = $("#input1").val("Player1");
    var player2 = $("#input2").val("Player2");
    var actualPlayer = "Player1";
    var computerCheck = [];
    // Create with Javascript the boxes
    function createGameArea(){
        for(let i = 0; i < 7; i++){            
            GameArea.append(`<div class="column column${i}"></div>`);
        }
        for(let k = 1; k < 7; k++){                
                $(".column").append(`
                    <div class="row${k} box">
                    <div class="sideGame topGame"></div>
                    <div class="sideGame leftGame"></div>
                    <div class="sideGame frontGame"></div>
                    <div class="sideGame rightGame"></div>
                    <div class="sideGame bottomGame"></div>
                    <div class="Coin"></div>
                </div>`
                )
            }
    }
    createGameArea();

    //Two Player Game
    $("#button1").on("click", function(){
        $("#startGame").css({"display":"none"});
        player1 = $("#input1").val();
        player2 = $("#input2").val();
        $("#player1ID").html(player1);
        $("#player2ID").html(player2);
    }); 
    //Single Player Game
    $("#button2").on("click", function(){
        $("#startGame").css({"display":"none"});
        player1 = $("#input1").val();
        $("#player1ID").html(player1);
        $("#player2ID").html("Computer");
        player2 = "Computer";
    }); 

    var clickArea = $(".column");
    var clickedColumn;
    var j = -1;

    $(document).on("keydown", function(e){  
        clickedColumn = $(".active");
        prevColumn = clickedColumn.prev();
        nextColumn = clickedColumn.next();

        if(e.keyCode === 39){   
            
            if(clickedColumn.length === 0){
                nextColumn = $(".column").eq(0);
            } 
            clickedColumn.removeClass("active");
            nextColumn.addClass("active");
            
            
        } else if (e.keyCode === 37){

            if(clickedColumn.length === 0){
                prevColumn = $(".column").eq(6);
            } 
            clickedColumn.removeClass("active");
            prevColumn.addClass("active");

            
        } else if (e.keyCode === 13){
            clickedColumn = $(".column.active");
            gamePlay();
        } 
    });    

    clickArea.on("click", function(e){
        clickedColumn = $(e.currentTarget);
        $(".column.active").removeClass("active");
        clickedColumn.addClass("active");
        gamePlay();
    });

    function nextPlayer(){
        if(actualPlayer === "Player1"){            
            actualPlayer = "Player2";
            $("#player1Coin").css({"animation-name":"none"});
            $("#player2Coin").css({"animation-name":"jump"});
            if($("#player2ID").html()==="Computer"){
                setTimeout(gamePlay,1000);
            }            
        } else if (actualPlayer === "Player2"){
            actualPlayer = "Player1";
            $("#player2Coin").css({"animation-name":"jnone"});
            $("#player1Coin").css({"animation-name":"jump"});            
        }
    }

    function checkWin(check,para){
        var checkString = "";
        winArray = [];

        for ( var item of check ){
            if($(item).hasClass("Player1")){ 
                checkString += "1";
            } else if ($(item).hasClass("Player2")){
                checkString += "2";
            } else {
                checkString += "0";
            }
        }

        if ( checkString.includes("1111")){
            var winArray = [checkString, true, "1111"]; 
            if(para === 3){
                var index1 = checkString.indexOf(winArray[2]);
                if(check[index1].parentNode === check[index1+1].parentNode ||
                    check[index1+1].parentNode === check[index1+2].parentNode ||
                    check[index1+2].parentNode === check[index1+3].parentNode ) {
                    winArray[1] = false;
                }
            }else if(para === 4){
                var index1 = checkString.indexOf(winArray[2]);
                if(check[index1].parentNode.nextElementSibling !== check[index1+1].parentNode ||
                    check[index1+1].parentNode.nextElementSibling !== check[index1+2].parentNode ||
                    check[index1+2].parentNode.nextElementSibling !== check[index1+3].parentNode ) {
                    winArray2[1] = false;
                }
            }    
            return winArray;      

        } else if (checkString.includes("2222")){
            var winArray2 = [checkString, true, "2222"];
            
            if(para === 3){
                var index2 = checkString.indexOf(winArray2[2]);
                if(check[index2].parentNode === check[index2+1].parentNode ||
                    check[index2+1].parentNode === check[index2+2].parentNode ||
                    check[index2+2].parentNode === check[index2+3].parentNode ) {
                    winArray2[1] = false;
                } 
            }else if(para === 4){
                var index2 = checkString.indexOf(winArray2[2]);
                if(check[index2].parentNode.nextElementSibling !== check[index2+1].parentNode ||
                    check[index2+1].parentNode.nextElementSibling !== check[index2+2].parentNode ||
                    check[index2+2].parentNode.nextElementSibling !== check[index2+3].parentNode ) {
                    winArray2[1] = false;
                }
            }
            return winArray2;
            
        } else {
            return [checkString, false, "",check];
        }
    }  
    
    function getHolesDiagonalAscending(allHoles, rowHolesIndex){
        var HolesDiagonalAscending = [];        

        HolesDiagonalAscending.push(allHoles[rowHolesIndex-15]);
        HolesDiagonalAscending.push(allHoles[rowHolesIndex-10]);
        HolesDiagonalAscending.push(allHoles[rowHolesIndex-5]);

        HolesDiagonalAscending.push(allHoles[rowHolesIndex]);

        HolesDiagonalAscending.push(allHoles[rowHolesIndex+5]);
        HolesDiagonalAscending.push(allHoles[rowHolesIndex+10]);
        HolesDiagonalAscending.push(allHoles[rowHolesIndex+15]);

        return HolesDiagonalAscending;
    }

    function getHolesDiagonalDescending(allHoles, rowHolesIndex){
        var HolesDiagonalDescending = [];        

        HolesDiagonalDescending.push(allHoles[rowHolesIndex-21]);
        HolesDiagonalDescending.push(allHoles[rowHolesIndex-14]);
        HolesDiagonalDescending.push(allHoles[rowHolesIndex-7]);

        HolesDiagonalDescending.push(allHoles[rowHolesIndex]);

        HolesDiagonalDescending.push(allHoles[rowHolesIndex+7]);
        HolesDiagonalDescending.push(allHoles[rowHolesIndex+14]);
        HolesDiagonalDescending.push(allHoles[rowHolesIndex+21]);

        return  HolesDiagonalDescending;
    } 
    
    
    function gamePlay(){              

        var columnRows = clickedColumn.children();
        //Computer plays
        if($("#player2ID").html()==="Computer" && actualPlayer === "Player2"){

            function randomChild(){
                var randomNum = Math.floor(Math.random()*7);
                
                if($(".column").eq(randomNum).children().eq(0).hasClass("Player1") || $(".column").eq(randomNum).children().eq(0).hasClass("Player2")){
                    randomChild();
                } else {
                    columnRows = $(".column").eq(randomNum).children();
                }
            } 
            var indexCom = new Number();
            var compArray = [];
            //Computer is preventing Player1 from getting more than 2 coins in a row
            console.log(computerCheck);
            function checkTwo(){    
                if (computerCheck[0][0].includes("011") || computerCheck[1][0].includes("011") ||
                    computerCheck[1][0].includes("110") || computerCheck[2][0].includes("011") ||
                    computerCheck[2][0].includes("110") || computerCheck[3][0].includes("011") ||
                    computerCheck[3][0].includes("110")){
                    //Vertical
                    if(computerCheck[0][0].includes("011")){
                        compArray = computerCheck[0][3].toArray();
                        columnRows = $(compArray[0]).parent().children();
                        //Horizontal
                    } else if(computerCheck[1][0].includes("011") || computerCheck[1][0].includes("110")){
                        compArray = computerCheck[1][3].toArray();
                        indexCom = computerCheck[1][0].indexOf("011");
                        lastIndexCom = computerCheck[1][0].indexOf("110")+2;
                        if( $(computerCheck[1][3][indexCom]).next().hasClass("Player1") || $(computerCheck[1][3][indexCom]).next().hasClass("Player2")){
                            columnRows = $(compArray[indexCom]).parent().children();
                        }  else if( $(computerCheck[1][3][lastIndexCom]).next().hasClass("Player1") || $(computerCheck[1][3][lastIndexCom]).next().hasClass("Player2")){
                            columnRows = $(compArray[lastIndexCom]).parent().children();
                        } else if ( $(computerCheck[1][3][indexCom]).next().length === 0 && computerCheck[1][0].includes("011") ) {
                            columnRows = $(compArray[indexCom]).parent().children();
                        } else if ( $(computerCheck[1][3][lastIndexCom]).next().length === 0 && computerCheck[1][0].includes("110")) {
                            columnRows = $(compArray[lastIndexCom]).parent().children();
                        } else {
                            randomChild();
                        }
                        //Ascending
                    } else if(computerCheck[2][0].includes("011") || computerCheck[2][0].includes("110")){                    
                        compArray = computerCheck[2][3];
                        indexCom = computerCheck[2][0].indexOf("011");
                        lastIndexCom = computerCheck[2][0].indexOf("110")+2;
                        if(!($(computerCheck[2][3][indexCom]).length === 0)){
                            columnRows = $(compArray[indexCom]).parent().children();
                        } else if ($(computerCheck[2][3][lastIndexCom]).next().hasClass("Player1") || $(computerCheck[2][3][lastIndexCom]).next().hasClass("Player2")){
                            columnRows = $(compArray[lastIndexCom]).parent().children();
                        } else if($(computerCheck[2][3][indexCom]).next().hasClass("Player1") || $(computerCheck[2][3][indexCom]).next().hasClass("Player2")){
                            columnRows = $(compArray[indexCom]).parent().children();
                        } else {
                            randomChild();
                        }
                        //Descending
                    } else if(computerCheck[3][0].includes("011") || computerCheck[3][0].includes("110")){                    
                        compArray = computerCheck[3][3];
                        indexCom = computerCheck[3][0].indexOf("011");
                        lastIndexCom = computerCheck[3][0].indexOf("110")+2;
                        if(!($(computerCheck[3][3][lastIndexCom]).length === 0)){
                            columnRows = $(compArray[lastIndexCom]).parent().children();
                        } else if($(computerCheck[2][3][lastIndexCom]).next().hasClass("Player1") || $(computerCheck[2][3][lastIndexCom]).next().hasClass("Player2")){
                            columnRows = $(compArray[indexCom]).parent().children();
                        } else if ($(computerCheck[3][3][indexCom]).next().hasClass("Player1") || $(computerCheck[3][3][indexCom]).next().hasClass("Player2")){
                            columnRows = $(compArray[indexCom]).parent().children();
                        } else {
                            randomChild();
                        }
                    }      
                } else {
                    randomChild();
                }                 
            }

            if(computerCheck[0][0].includes("0111") || computerCheck[1][0].includes("0111") ||
                computerCheck[1][0].includes("1110") || computerCheck[2][0].includes("0111") ||
                computerCheck[2][0].includes("1110") || computerCheck[3][0].includes("0111") ||
                computerCheck[3][0].includes("1110")){
                    //Vertical
                if(computerCheck[0][0].includes("0111")){
                    compArray = computerCheck[0][3].toArray();
                    columnRows = $(compArray[0]).parent().children();
                    //Horizontal
                } else if(computerCheck[1][0].includes("0111") || computerCheck[1][0].includes("1110")){
                    compArray = computerCheck[1][3].toArray();
                    indexCom = computerCheck[1][0].indexOf("0111");
                    lastIndexCom = computerCheck[1][0].indexOf("1110")+3;
                    if( $(computerCheck[1][3][indexCom]).next().hasClass("Player1") || $(computerCheck[1][3][indexCom]).next().hasClass("Player2")){
                        columnRows = $(compArray[indexCom]).parent().children();
                    }  else if( $(computerCheck[1][3][lastIndexCom]).next().hasClass("Player1") || $(computerCheck[1][3][lastIndexCom]).next().hasClass("Player2")){
                        columnRows = $(compArray[lastIndexCom]).parent().children();
                    } else if ( $(computerCheck[1][3][indexCom]).next().length === 0 && computerCheck[1][0].includes("0111")) {
                        columnRows = $(compArray[indexCom]).parent().children();
                    } else if ( $(computerCheck[1][3][lastIndexCom]).next().length === 0 && computerCheck[1][0].includes("1110")) {
                        columnRows = $(compArray[lastIndexCom]).parent().children();
                    } else {
                        checkTwo();
                    }
                    //Ascending
                } else if(computerCheck[2][0].includes("0111") || computerCheck[2][0].includes("1110")){                    
                    compArray = computerCheck[2][3];
                    indexCom = computerCheck[2][0].indexOf("0111");
                    lastIndexCom = computerCheck[2][0].indexOf("1110")+3;
                    if(!($(computerCheck[2][3][indexCom]).length === 0)){
                        columnRows = $(compArray[indexCom]).parent().children();
                    } else if ($(computerCheck[2][3][lastIndexCom]).next().hasClass("Player1") || $(computerCheck[2][3][lastIndexCom]).next().hasClass("Player2")){
                        columnRows = $(compArray[lastIndexCom]).parent().children();
                    } else if($(computerCheck[2][3][indexCom]).next().hasClass("Player1") || $(computerCheck[2][3][indexCom]).next().hasClass("Player2")){
                        columnRows = $(compArray[indexCom]).parent().children();
                    } else {
                        checkTwo();
                    }
                    //Descending
                } else if(computerCheck[3][0].includes("0111") || computerCheck[3][0].includes("1110")){                    
                    compArray = computerCheck[3][3];
                    indexCom = computerCheck[3][0].indexOf("0111");
                    lastIndexCom = computerCheck[3][0].indexOf("1110")+3;
                    if(!($(computerCheck[3][3][lastIndexCom]).length === 0)){
                        columnRows = $(compArray[lastIndexCom]).parent().children();
                    } else if($(computerCheck[2][3][lastIndexCom]).next().hasClass("Player1") || $(computerCheck[2][3][lastIndexCom]).next().hasClass("Player2")){
                        columnRows = $(compArray[indexCom]).parent().children();
                    } else if ($(computerCheck[3][3][indexCom]).next().hasClass("Player1") || $(computerCheck[3][3][indexCom]).next().hasClass("Player2")){
                        columnRows = $(compArray[indexCom]).parent().children();
                    } else {
                        checkTwo();
                    }
                }
            } else {
                 checkTwo(); 
            }  
        }
                       
        for ( var row of columnRows.toArray().reverse()){
            var rowFilled = $(row).hasClass("Player1") || $(row).hasClass("Player2");
            
            if( !rowFilled ){
                $(row).addClass(actualPlayer);

                //Check vertical
                var checkVertical = checkWin(columnRows,1);

                //Check horizontal
                var rowIndex = columnRows.index(row);
                var rowIndexColumns = $(".row" + (rowIndex +1));
                var checkHorizontal = checkWin(rowIndexColumns,2);

                //Check diagonal
                var allHoles = $(".box");
                var rowHolesIndex = allHoles.index(row);

                var diagonalAscending = getHolesDiagonalAscending(allHoles,rowHolesIndex);
                var checkdiagonalAscending = checkWin(diagonalAscending,3);
                var diagonalDescending = getHolesDiagonalDescending(allHoles,rowHolesIndex);
                var checkdiagonalDescending = checkWin(diagonalDescending,4);
                
                // WIN, which coins?
                if(checkVertical[1] || checkHorizontal[1] || checkdiagonalAscending[1] || checkdiagonalDescending[1]){
                       
                    if(checkVertical[1]){            
                        var indexStart = checkVertical[0].indexOf(checkVertical[2]);
                        var winBoxes = columnRows.toArray().slice(indexStart,indexStart+4);                        
                        for (var item of winBoxes){
                            $(item).addClass("winClass");
                        }
                        $(".bottomGame").addClass("open");
                        $(".Coin").addClass("winCoin");
                    } else if(checkHorizontal[1]){
                        var indexStart = checkHorizontal[0].indexOf(checkHorizontal[2]);
                        var winBoxes = rowIndexColumns.toArray().slice(indexStart,indexStart+4);
                        for (var item of winBoxes){
                            $(item).addClass("winClass");
                        }
                        $(".bottomGame").addClass("open");
                        $(".Coin").addClass("winCoin");
                    } else if(checkdiagonalAscending[1]){
                        var indexStart = checkdiagonalAscending[0].indexOf(checkdiagonalAscending[2]);
                        var winBoxes = diagonalAscending.slice(indexStart,indexStart+4);
                        for (var item of winBoxes){
                            $(item).addClass("winClass");
                        }
                        $(".bottomGame").addClass("open");
                        $(".Coin").addClass("winCoin");
                    } else if(checkdiagonalDescending[1]){
                        var indexStart = checkdiagonalDescending[0].indexOf(checkdiagonalDescending[2]);
                        var winBoxes = diagonalDescending.slice(indexStart,indexStart+4);
                        for (var item of winBoxes){
                            $(item).addClass("winClass");
                        }
                        $(".bottomGame").addClass("open");
                        $(".Coin").addClass("winCoin");
                    }

                    function winMessage(){
                        if(actualPlayer === "Player1"){
                            actualPlayer = player1;
                        } else {
                            actualPlayer = player2;
                        }
                        
                        $("#winMessage").css({display:"flex"});
                        $("#winMessageInput").html(actualPlayer + " wins the game!");
                    }
                    setTimeout(winMessage,5000);
                    
                } else {
                    computerCheck = [checkVertical,checkHorizontal,checkdiagonalAscending,checkdiagonalDescending];
                    nextPlayer();
                }                
                break;
            }
        }

    }   

    $("#button3").on("click", function(){
        document.location.reload();
    });

})();