let active = false;
let timer_text = document.getElementById("timer-text")
let alg_text = document.getElementById("timer-alg")
let average_text = document.getElementById("average-text")
let ao5_text = document.getElementById("ao5-text")
let ao12_text = document.getElementById("ao12-text")
let mo3_text = document.getElementById("mo3-text")
let average_text_pb = document.getElementById("average-text-pb")
let ao5_text_pb = document.getElementById("ao5-text-pb")
let ao12_text_pb = document.getElementById("ao12-text-pb")
let mo3_text_pb = document.getElementById("mo3-text-pb")
let stats_current_header = document.getElementById("stats-current-header")
let stats_current_pb = document.getElementById("stats-current-pb")
let pb_mo3 = 999999;
let pb_ao5 = 999999;
let pb_ao12 = 999999;
let pb_average = 999999;
let times_container = document.getElementById("times-container")
let puzzles = document.getElementById("puzzles")
let sessionTimes = [];
let keytrigger = "keyup";
let puzzle = "3x3";
let clear_times_button = document.getElementById("clear-times")

let fetchedTimes = localStorage.getItem('sessionTimes')
if (fetchedTimes && fetchedTimes.length > 0) {
    sessionTimes = JSON.parse(fetchedTimes)
    if (sessionTimes.length >= 3) {
        mo3 = localStorage.getItem("mo3")
        pb_mo3 = localStorage.getItem("pb_mo3");
        mo3_text.innerText = "mo3: " + mo3
        if (pb_mo3 != 999999) {
            mo3_text_pb.innerText = "mo3: " + pb_mo3
        } else {
            mo3_text_pb.innerText = "mo3: -"
        }
    }
    if (sessionTimes.length >= 5) {
        ao5 = localStorage.getItem("ao5")
        pb_ao5 = localStorage.getItem("pb_ao5");
        ao5_text.innerText = "ao5: " + ao5
        if (pb_ao5 != 999999) {
            ao5_text_pb.innerText = "ao5: " + pb_ao5
        } else {
            ao5_text_pb.innerText = "ao5: -"
        }
    }
    if (sessionTimes.length >= 12) {
        ao12 = localStorage.getItem("ao12")
        pb_ao12 = localStorage.getItem("pb_ao12");
        ao12_text.innerText = "ao12: " + ao12
        if (pb_ao12 != 999999) {
            ao12_text_pb.innerText = "ao12: " + pb_ao12
        } else {
            ao12_text_pb.innerText = "ao12: -"
        }
    }
    average = localStorage.getItem("average")
    average_text.innerText = "Overall: " + average
    if (sessionTimes.length >= 50) {
        pb_average = localStorage.getItem("pb_average");
        if (pb_average != 999999) {
            average_text_pb.innerText = "Overall: " + pb_average
        } else {
            average_text_pb.innerText = "Overall: -"
        }
    }
    let dnfCounter = 0
    for (let i = 0; i < sessionTimes.length; i++) {
        if ((typeof(sessionTimes[i][0])) == "string") {
            dnfCounter += 1
        }
        updateTimesShown(true, i)
    }
    if (dnfCounter == sessionTimes.length) {
        average = 999999
        average_text.innerText = "Overall: DNF" 
    }
    
}

