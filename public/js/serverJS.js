playedTiles = [];
oneTiles = [];
twoTiles = [];
firstPlayer = 0;
//const math = require('mathjs');

function checkTile(tile){
    val = playedTiles.includes(tile);
    console.log(playedTiles);
    console.log(val);
    return val;
}

function checkWin(array){
    console.log(array);
    if (array.includes('topLeft') == true && array.includes('topRight')==true && array.includes('topMiddle')==true){
        return true;
    } else if (array.includes('topLeft') == true && array.includes('middleLeft')==true && array.includes('bottomLeft')==true){
        return true;
    } else if (array.includes('bottomLeft') == true && array.includes('bottomMiddle')==true && array.includes('bottomRight')==true){
        return true;
    } else if (array.includes('middleLeft') == true && array.includes('center')==true && array.includes('middleRight')==true){
        return true;
    } else if (array.includes('topMiddle') == true && array.includes('center')==true && array.includes('bottomMiddle')==true){
        return true;
    } else if (array.includes('topRight') == true && array.includes('middleRight')==true && array.includes('bottomRight')==true){
        return true;
    } else if (array.includes('topLeft') == true && array.includes('center')==true && array.includes('bottomRight')==true){
        return true;
    } else if (array.includes('topRight') == true && array.includes('center')==true && array.includes('bottomLeft')==true){
        return true;
    } else {
        return false;
    }
}

function playTileByNumber(num){
    console.log(num);
    id = "";
    jid = "";
    if (num == 1){
        jid = "#topLeft";
        id = "topLeft";
    } else if (num == 2){
        jid = "#topMiddle";
        id = "topMiddle";
    } else if (num == 3){
        id = "#topRight";
        id = "topRight";
    } else if (num == 4){
        jid = "#middleLeft";
        id = "middleLeft";
    } else if (num == 5){
        jid = "#center";
        id = "center";
    } else if (num == 6){
        jid = "#middleRight";
        id = "middleRight";
    } else if (num == 7){
        jid = "#bottomLeft";
        id = "bottomLeft";
    } else if (num == 8){
        jid = "#bottomMiddle";
        id = "bottomMiddle";
    } else if (num == 9){
        jid = "#bottomRight";
        id = "bottomRight";
    } else {
        console.log("Invalid Number in playTileByNumber()");
        return false;
    }
    if (checkTile(id)==false){
        $(jid).css("background-color","lightcoral");
        $(jid).css("border","1px solid red");
        $(jid).css("color","red");
        $(jid).html("X");
        playedTiles.push(id);
        oneTiles.push(id);
        return true;
    }
    return false;
}

$("#twoPlayers").on('click',function(){
    console.log(Math.floor(Math.random()*9 + 1));
    playedTiles=[];
    oneTiles=[];
    twoTiles=[];
    $("#startPage").css("display","none");
    $("#twoPlayerContainer").css("display","block");
    $(".two-player").css("color",'black');
    $(".two-player").css("border",'1px solid black');
    $(".two-player").css("background-color",'lightgray');
    $(".two-player").html("This Button");
    $(".two-player").prop("disabled",false);
    $(".game-feedback").html("");
    $("#turnNumber").val(1);
    $("#playerTurn").val(1);
});

$(".two-player").on('click',function(){
    turn = $("#turnNumber").val();
    player =$("#playerTurn").val();
    id = $(this).attr('id');
    console.log(id);
    if(turn>9 || turn <= 0){
        console.log("Invalid Turn Number onclick() .two-player");
        return;
    }
    if(checkTile(id)==false){
        if(player == 1){
            console.log("player 1 turn onclick() .two-player")
            $(this).css("background-color","lightcoral");
            $(this).css("border","1px solid red");
            $(this).css("color","red");
            $(this).html("X");
            playedTiles.push(id);
            oneTiles.push(id);
            $("#playerTurn").val(1);
            if(checkWin(oneTiles)==true){
                console.log("Player 1 Wins!");
                $(".game-feedback").html("Player 1 Wins!");
                $("#turnNumber").val(1);
                $("#playerTurn").val(1);
                $("#newGame").show();
                $(".two-player").prop("disabled",true);
                return;
            }
            $("#playerTurn").val(2);
            if(turn==9){
                console.log("Game Over");
                $(".game-feedback").html("Game Over");
                $("#turnNumber").val(1);
                $("#playerTurn").val(1);
                $("#newGame").show();
                $(".two-player").prop("disabled",true);
            }
        } else if (player == 2){
            console.log("player 2 turn onclick() .two-player")
            $(this).css("background-color","lightblue");
            $(this).css("border","1px solid blue");
            $(this).css("color","blue");
            $(this).html("O");
            playedTiles.push(id);
            twoTiles.push(id);
            $("#playerTurn").val(1);
            if(checkWin(twoTiles)==true){
                console.log("Player 2 Wins!");
                $(".game-feedback").html("Player 2 Wins!");
                $("#turnNumber").val(1);
                $("#playerTurn").val(1);
                $("#newGame").show();
                $(".two-player").prop("disabled",true);
                return;
            }
            if(turn==9){
                console.log("Game Over");
                $(".game-feedback").html("Game Over");
                $("#turnNumber").val(1);
                $("#playerTurn").val(1);
                $("#newGame").show();
                $(".two-player").prop("disabled",true);
            }
        } else {
            console.log("Invalid Player Number onclick() .two-player");
        }
    } else {
        console.log("This Square was already clicked onclick() .two-player");
        return;
    }
    $("#turnNumber").val(parseInt(turn)+1);
});

