var origBoard;
var whichPlayer=true;
var isPvP=true;
const huPlayer="O";
const aiPlayer="X";
const winCombos=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const cells =document.querySelectorAll('.cell');
function PvE(){
    isPvP=false;
    document.querySelector(".endGame").classList.remove("op");
    origBoard=Array.from(Array(9).keys());
    for(let i=0;i<cells.length;i++){
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].classList.remove("op");
        cells[i].classList.remove("shadow");
        cells[i].addEventListener('click',turnClick,false);
    }
}
function PvP(){
    whichPlayer=true;
    isPvP=true;
    document.querySelector(".endGame").classList.remove("op");
    origBoard=Array.from(Array(9).keys());
    for(let i=0;i<cells.length;i++){
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].classList.remove("op");
        cells[i].classList.remove("shadow");
        cells[i].addEventListener('click',turnClick1,false);
    }
}

function turnClick1(square){
    if(typeof origBoard[square.target.id] == "number"){
        setTimeout(() => {
            turn(square.target.id,whichPlayer ?huPlayer:aiPlayer);
            checkTie();
            whichPlayer=!whichPlayer;
        },50);
    }
}
function turnClick(square){
    if(typeof origBoard[square.target.id] == "number"){
        setTimeout(() => {
            turn(square.target.id,huPlayer);
            if(!checkWin(origBoard,huPlayer) && !checkTie()) {
                setTimeout(() => {
                    turn(bestSpot() , aiPlayer);
                }, 50);
            }
        }, 50);
            
    }
}

function turn(squareId,player){
    origBoard[squareId]=player;
    document.getElementById(squareId).innerText=player;
    document.getElementById(squareId).classList.add("op");
    let gameWon=checkWin(origBoard,player);
    if(gameWon) gameOver(gameWon);
}
function checkWin(board,player){
    let plays=board.reduce((a,e,i) =>
    (e===player)? a.concat(i): a,[]);
    let gameWon=null;
    for(let [index,win] of winCombos.entries()){
        if(win.every(elem =>plays.indexOf(elem) > -1)){
            gameWon= {index: index , player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).classList.add("shadow");
    }
    for(var i=0;i<cells.length;i++){
        cells[i].removeEventListener('click',(isPvP)?turnClick1:turnClick,false);
    }
    declareWinner((isPvP)?(gameWon.player==huPlayer?"<span class='span'>O</span> First Player Win.":"<span class='span'>X</span> Second Player Win."):(gameWon.player==huPlayer ? "<span class='span'>O</span> You Win!":"<span class='span'>X</span> You Lose."));
}
function declareWinner(who){
    document.querySelector(".endGame").classList.add("op");
    document.querySelector(".endGame .text").innerHTML=who;
    document.querySelector(".endGame").classList.add("op");
}
function emptySquares(){
    return origBoard.filter( s => typeof s == "number");
}

function bestSpot(){
    return minmax(origBoard,aiPlayer).index;
}

function checkTie(){
    if(emptySquares().length==0){
        for(var i=0;i<cells.length;i++){
            cells[i].classList.add("shadow");
            cells[i].removeEventListener("click",(isPvP)?turnClick1:turnClick,false);
        }
        declareWinner("<span class='span'>XO</span> Tie Game!");
        return true;
    }
    return false;
}

function minmax(newBoard,player){
    var availspots=emptySquares();
    if(checkWin(newBoard,huPlayer)){
        return {score:-10};
    }else if(checkWin(newBoard,aiPlayer)){
        return {score: 10};
    }else if(availspots.length===0){
        return {score: 0};
    }
    var moves=[];
    for(var i=0;i<availspots.length;i++){
        var move = {};
        move.index  =newBoard[availspots[i]];
        newBoard[availspots[i]]=player;
        if(player==aiPlayer){
            var result =minmax(newBoard,huPlayer);
            move.score=result.score;
        }else {
            var result=minmax(newBoard,aiPlayer);
            move.score =result.score;
        }
        newBoard[availspots[i]]=move.index;
        moves.push(move);
    }
    var bestMove;
    if(player === aiPlayer){
        var bestScore =-10000;
        for(var i=0;i<moves.length;i++){
            if(moves[i].score>bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }else {
        var bestScore = 10000;
        for(var i=0;i<moves.length;i++){
            if(moves[i].score<bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }
    return moves[bestMove];
}