'use strict'



var timerInterval

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function timer() {
    var startTime = Date.now()

    timerInterval = setInterval( () => {
        var elapsedTime = Date.now() - startTime
        document.querySelector('.timer').innerText = (
            elapsedTime / 1000
        ).toFixed(3)
    }, 37)
}
function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    clearInterval(timerInterval)
    onStart()
}