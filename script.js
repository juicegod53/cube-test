let active = false;
let timer_text = document.getElementById("timer-text")
let alg_text = document.getElementById("timer-alg")
let average_text = document.getElementById("average-text")
let times_container = document.getElementById("times-container")
let puzzles = document.getElementById("puzzles")
let sessionTimes = [];
let keytrigger = "keyup";
let puzzle = "3x3";

let times = document.getElementById("times")

function generate_alg(puzzle) {
    const moves = ["L", "R", "B", "F", "D", "U"];
    let algorithm = [];
    let last_move_axis;
    let last_move_checks = [["L","R"], ["B", "F"], ["D", "U"]];
    let move_double;
    let last_two_moves = [];
    let last_two_moves_store = "";
    let move_count = 19;

    if (puzzle == "3x3") {
        move_count = 19;
    } else if (puzzle == "2x2") {
        move_count = 9;
    }

    for (let x = 0; x < move_count; x++) {
        let move = moves[Math.floor(Math.random()*moves.length)];
        if (algorithm.length >= 2) {
            last_two_moves = algorithm.slice(Math.max(algorithm.length - 2, 0));
            for (let y = 0; y < 2; y++) {
                last_two_moves[y] = (last_two_moves[y]).charAt(0)
            }
        }

        last_two_moves_store = last_two_moves.slice()
        last_two_moves.sort()

        let exists = last_move_checks.some(subArray => 
            subArray.length === last_two_moves.length && subArray.every((val, i) => val === last_two_moves[i])
        );
        
        if (exists) {
            move_double = last_two_moves_store[0]
        } else {
            move_double = "none"
        }
        
        while ((move == last_move_axis) || ((move == move_double) && (move_double != "none"))) {
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
    if (event.key == " " || active == true) {
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
            updateSessionTimes(timeTaken, alg_text.innerText, puzzle)
            timer_text.innerText = timeTakenString
            generate_alg(puzzle)
        }
    }
}

function delay(event) {
    if (event.key == " ") {
        window.removeEventListener(keytrigger, delay)
        window.addEventListener(keytrigger, calculateTime)
    } else {
        window.removeEventListener(keytrigger, delay);
        setTimeout(() => {
            window.addEventListener("keydown", calculateTime);
        }, 100);
    }
}

function hide() {
    alg_text.style.opacity = '0'
    average_text.style.opacity = '0'
    times_container.style.opacity = '0'
    puzzles.style.opacity = '0'
}

function show() {
    alg_text.style.opacity = '1'
    average_text.style.opacity = '1'
    times_container.style.opacity = '1'
    puzzles.style.opacity = '1'
}

function updateTimer() {
    currentTime = new Date
    timeShown = (Math.round(((currentTime - startTime) * 0.001) * 10) / 10).toFixed(1)
    timer_text.innerText = timeShown
}

function updateSessionTimes(time, algorithm, puzzle) {
    sessionTimes.push([time, algorithm, puzzle])
    updateTimesShown()
    updateSessionAverage()
}

function updateSessionAverage() {
    let sum = 0;
    for (let i = 0; i < sessionTimes.length; i++) {
        sum += sessionTimes[i][0]
    }
    average = (Math.round(sum / sessionTimes.length * 100) / 100).toFixed(2)
    average_text.innerText = 'Session average: ' + average
}

function updateTimesShown() {
    const timeItem = document.createElement("li")
    timeItem.className = "time-item"
    const timeItemText = document.createElement("p")
    const timeItemButtons = document.createElement("div")
    plusTwoButton = document.createElement("button")
    plusTwoButton.addEventListener("click", plusTwo)
    plusTwoButton.innerText = '+2'
    timeItemText.innerText = sessionTimes.length + '.' + ' ' +sessionTimes[sessionTimes.length - 1][0].toFixed(2)
    timeItem.append(timeItemText)
    timeItemButtons.append(plusTwoButton)
    timeItem.append(timeItemButtons)
    times.prepend(timeItem)
}

function plusTwo(e) {
    const timeItem = e.target.parentNode.parentNode;
    const timeItemText = timeItem.childNodes[0]
    if (timeItemText.innerText.slice(-4) != "(+2)") {
        const time = parseFloat(timeItemText.innerText.substring(3))
        const newTime = (Math.round((time + 2) * 100) / 100)
        const position = timeItemText.innerText.substring(0, timeItemText.innerText.indexOf("."))
        sessionTimes[parseInt(position)-1][0] = newTime
        console.log(sessionTimes)
        timeItemText.innerText = position + "." + " " + newTime.toFixed(2) + " (+2)"
        updateSessionAverage()
    }
    plusTwoButton.blur()
}

generate_alg(puzzle)

window.addEventListener(keytrigger, calculateTime)

puzzles.addEventListener("click", set_puzzle)

function set_puzzle() {
    new_puzzle = puzzles.options[puzzles.selectedIndex].text
    if (new_puzzle != puzzle) {
        generate_alg(new_puzzle)
        puzzle = new_puzzle
    }
}