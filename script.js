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
    text_box = document.getElementById('timer-alg')
    text_box.innerText = algorithm.join(' ')
}

generate_alg()