const posArr = [64, 11, 14, 69, 12, 59, 85, 5];
const PREV = 17;
const TRACK = 100;
// const posArr = [256, 46, 56,276,48,236,338,112];
// const PREV = 68;
// const TRACK = 400;
const SEEK_RATE = 5;
const ALPHA = 20;

console.log(posArr);
console.log(`Track size: ${TRACK} \tPrevious Node: ${PREV} \t Current Node: ${posArr[0]}`);
console.log(`Seek rate: ${SEEK_RATE} \tAlpha: ${ALPHA}`);

let headMovement = (a, b) => a > b ? a - b : b - a;
let isSmaller = (a, b) => a > b ? b : a;

console.log("Mont Capoy's Disk Scheduling Algorithms");

FCFS(posArr);
cScan(posArr);
cLook(posArr);

function FCFS(P){
    console.log("First Come, First Serve");
    const LIM = P.length;

    let x; //for increments
    let a, b; //for operations

    for(x = 1, THM = 0; x < LIM; x++){
        //console.log(P[x] + '-' + P[x -1]);
        a = P[x-1]; //11
        b = P[x]; //64
        if(P[x] < P[x - 1]){
            a = P[x];
            b = P[x-1];
        }
        //console.log(a + " " + b + " = " + (a-b));

        let pos = `${a}`;
        pos = pos.padStart(a + 2, " ");
        pos = pos.padEnd(b, (P[x] < P[x - 1]) ? '<' : '>')
        pos += `${b}`

        console.log(pos);

        THM += headMovement(P[x], P[x - 1]);
    }
    //THM += P[]

    console.log("Total Head Movement: " + THM);
    console.log("Seek Time: " + THM * 5);
    console.log("\n\n");
}

function cScan(Arr){
    console.log("Circular Scan: ");
    
    let x, END; //for increments
    let a = 0, b = 0; //for operations
    let THM = 0;
    
    let P = [...Arr];
    P.push(TRACK-1); P.push(0);
    let LIM = P.length;
    P.sort((a, b) => a - b);
    if(PREV > Arr[0]) {
        P.reverse()
        b = TRACK-1;
    } else {a = TRACK-1}
    
    //console.log(P);
    
    END = P.indexOf(Arr[0]);
    THM += headMovement(P[END], a);
    console.log(headMovement(P[END], a));
    THM += headMovement(P[END - 1], b);
    console.log(headMovement(P[END - 1], b));
    for(x = (END + 1) % LIM; x != END; x = (x + 1) % LIM){
        if(x != 0){
            //console.log(P[x] + '-' + P[x -1]);
            a = P[x-1]; //11
            b = P[x]; //64
            if(P[x] < P[x - 1]){
                a = P[x];
                b = P[x-1];
            }

            let pos = `${a}`;
            pos = pos.padStart(a+2, " ");
            pos = pos.padEnd(b, (P[x] < P[x - 1]) ? '<' : '>')
            pos += `${b}`

            console.log(pos);
        }
    }
    THM += 20;

    console.log("Total Head Movement: " + THM);
    console.log("Seek Time: " + THM * 5);
    console.log("\n\n");
}

function cLook(Arr){
    console.log("Circular Scan: ");
    
    let x, END; //for increments
    let a = 0, b = 0; //for operations
    let THM = 0;
    
    let P = [...Arr];
    let LIM = P.length;
    P.sort((a, b) => a - b);
    if(PREV > Arr[0]) {
        P.reverse()
        b = Math.max(...P);
    } else {a = Math.max(...P)}
    
    //console.log(P);
    
    END = P.indexOf(Arr[0]);
    THM += headMovement(P[END], a);
    THM += headMovement(P[END - 1], P[0]);
    for(x = (END + 1) % LIM; x != END; x = (x + 1) % LIM){
        if(x != 0){
            //console.log(P[x] + '-' + P[x -1]);
            a = P[x-1]; //11
            b = P[x]; //64
            if(P[x] < P[x - 1]){
                a = P[x];
                b = P[x-1];
            }

            let pos = `${a}`;
            pos = pos.padStart(a+2, " ");
            pos = pos.padEnd(b, (P[x] < P[x - 1]) ? '<' : '>')
            pos += `${b}`

            console.log(pos);
        }
    }
    THM += 20;

    console.log("Total Head Movement: " + THM);
    console.log("Seek Time: " + THM * 5);
    console.log("\n\n");
}