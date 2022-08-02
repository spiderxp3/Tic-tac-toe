const DOMgameboard = document.getElementById("gameboard")
const cells = document.querySelectorAll(".cell")
const userOneInfo = document.getElementById("user-one-info")
const userOneName = document.getElementById("user-one-name")
const userOneScore = document.getElementById("user-one-score")
const userTwoInfo = document.getElementById("user-two-info")
const userTwoName = document.getElementById("user-two-name")
const userTwoScore = document.getElementById("user-two-score")
const playAgain = document.getElementById("play-again-button")
const rows = [document.querySelectorAll("[data-row='0']"), document.querySelectorAll("[data-row='1']"), document.querySelectorAll("[data-row='2']")]
const selectMenus = document.querySelectorAll(".select")
const miamiBlue = "#0bd3d3"
const miamiPink = "#fa46dc"
const miamiYellow ="yellow"//"rgb(253, 253, 127)"
const errmsg = document.getElementById("errmsg")

let players = {}// for storing player info 

//use local storage to save and fetch player info
const savePlayerLibrary=()=>{localStorage.setItem("players", JSON.stringify(players))}
const getPlayerLibrary=()=>{return players = JSON.parse(localStorage.getItem("players"))}
if(localStorage.getItem("players")){ 
    getPlayerLibrary()
}

cells.forEach(cell=>{
    if(cell.id%2==0){
        cell.textContent = "X"
        cell.classList.add("in")
    }else{
        cell.textContent="O"
        cell.classList.add("out")
    }
})

const player = (name)=>{
    //player factory function
    if(name in players){
        throw new Error("name taken")
        
    }else{
        let history = {"total wins":0, "total losses": 0, "total draws":0}
        let battleHistories = {} //for history against specific opponents
        players[name]={name, battleHistories, history}
        savePlayerLibrary()
        return {name, battleHistories, history}
    }
}

const getBattleHistory=(player1, player2)=>{

    if(player2.name in player1.battleHistories){
        return player1.battleHistories[player2.name]
    }else{
        player1.battleHistories[player2.name] = { wins: 0, losses:0, draws:0}
        player2.battleHistories[player1.name] = { wins: 0, losses:0, draws:0}
        savePlayerLibrary()
        return player1.battleHistories[player2.name]
    }
}

const match = (player1, player2)=>{
    //factory function-- controls the match, keeps track of scores, checks for winners
    getBattleHistory(player1, player2)
    userOneName.textContent = player1.name
    userOneScore.textContent=0
    userTwoName.textContent = player2.name
    userTwoScore.textContent=0

    /************************************************************/
    //board content
    let gameArray = [
        ["","",""],
        ["","",""],
        ["","",""]]
    const updateBoard = (row, col, XoValue)=>{
        gameArray[row][col] = XoValue
        return gameArray
    }
    function clearBoard(){
        gameArray = [
            ["","",""],
            ["","",""],
            ["","",""]]
    }

    const checkBoard=()=>{
        //checks for a winning position
        const rows = [gameArray[0], gameArray[1], gameArray[2]]
        const columns = [
            [[gameArray[0][0]],[gameArray[1][0]],[gameArray[2][0]]],
            [[gameArray[0][1]],[gameArray[1][1]],[gameArray[2][1]]],
            [[gameArray[0][2]],[gameArray[1][2]],[gameArray[2][2]]],
        ]
        const middle = gameArray[1][1]
        const diags = [
            [gameArray[0][0], middle, gameArray[2][2]],
            [gameArray[0][2], middle, gameArray[2][0]]
        ]
        const checkrows = rows.some(row=>{
            return row[0]&&row[1]&&row[2]&&row[0]==row[1]&&row[1]==row[2]
        })
        const checkcols = columns.some(col=>{
            return col[0][0]&&col[1][0]&&col[2][0]&&col[0][0]==col[1][0]&&col[1][0]==col[2][0]
        })
        const checkdiags = diags.some(diag=>{
            return diag[0][0]&&diag[1][0]&&diag[2][0]&&diag[0][0]==diag[1][0]&&diag[1][0]==diag[2][0]
        })
        const checkDraws = rows.some(row=>{
            return !row[0] || !row[1] ||!row[2]
        })
        if(checkrows||checkcols||checkdiags) return true

        if (!checkDraws) draw()
        }

    /************************************************************/
    //turn controls
    let firstturn = true
    let turn =false
    const changeTurn =()=>{
        if(turn){
            console.log("yep")
            userOneName.style.color = miamiBlue
            userTwoName.style.color = miamiYellow
            turn =false
        }
        else{
            userOneName.style.color = miamiYellow
            userTwoName.style.color = miamiPink
            turn =true
        }
        return turn
    }
    changeTurn()
    function whoseTurn(){
        return turn
    }
    /************************************************************/
    //scorekeeping
    let p1Score = 0
    let p2Score = 0
    const updateScores = () =>{
        userOneScore.textContent = p1Score
        userTwoScore.textContent = p2Score
        savePlayerLibrary()
    }
    const winner = (winner, loser)=>{
        if( winner==player1){
            p1Score+=1
        }else if(winner ==player2){
            p2Score +=1
        }
        if(firstturn){
            firstturn = false
            turn = true
            changeTurn()
        }else if(!firstturn){
            firstturn = true
            turn = false
            changeTurn()
        }
        winner.battleHistories[loser.name].wins +=1
        loser.battleHistories[winner.name].losses +=1
        winner.history["total wins"] +=1
        loser.history["total losses"] +=1
        updateScores()
    }
    const draw =()=>{
        player1.history["total draws"] +=1
        player2.history["total draws"] +=1
        player1.battleHistories[player2.name].draws +=1
        player2.battleHistories[player1.name].draws +=1
        p1Score +=.5
        p2Score+=.5
        userTwoName.textContent = "Draw!"
        userOneName.textContent = "Draw!"
        updateScores()
    }
    function getscore(){
        return {p1Score, p2Score}
    }
    const end=()=>{return p1Score>p2Score?`${player1.name} wins the match!`:`${player2.name} wins the match!`}

    return {gameArray, updateBoard, changeTurn, winner, 
            draw, end, whoseTurn, checkBoard, clearBoard, getscore}
}
/**********************************************************/
const animate = animator(cells)
let currentGame
let p1 
let p2 



