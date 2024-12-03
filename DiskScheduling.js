const posArr = [17, 64, 11, 14, 69, 12, 59, 85, 28]
const TRACK = 100;
const SEEK_RATE = 5;

let headMovement = (a, b) => a > b ? a - b : b - a;

console.log(posArr);
console.log("Mont Capoy's Disk Scheduling Algorithms");

FCFS(posArr);

function display(){

}

function FCFS(P){
    console.log("First Come, First Serve");
    const LIM = P.length;

    let x, y;
    let move = "|", pos = `${P[0]}`;
    move = move.padStart(P[0], " ");
    pos = pos.padStart(P[0], " ");

    let temp = `${P[1]}`;
    temp = temp.padStart(headMovement(P[0],P[1])," ");
    pos += temp;

    if(P[0] < P[1]){
        temp = '>'
        temp = temp.padStart(headMovement(P[0],P[1]),"-");
        move += temp;
    } else {
        temp = '<';
        
    }

    for(x = 2, THM = 0; x < LIM; x++){
        console.log(P[x] + '-' + P[x -1]);
        THM += headMovement(P[x], P[x - 1]);
    }
    //THM += P[]

    console.log("Total Head Movement: " + THM);
    console.log("Seek Time: " + THM * 5);

    console.log(pos)
    console.log(move);
}