$("#newGame2").on('click',function(){
    playedTiles=[];
    oneTiles=[];
    twoTiles=[];
    firstPlayer = Math.floor(Math.random()*1 + 1);
    $("#turnNumber").val(1);
    $("#playerTurn").val(firstPlayer);
    $(".game-feedback").html("");
    $(".one-player").css("color",'black');
    $(".one-player").css("border",'1px solid black');
    $(".one-player").css("background-color",'lightgray');
    $(".one-player").html("This Button");
    $(".one-player").prop("disabled",false);
    $(this).hide();
});

$("#newGame").on('click',function(){
    playedTiles=[];
    oneTiles=[];
    twoTiles=[];
    firstPlayer = Math.floor(Math.random()*1 + 1);
    $("#turnNumber").val(1);
    $("#playerTurn").val(firstPlayer);
    $(".game-feedback").html("");
    $(".two-player").css("color",'black');
    $(".two-player").css("border",'1px solid black');
    $(".two-player").css("background-color",'lightgray');
    $(".two-player").html("This Button");
    $(".two-player").prop("disabled",false);
    $(this).hide();
});

$("#returnHome").on('click',function(){
    console.log("return home onclick() #returnHome");
    $("#startPage").css("display","block");
    $("#twoPlayerContainer").css("display","none");
});

$("#logout").on('click',function(){
    console.log("Logout onclick() #logout");
});

$("#onePlayer").on('click',function(){
    firstTurn = Math.floor(Math.random() + 1);
    console.log("test onclick() #onePlayer");
    playedTiles=[];
    oneTiles=[];
    twoTiles=[];
    $("#startPage").css("display","none");
    $("#onePlayerContainer").css("display","block");
    $(".one-player").css("color",'black');
    $(".one-player").css("border",'1px solid black');
    $(".one-player").css("background-color",'lightgray');
    $(".one-player").html("This Button");
    $(".one-player").prop("disabled",false);
    $(".game-feedback").html("");
    $("#turnNumber").val(1);
    $("#playerTurn").val(firstTurn);
    onePlayerStart();
});

function onePlayerStart(){
    turn = $("#turnNumber").val();
    player =$("#playerTurn").val();
    if (turn != 1){
        console.log("Incorrect Turn Number in onePlayerStart()");
        return;
    }
    if (player == 2){ //if it is the users turn.
        $(".game-feedback").html("It is your turn. Click a button to play.");
        return;
    } else if (player == 1){
        $(".game-feedback").html("It is the computer's turn...");
        computerPlay();
    }
}

function computerPlay(){
    turn = $("#turnNumber").val();
    player =$("#playerTurn").val();
    played = false;
    if (player != 1){
        console.log("Not the computer's turn in computerPlay()");
        return;
    }
    if (turn <= 0 || turn > 9){
        console.log("Invalid Turn Number in computerPlay()");
        return;
    }
    if(turn==9){
        console.log("Game Over");
        $(".game-feedback").html("Game Over");
        $("#turnNumber").val(1);
        $("#playerTurn").val(1);
        $("#newGame").show();
        $(".two-player").prop("disabled",true);
    }
    while(played == false){
        num = Math.floor(Math.random() * 9 + 1)
        played = playTileByNumber(num);
    }
    if(checkWin(oneTiles)==true){
        console.log("Computer Wins!");
        $(".game-feedback").html("Computer Wins!");
        $("#turnNumber").val(1);
        $("#playerTurn").val(0);
        $("#newGame").show();
        $(".two-player").prop("disabled",true);
        return;
    }
    $("#turnNumber").val(parseInt(turn)+1);
    $("#playerTurn").val(2);
}

$(".one-player").on('click',function(){
    turn = $("#turnNumber").val();
    player =$("#playerTurn").val();
    id = $(this).attr('id');
    console.log(id);
    if(turn>9 || turn <= 0){
        console.log("Invalid Turn Number.");
        return;
    }
    if(checkTile(id)==false){
        if(player == 1){
            console.log("It is the computer's turn onclick() .one-player");
            return;
        } else if (player == 2){
            console.log("Player turn")
            $(this).css("background-color","lightblue");
            $(this).css("border","1px solid blue");
            $(this).css("color","blue");
            $(this).html("O");
            playedTiles.push(id);
            twoTiles.push(id);
            $("#playerTurn").val(1);
            if(checkWin(twoTiles)==true){
                console.log("Player 2 Wins!");
                $(".game-feedback").html("Player 2 Wins!");
                $("#turnNumber").val(1);
                $("#playerTurn").val(1);
                $("#newGame").show();
                $(".two-player").prop("disabled",true);
                return;
            }
            if(turn==9){
                console.log("Game Over");
                $(".game-feedback").html("Game Over");
                $("#turnNumber").val(1);
                $("#playerTurn").val(1);
                $("#newGame").show();
                $(".two-player").prop("disabled",true);
            }
        } else {
            console.log("Invalid Player Number onclick() .one-player")
        }
    } else {
        console.log("This Square was already clicked onclick() .one-player");
        return;
    }
    $("#turnNumber").val(parseInt(turn)+1);
});