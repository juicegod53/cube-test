let active = false;
let timer_text = document.getElementById("timer-text")
let alg_text = document.getElementById("timer-alg")
let sessionTimes = [];

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
        }
            if (last_move_checks.includes(last_two_moves.sort())) {
                move_double = last_two_moves[0]
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
            startTime = new Date
            active = true
            timerInterval = setInterval(updateTimer, 100)
        } else {
            clearInterval(timerInterval)
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
}

generate_alg()

window.addEventListener("keypress", calculateTime)