function generate_alg(puzzle) {
    const moves = ["L", "R", "B", "F", "D", "U"];
    let algorithm = [];
    let last_move_axis;
    let last_move_checks = [["L","R"], ["B", "F"], ["D", "U"]];
    let move_double;
    let last_two_moves = [];
    let last_two_moves_store = "";

    if (puzzle == "3x3") {
        for (let x = 0; x < 19; x++) {
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
    } else if (puzzle == "2x2") {
        for (let x = 0; x < 10; x++) {
            let move = moves[Math.floor(Math.random()*moves.length)];
            let last_move_checks_2x2 = [["L", "U", "F"], ["R", "D", "B"]]
            if (last_move_checks_2x2[0].includes(last_move_axis)) {
                last_move_check_2x2 = last_move_checks_2x2[1][last_move_checks_2x2[0].indexOf(last_move_axis)]
            } else {
                last_move_check_2x2 = last_move_checks_2x2[0][last_move_checks_2x2[1].indexOf(last_move_axis)]
            }
            while (move == last_move_axis || move == last_move_check_2x2) {
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
            if (event.key == "Escape") {
                timeTaken = "(DNF) " + timeTaken
                timeTakenString = timeTaken
            }
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
            window.addEventListener(keytrigger, calculateTime);
        }, 100);
    }
}

let components = [alg_text, average_text, times_container, puzzles, ao5_text, ao12_text, mo3_text, ao5_text_pb, ao12_text_pb, mo3_text_pb, average_text_pb, stats_current_header, stats_current_pb, clear_times_button]

for (let i = 0; i < components.length; i++) {
    components[i].style.opacity = '1'
    components[i].style.transition = '0.5s opacity'
}

function hide() {
    for (let i = 0; i < components.length; i++) {
        components[i].style.opacity = '0'
    }
    document.body.style.pointerEvents = 'none';
}

function show() {
    for (let i = 0; i < components.length; i++) {
        components[i].style.opacity = '1'
    }
    document.body.style.pointerEvents = 'auto';
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
    let mo3_sum = 0;
    let ao5_sum = 0;
    let ao12_sum = 0;
    let mo3_dnf = false;
    let dnfCounter = 0;
    let ao5_values = []
    let ao12_values = []

    for (let i = 0; i < sessionTimes.length; i++) {
        if (typeof(sessionTimes[i][0]) == "number") {
            if (i >= sessionTimes.length - 3) {
                mo3_sum += sessionTimes[i][0]
            }
            if (i >= sessionTimes.length - 5) {
                ao5_values.push(sessionTimes[i][0])
            }
            if (i >= sessionTimes.length - 12) {
                ao12_values.push(sessionTimes[i][0])
            }
            sum += sessionTimes[i][0]
        } else {
            if (i >= sessionTimes.length - 3) {
                mo3_dnf = true
            }
            dnfCounter = dnfCounter + 1
        }
    }
    for (let i = 0; i < ao5_values.length; i++) {
        ao5_sum += ao5_values[i]
    }
    
    ao5_values.sort()

    if (ao5_values.length == 5) {
        ao5_sum = ao5_sum - ao5_values[0] - ao5_values[4]
    } else if (ao5_values.length == 4) {
        ao5_sum = ao5_sum - ao5_values[0]
    } else if (ao5_values.length <= 3) {
        ao5 = "DNF"
    }

    for (let i = 0; i < ao12_values.length; i++) {
        ao12_sum += ao12_values[i]
    }
    ao12_values.sort()

    if (ao12_values.length == 11) {
        ao12_sum = ao12_sum - ao12_values[0] - ao12_values[1] - ao12_values[10]
    } else if (ao12_values.length <= 10) {
        ao12 = "DNF"
    } else if (ao12_values.length == 12) {
        ao12_sum = ao12_sum - ao12_values[0] - ao12_values[11] - ao12_values[1] - ao12_values[10]
    }

    if (sessionTimes.length == dnfCounter && sessionTimes.length > 0) {
        average_text.innerText = "Overall: DNF"
    } else {
        average = (Math.round(sum / (sessionTimes.length - dnfCounter) * 100) / 100).toFixed(2)
        if (average < pb_average && sessionTimes.length >= 50) {
            pb_average = average
            average_text_pb.innerText = "Overall: " + average
            localStorage.setItem("pb_average", pb_average)
        }
        average_text.innerText = 'Overall: ' + average
    if (sessionTimes.length == 0) {
        average_text.innerText = "Overall: -"
    }
    localStorage.setItem("average", average)

    }
    if (sessionTimes.length >= 3) {
        if (mo3_dnf == false) {
            mo3 = (Math.round(mo3_sum / 3 * 100) / 100).toFixed(2)
            if (mo3 < pb_mo3) {
                pb_mo3 = mo3
                mo3_text_pb.innerText = "mo3: " + mo3
                localStorage.setItem("pb_mo3", pb_mo3)
            }
        } else {
            mo3 = "DNF"
        }
        mo3_text.innerText = "mo3: " + mo3
        localStorage.setItem("mo3", mo3)
    } else {
        mo3_text.innerText = "mo3: -"
    }
    if (sessionTimes.length >= 5) {
        if (ao5_values.length >= 4) {
            ao5 = (Math.round(ao5_sum / 3 * 100) / 100).toFixed(2)
        }
        if (ao5 < pb_ao5) {
            pb_ao5 = ao5
            ao5_text_pb.innerText = "ao5: " + ao5
            localStorage.setItem("pb_ao5", pb_ao5)
        }
        ao5_text.innerText = "ao5: " + ao5
        localStorage.setItem("ao5", ao5)
    } else {
        ao5_text.innerText = "ao5: -"
    }
    if (sessionTimes.length >= 12) {
        if (ao12_values.length >= 11) {
            ao12 = (Math.round(ao12_sum / 8 * 100) / 100).toFixed(2)
            if (ao12 < pb_ao12) {
                pb_ao12 = ao12
                ao12_text_pb.innerText = "ao12: " + ao12
                localStorage.setItem("pb_ao12", pb_ao12)
            }
        }
        ao12_text.innerText = "ao12: " + ao12
        localStorage.setItem("ao12", ao12)
    } else {
        ao12_text.innerText = "ao12: -"
    }
    // recheck for pb changes when times are removed
    if (sessionTimes.length >= 5) {
        let ao5s = []
        for (let i = 0; i < sessionTimes.length-4; i++) {
            let ao5_values = []
            for (let j = 0; j < 5; j++) {
                if (typeof(sessionTimes[i+j][0]) == "number") {
                    ao5_values.push(sessionTimes[i+j][0])
                } else {
                    ao5_values.push(999999)
                }
            }
            ao5_values.sort()
            let sum = ao5_values.reduce((accumulator, current) => {
                return accumulator + current
            }, 0)
            sum = sum - ao5_values[0] - ao5_values[4]
            let ao5 = Math.round(sum / 3 * 100) / 100
            if (ao5_values[3] != 999999) {
                ao5s.push(ao5)
            }
        }
        ao5s.sort()
        if (ao5s[0] != undefined) {
            pb_ao5 = ao5s[0]
            ao5_text_pb.innerText = "ao5: " + pb_ao5.toFixed(2)
        }
        else {
            pb_ao5 = 999999
            ao5_text_pb.innerText = "ao5: -"
        }
    } else {
        pb_ao5 = 999999
        ao5_text_pb.innerText = "ao5: -"
    }
    localStorage.setItem("pb_ao5", pb_ao5)
    if (sessionTimes.length >= 3) {
        let mo3s = []
        for (let i = 0; i < sessionTimes.length-2; i++) {
            let mo3_values = []
            for (let j = 0; j < 3; j++) {
                if (typeof(sessionTimes[i+j][0]) == "number") {
                    mo3_values.push(sessionTimes[i+j][0])
                } else {
                    mo3 = 999999
                }
            }
            let sum = mo3_values.reduce((accumulator, current) => {
                return accumulator + current
            }, 0)
            if (mo3 != 999999) {
                mo3 = Math.round(sum / 3 * 100) / 100
                mo3s.push(mo3)
            } else {
                mo3 = 0
            }

        }
        mo3s.sort()
        if (mo3s.length > 0) {
            pb_mo3 = mo3s[0]
            mo3_text_pb.innerText = "mo3: " + pb_mo3.toFixed(2)
        } else {
            pb_mo3 = 999999
            mo3_text_pb.innerText = "mo3: -"
        }
    } else {
        pb_mo3 = 999999
        mo3_text_pb.innerText = "mo3: -"
    }
    localStorage.setItem("pb_mo3", pb_mo3)
    if (sessionTimes.length >= 12) {
        let ao12s = []
        for (let i = 0; i < sessionTimes.length-11; i++) {
            let ao12_values = []
            for (let j = 0; j < 12; j++) {
                if (typeof(sessionTimes[i+j][0]) == "number") {
                    ao12_values.push(sessionTimes[i+j][0])
                } else {
                    ao12_values.push(999999)
                }
            }
            ao12_values.sort()
            let sum = ao12_values.reduce((accumulator, current) => {
                return accumulator + current
            }, 0)
            sum = sum - ao12_values[0] - ao12_values[11] - ao12_values[1] - ao12_values[10]
            let ao12 = Math.round(sum / 8 * 100) / 100
            if (ao12_values[10] != 999999) {
                ao12s.push(ao12)
            }
        }
        ao12s.sort()
        if (ao12s[0] != undefined) {
            pb_ao12 = ao12s[0]
            ao12_text_pb.innerText = "ao12: " + pb_ao12.toFixed(2)
        }
        else {
            pb_ao12 = 999999
            ao12_text_pb.innerText = "ao12: -"
        }
    } else {
        pb_ao12 = 999999
        ao12_text_pb.innerText = "ao12: -"
    }
    localStorage.setItem("pb_ao12", pb_ao12)
    if (sessionTimes.length >= 50) {
        // recheck overall
    }
}

function updateTimesShown(initialize = false, i = -1) {
    const timeItem = document.createElement("li")
    timeItem.className = "time-item"
    const timeItemText = document.createElement("p")
    const timeItemButtons = document.createElement("div")
    plusTwoButton = document.createElement("button")
    plusTwoButton.addEventListener("click", plusTwo)
    plusTwoButton.innerText = '+2'
    dnfButton = document.createElement("button")
    dnfButton.addEventListener("click", dnf)
    dnfButton.innerText = 'DNF'
    removeButton = document.createElement("button")
    removeButton.addEventListener("click", removeTime)
    removeButton.innerText = 'X'
    let time = sessionTimes[sessionTimes.length - 1][0]
    if (!initialize) {
        if (typeof(time) == "number") {
            time = time.toFixed(2)
        }
        timeItemText.innerText = sessionTimes.length + '. ' +time
    } else {
        time = sessionTimes[i][0]
        if (typeof(time) == "string") {
            time = "(DNF) " + parseFloat(time.substring(time.indexOf("(")+1,time.indexOf(")"))).toFixed(2)
        } else {
            time = time.toFixed(2)
        }
        timeItemText.innerText = (i+1) + '. ' + time
    }
    timeItem.append(timeItemText)
    timeItemButtons.append(plusTwoButton)
    timeItemButtons.append(dnfButton)
    timeItemButtons.append(removeButton)
    timeItem.append(timeItemButtons)
    times.prepend(timeItem)
    localStorage.setItem("sessionTimes", JSON.stringify(sessionTimes))
}

function plusTwo(e) {
    const timeItem = e.target.parentNode.parentNode;
    const timeItemText = timeItem.childNodes[0]
    let startOfTime = timeItemText.innerText.indexOf(".")+2;
    if (timeItemText.innerText.slice(-4) != "(+2)") {
        if (timeItemText.innerText.substring(timeItemText.innerText.indexOf("("),timeItemText.innerText.indexOf(")")+1) == "(DNF)") {
            startOfTime = timeItemText.innerText.indexOf(")") + 2
        }
        const time = parseFloat(timeItemText.innerText.substring(startOfTime))
        const newTime = (Math.round((time + 2) * 100) / 100)
        const position = timeItemText.innerText.substring(0,timeItemText.innerText.indexOf("."))
        sessionTimes[parseInt(position)-1][0] = newTime
        timeItemText.innerText = position + ". " + newTime.toFixed(2) + " (+2)"
    } else {
        const time = parseFloat(timeItemText.innerText.substring(timeItemText.innerText.indexOf(".")+2))
        const newTime = (Math.round((time - 2) * 100) / 100)
        const position = timeItemText.innerText.substring(0,timeItemText.innerText.indexOf("."))
        sessionTimes[parseInt(position)-1][0] = newTime
        timeItemText.innerText = position + ". " + newTime.toFixed(2)
    }
    updateSessionAverage()
    plusTwoButton.blur()
    localStorage.setItem("sessionTimes", JSON.stringify(sessionTimes))
}

function dnf(e) {
    const timeItem = e.target.parentNode.parentNode;
    const timeItemText = timeItem.childNodes[0]
    if (timeItemText.innerText.substring(timeItemText.innerText.indexOf("("),timeItemText.innerText.indexOf(")")+1) != "(DNF)") {
        if (timeItemText.innerText.slice(-4) == "(+2)") {
            const time = parseFloat(timeItemText.innerText.substring(timeItemText.innerText.indexOf(".")+2))
            const newTime = (Math.round((time - 2) * 100) / 100)
            const position = timeItemText.innerText.substring(0,timeItemText.innerText.indexOf("."))
            sessionTimes[parseInt(position)-1][0] = "DNF (" + newTime + ")"
            timeItemText.innerText = position + ". (DNF) " + newTime.toFixed(2)
        } else {
            const position = timeItemText.innerText.substring(0,timeItemText.innerText.indexOf("."))
            const time = parseFloat(timeItemText.innerText.substring(timeItemText.innerText.indexOf(".")+2))
            timeItemText.innerText = position + ". (DNF) " + time.toFixed(2)
            sessionTimes[parseInt(position)-1][0] = "DNF (" + time + ")"
        }

    } else {
        const time = timeItemText.innerText.substring(timeItemText.innerText.indexOf(")")+2)
        const position = timeItemText.innerText.substring(0,timeItemText.innerText.indexOf("."))
        sessionTimes[parseInt(position)-1][0] = parseFloat(time)
        timeItemText.innerText = position + ". " + time
    }
    updateSessionAverage()
    dnfButton.blur()
    localStorage.setItem("sessionTimes", JSON.stringify(sessionTimes))
}

function removeTime(e) {
    const timeItem = e.target.parentNode.parentNode;
    const times = e.target.parentNode.parentNode.parentNode;
    const timeItemText = timeItem.childNodes[0]
    const removedPosition = timeItemText.innerText.substring(0,timeItemText.innerText.indexOf("."))
    for (let i = times.childNodes.length-parseInt(removedPosition)-1; i >= 0; i--) {
        const timeItemText = times.childNodes[i].childNodes[0];
        const position = timeItemText.innerText.substring(0,timeItemText.innerText.indexOf("."))
        const time = timeItemText.innerText.substring(timeItemText.innerText.indexOf(".")+2)
        const newPosition = parseInt(position) - 1
        timeItemText.innerText = newPosition + ". " + time
    }
    timeItem.remove()
    const value = sessionTimes[parseInt(removedPosition)-1]
    sessionTimes = sessionTimes.filter(item => item !== value)
    updateSessionAverage()
    localStorage.setItem("sessionTimes", JSON.stringify(sessionTimes))
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

clear_times_button.addEventListener("click", clearTimes)

function clearTimes() {
    sessionTimes = []  
    localStorage.setItem("sessionTimes",[])
    pb_mo3 = pb_ao5 = pb_ao12 = pb_average = 999999
    pb_times = [mo3_text_pb, ao5_text_pb, ao12_text_pb, average_text_pb]
    for (let i = 0; i < pb_times.length; i++) {
        pb_times[i].innerText = pb_times[i].innerText.substring(0, pb_times[i].innerText.indexOf(" ")+1) + "-"
    }
    times.innerHTML = "";
    timer_text.innerText = "0.00"
    clear_times_button.blur()
    updateSessionAverage()
}