cells.forEach(cell=>{
    cell.addEventListener("click", (e)=>{
        //conrols the DOM gameboard and interacts with the gameArray in the match object
        //each cell in the DOM has a row and column data tag to make it easier to update the match gameboard
        if(e.target.dataset.status == "active"){}//pass
        else{
            if (currentGame.whoseTurn()){
                //returns true, then its p1's turn. 
                cell.textContent = "X"
                cell.style.color = miamiBlue
                currentGame.updateBoard(e.target.dataset.row, e.target.dataset.column, "X")
                e.target.dataset.status = "active" 
                if(currentGame.checkBoard()==true){
                    //if true on p1's turn, p1 wins. 
                    userOneName.textContent = "Winner!"
                    animate.winner(userOneName)
                    freezeCells()
                    currentGame.winner(p1,p2)
                }else{currentGame.changeTurn()}
            }else{
                cell.textContent = "O"
                cell.style.color = miamiPink
                currentGame.updateBoard(e.target.dataset.row, e.target.dataset.column, "O")
                e.target.dataset.status = "active"
                if(currentGame.checkBoard()){
                    userTwoName.textContent = "Winner!"
                    animate.winner(userTwoName)
                    freezeCells()
                    currentGame.winner(p2,p1)
                }else{currentGame.changeTurn()}
            }
        }
    })
})



function freezeCells(){
    cells.forEach(cell=>{
        cell.dataset.status = "active"
    })
}
const emptyCells= ()=>{
    cells.forEach(cell=>{
        cell.textContent = ""
        cell.dataset.status = ""
    })
}
playAgain.addEventListener("click", ()=>{
    //resets DOM gameboard and match object gameArray
    userOneName.textContent = p1.name
    userTwoName.textContent = p2.name
    animate.horizontal()
    currentGame.clearBoard()
})



//next, new match screen
// some kind of animation that eliminates the border of the cells? 
// maybe for that I can make another factory function to keep count from being global.
//or just make the array, but still fact function to keep temp array and shift() the array

function populateDropdowns(){
    for(let i=0; i<selectMenus.length; i++){
        for(keys in players){
            let newop = document.createElement("option")
            newop.value = players[keys].name
            newop.textContent = players[keys].name
            //console.log(newop)
            selectMenus[i].appendChild(newop)

        }
    }
}

function removeChildren(parent){
    //removes all children of an element
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    };
}
const fightButton = document.getElementById("fight-button")
const newMatch = document.getElementById("new-match")
const cancelBttn = document.getElementById("cancel-button")
fightButton.addEventListener("click",(e)=>{
    e.preventDefault()
    p1 = players[selectMenus[0].value]
    p2 = players[selectMenus[1].value]
    currentGame= match(p1,p2)
    newMatch.classList.remove("active")
    animate.start()
})
const newMatchBttn = document.getElementById("new-match-button")
newMatchBttn.addEventListener("click",()=>{
    newMatch.classList.add("active")
    selectMenus[0].selectedIndex = 0
    selectMenus[1].selectedIndex = 0
    cancelBttn.classList.add("active")
})
cancelBttn.addEventListener("click",(e)=>{
    e.preventDefault()
    newMatch.classList.remove("active")
})
const addOptions = document.getElementsByClassName("add-option")
function toggleAddPlayer(){
    newMatch.classList.remove("active")
    addPlayerModal.classList.add("active")
}
document.getElementById("newplayer").addEventListener("click",(e)=>{
    e.preventDefault()
    toggleAddPlayer()
})



const addPlayerModal = document.getElementById("add-player")
const addPlayerBttn = document.getElementById("add-player-bttn")
const newPlayerTxt = document.getElementById("new-player")
addPlayerBttn.addEventListener("click", (e)=>{
    e.preventDefault()
    addPlayer(newPlayerTxt.value)
})
const cancelAdd =document.getElementById("cancel-add")
cancelAdd.addEventListener("click",(e)=>{
    e.preventDefault()
    addPlayerModal.classList.remove("active")
    newMatch.classList.add("active")
})
newPlayerTxt.addEventListener("input", ()=>{
   errmsg.textContent=""
})
populateDropdowns()

function addPlayer(string){
    try{
        player(string)
        selectMenus.forEach(menu=>{
            let newop = document.createElement("option")
            newop.textContent = string
            menu.appendChild(newop)
            addPlayerModal.classList.remove("active")
            newMatch.classList.add("active")
            newPlayerTxt.value = ""
        })
        errmsg.textContent = ""
    }catch(err){
        console.log(err)
        errmsg.textContent="Player name taken! Try something else."
    }
}