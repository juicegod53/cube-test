let active = false;
let timer_text = document.getElementById("timer-text")
let alg_text = document.getElementById("timer-alg")
let average_text = document.getElementById("average-text")
let times_container = document.getElementById("times-container")
let sessionTimes = [];
let keytrigger = "keyup";

let times = document.getElementById("times")

function generate_alg() {
    const moves = ["L", "R", "B", "F", "D", "U"];
    let algorithm = [];
    let last_move_axis;
    let last_move_checks = [["L","R"], ["B", "F"], ["D", "U"]];
    let move_double;
    let last_two_moves = [];

    for (let x = 0; x < 19; x++) {
        let move = moves[Math.floor(Math.random()*moves.length)];
        if (algorithm.length >= 2) {
            last_two_moves = algorithm.slice(Math.max(algorithm.length - 2, 0));
            for (let y = 0; y < 2; y++) {
                last_two_moves[y] = (last_two_moves[y]).charAt(0)
            }
            console.log(last_two_moves)
        }
        last_two_moves_store = last_two_moves
        last_two_moves.sort()
            if (last_move_checks.includes(last_two_moves)) {
                move_double = last_two_moves_store[0]
            }
        while ((move == last_move_axis) || (move == move_double)) {
            move = moves[Math.floor(Math.random()*moves.length)];
        }
        last_move_axis = move
        let y = Math.floor((Math.random() * 3) + 1);
        if (y == 2) {
            move += "2"
        } else if (y == 3) {
            move += "'"
        }

        algorithm.push(move)
    }
    alg_text.innerText = algorithm.join(" ")
}

function calculateTime(event) {
    if (event.key == " ") {
        if (active == false) {
            hide()
            startTime = new Date
            active = true
            window.removeEventListener(keytrigger, calculateTime)
            keytrigger = "keydown"
            window.addEventListener(keytrigger, calculateTime)
            timerInterval = setInterval(updateTimer, 100)
        } else {
            show()
            clearInterval(timerInterval)
            window.removeEventListener(keytrigger, calculateTime)
            keytrigger = "keyup"
            window.addEventListener(keytrigger, delay)
            finishTime = new Date
            timeTaken = Math.round(((finishTime - startTime) * 0.001) * 100) / 100
            timeTakenString = timeTaken.toFixed(2)
            active = false
            updateSessionTimes(timeTaken, alg_text.innerText)
            timer_text.innerText = timeTakenString
            generate_alg()
        }
    }
}

function delay() {
    window.removeEventListener(keytrigger, delay)
    window.addEventListener(keytrigger, calculateTime)
}

function hide() {
    alg_text.style.opacity = '0'
    average_text.style.opacity = '0'
    times_container.style.opacity = '0'
}

function show() {
    alg_text.style.opacity = '1'
    average_text.style.opacity = '1'
    times_container.style.opacity = '1'
}

function updateTimer() {
    currentTime = new Date
    timeShown = (Math.round(((currentTime - startTime) * 0.001) * 10) / 10).toFixed(1)
    timer_text.innerText = timeShown
}

function updateSessionTimes(time, algorithm) {
    sessionTimes.push([time, algorithm])
    const timeItem = document.createElement("li")
    timeItem.innerText = sessionTimes[sessionTimes.length - 1][0] + ": " + sessionTimes[sessionTimes.length - 1][1]
    times.appendChild(timeItem)
    if (times.children.length == 6) {
        times.removeChild(times.firstElementChild)
    }
    let sum = 0;
    for (let i = 0; i < sessionTimes.length; i++) {
        sum += sessionTimes[i][0]
    }
    average = (Math.round(sum / sessionTimes.length * 100) / 100).toFixed(2)
    average_text.innerText = 'Session average: ' + average
}

generate_alg()

window.addEventListener(keytrigger, calculateTime)

