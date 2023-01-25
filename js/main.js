'use strict'

const BOOM = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
var gLevel = { size: 4, mines: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }



function onInit() {
    gBoard = buildBoard(4)
    addMine()
    renderBoard(gBoard)
    updateMinesAroundCount()

}

function OnCell() {

}
function buildBoard() {
    var size = gLevel.size
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: true }

        }
    }
    return board
}

function renderCell(location, value) {
    
    const elCell = document.querySelector(`cell cell-${location.i}-${location.j}`)
    console.log('elCell',elCell)

    elCell.innerHTML = value
}

function renderBoard(board) {
    console.log('board', board)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = `cell cell-${i}-${j}`
            // currCell = (currCell.isMine) ? BOOM : currCell.minesAroundCount
            currCell = ''
            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" >`
            strHTML += currCell

            strHTML += '</td>'
        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// const myButton = document.querySelector(`cell cell-${0}-${0}`);
// myButton.addEventListener("click", function(event) {
//   if (event.button === 0) {
//     console.log("Left button clicked");
//   } else if (event.button === 2) {
//     console.log("Right button clicked");
//   }
// })


// (currCell.isMine) ? BOOM : currCell.minesAroundCount

function getEmptyPos() {
    const emptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] !== BOOM) {
                emptyPoss.push({ i, j })
            }
        }
    }
    var randIdx = getRandomIntInclusive(0, emptyPoss.length)
    return emptyPoss[randIdx]
}

function addMine() {

    var num = gLevel.mines
    for (var i = 0; i < num; i++) {
        var emptyPoss = getEmptyPos()
        gBoard[emptyPoss.i][emptyPoss.j].isMine = true

    }
}

function onCellClicked(elCell, cellI, cellJ) {
    console.log(gBoard[cellI][cellJ].isMine);

    if (gBoard[cellI][cellJ].isMine) {
        elCell.innerText = BOOM
        gameOver()
    } else {
        elCell.innerText = gBoard[cellI][cellJ].minesAroundCount
        if (gBoard[cellI][cellJ].minesAroundCount === 0) {
            elCell.innerText = ''
            expanShown(gBoard, elCell, cellI, cellJ)

        }
    }


}
function expanShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            // console.log('gBoard[i][j].minesAroundCount',gBoard[i][j].minesAroundCount)
            if(gBoard[i][j].minesAroundCount===0) var count = gBoard[i][j].minesAroundCount
             
            //  renderCell(location, value) 
            // gBoard[i][j].minesAroundCount += setMinesNegsCount(i, j, gBoard)
            // console.log('gBoard[i][j].minesAroundCount', gBoard[i][j].minesAroundCount)
             renderCell( {i,j}, count)
        }
    }
}

// function doSomething(e) {
//     var rightclick;
//     if (!e) var e = window.event;
//     if (e.which) rightclick = (e.which == 3);
//     else if (e.button) rightclick = (e.button == 2);
//     alert('Rightclick: ' + rightclick); // true or false
// }
// function onCeClicked(elCell, cellI, cellJ) {

//     if (gBoard[cellI][cellJ] === LIFE) {
//         // update the model:
//         gBoard[cellI][cellJ] = SUPER_LIFE
//         // console.log('gBoard', gBoard)
//         // update the dom:
// elCell.innerText = SUPER_LIFE
//         blowUpNegs(gBoard, cellI, cellJ)
//     }

// }

function gameOver() {
    console.log('game over');
}

function updateMinesAroundCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === BOOM) return
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard)

        }
    }

    renderBoard(gBoard)
}
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function setMinesNegsCount(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue

            if (board[i][j].isMine) negsCount++
        }
    }
    return negsCount
}