'use strict'

const BOOM = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
var gLevel = { size: 4, mines: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var cellCount
var timerInterval


function onInit() {
    cellCount = 0
    gGame.isOn = true
    closeModal()
    clearInterval(timerInterval)
}

function onStart() {
    gGame.isOn = true
    gBoard = buildBoard(4)
    addMine(2)
    renderBoard(gBoard)
    updateMinesAroundCount()
    gGame.secsPassed = timer()
}

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: true }
        }
    }
    return board
}

function changeLevel(size) {
    // document.querySelector(".easy-level").addEventListener("click",
    //     function () { changeLevel(4) });
    // document.querySelector(".medium-level").addEventListener("click",
    //     function () { changeLevel(8) });
    // document.querySelector(".hard-level").addEventListener("click",
    //     function () { changeLevel(12) });
    gGame.isOn = true
    clearInterval(timerInterval)
    gBoard = buildBoard(size)
    renderBoard(gBoard)
    if (size === 4) addMine(2)
    if (size === 8) addMine(14)
    if (size === 12) addMine(32)
}

// function renderCell(location, value) {

//     const elCell = document.querySelector(`cell cell-${location.i}-${location.j}`)
//     console.log('elCell', elCell)

//     elCell.innerHTML = value
// }

function renderBoard(board) {
    if (gGame.isOn) {
        // console.log('board', board)
        var strHTML = ''
        for (var i = 0; i < board.length; i++) {
            strHTML += '<tr>'
            for (var j = 0; j < board[0].length; j++) {
                var currCell = board[i][j]
                var className = `cell cell-${i}-${j}`
                currCell = ''
                strHTML += `<td class="${className}"  onmousedown="handleClick(event,this,${i},${j})">`
                strHTML += currCell

                strHTML += '</td>'
            }
            strHTML += '</tr>'

        }
        const elBoard = document.querySelector('.board')
        elBoard.innerHTML = strHTML
        // var cells = document.querySelectorAll('.cell')
        // for (let i = 0; i < cells.length; i++) {
        //     cells[i].addEventListener("click", function (e) {
        // handleClick(e, cells[i], cells[i].classList[1].split("-")[1], cells[i].classList[1])
        // })
    }
}
// }

function handleClick(event, element, i, j) {
    if (event.button === 0) {
        onCellClicked(element, i, j, gBoard)
    }
    var rendringCell = document.querySelector(`.board`);
    rendringCell.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        var elCell = event.target;
        onCellMarked(elCell,i,j)
    })
}

function onCellMarked(elCell,cellI,cellJ) {
    event.preventDefault()
    if (elCell) {
        elCell.innerText = FLAG;
        gBoard[cellI][cellJ].isMarked = true
    } else {
        console.log("Invalid element");
    }
}

function onCellClicked(elCell, cellI, cellJ, board) {
    // gBoard[cellI][cellJ].isShown =true
    if (gBoard[cellI][cellJ].isMine) {
        elCell.innerText = BOOM
        gameOver()
    } else {
        elCell.innerText = gBoard[cellI][cellJ].minesAroundCount
        gBoard[cellI][cellJ].isShown = true
        // cellCount++
        if (gBoard[cellI][cellJ].minesAroundCount === 0) {
            expanShown(gBoard, elCell, cellI, cellJ)
        }
    }
}
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

function addMine(num) {
    for (var m = 0; m < num; m++) {
        var emptyPoss = getEmptyPos()
        gBoard[emptyPoss.i][emptyPoss.j].isMine = true

    }
}

function expanShown(board, elCell, cellI, cellJ) {

    // console.log('gBoard[i][j].minesAroundCount',gBoard[i][j].minesAroundCount)
    // if (gBoard[cellI][cellJ].minesAroundCount === 0) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isShown) continue
            var negsCell = document.querySelector(`.cell-${i}-${j}`)
            // console.log(negsCell.innerText = gBoard[i][j].minesAroundCount, 'negsCell.innerText = gBoard[i][j].minesAroundCount');
            negsCell.innerText = gBoard[i][j].minesAroundCount
            cellCount++
            checkWin()
        }
    }
}

function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {

            if (gBoard[i][j].isMarked || gBoard[i][j].isShown) 

            console.log('cellCount', cellCount)
            if (cellCount === ((gLevel.size ** 2) - gLevel.mines)) {
                var msg = 'YOU WIN'
                openModal(msg)
            }
        }
    }
}

function gameOver() {
    gGame.isOn = false
    console.log('game over');
    var msg = 'Game Over'
    openModal(msg)
    clearInterval(timerInterval)
}

function updateMinesAroundCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === BOOM) return
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard)
        }
    }
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
