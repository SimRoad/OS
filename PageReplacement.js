const FRAMES = 3;

let pages = [7,0,1,2,0,3,0,4,2,3,0,3,1,2,0];
console.log(pages);

console.log("Mont Capoy's Page Replacement Algorithms");

// FIFO(JSON.parse(pages);
// LRU(JSON.parse(pages);

let pages2 = [7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7];
Optimal(pages2);

function display(P, F){
    const LIM = P.length;
    const FRAMES = F.length;

    let x, y;
    let char = 97, tStr = "";
    let table = Array(FRAMES).fill(null).map(() => ({}));
    let temp = {};
    for(x=0;x<FRAMES;x++){
        table[x].Pages = `F${x+1}`;
    }
    table[FRAMES-1].Pages = " ";
    
    console.log("*Disclaimer: Due to limited displaying options, there will be a letter next to the pages numbers\n The letters doesn't mean anything nor the index");
    for(x=0;x<LIM;x++){
        tStr = String.fromCharCode(char++);
        for(y=0;y<FRAMES;y++){
            table[y][`${P[x]} ${tStr}`] = F[y][x];
        }
    }
    console.table(table);
}

function FIFO(P){
    console.log("\nFirst in, First out: ");
    const LIM = P.length;

    let F = Array(FRAMES).fill(-1);
    let log = Array(FRAMES).fill(null).map(() => [-1]);
    log.push([]);
    let x, y;
    let ndx = 0, hits = 0, faults = 0;

    for(x = 0; x < LIM; x++){
        log[FRAMES].push('F');
        if(F.includes(P[x])){
            hits++;
            log[FRAMES][x] = 'H';
        } else {
            F[ndx] = P[x];
            log[ndx][x] = P[x];
            ndx = (ndx + 1) % FRAMES;
        }

        for(y=0; y < FRAMES; y++){
            log[y].push(log[y][x]);
        }
    }
    display(P, log);
    
    faults = LIM - hits;
    console.log("Page hits: " + hits);
    console.log("Page faults: " + faults);
    
    console.log("Hit Ratio = " + `(${hits} / ${LIM}) * 100 = ` + hits/LIM*100 + '%');
    console.log("Hit Fault = " + `(${faults} / ${LIM}) * 100 = ` + faults/LIM*100 + '%');

    //console.log(log)
}

function LRU(P){
    console.log("\nLeast Recently Used: ");
    const LIM = P.length;

    let F = Array(FRAMES).fill(-1);
    let log = Array(FRAMES).fill(null).map(() => [-1]);
    let age = Array(FRAMES).fill(-1);
    log.push([]);
    let x, y;
    let ndx, hits = 0, faults = 0;

    for(x=0,y=FRAMES; x < FRAMES; x++, y--){
        age[x] = y;
    }

    for(x = 0; x < LIM; x++){
        log[FRAMES].push('F');
        if(F.includes(P[x])){
            hits++;
            ndx = F.indexOf(P[x]);
            age[ndx] = -1;
            log[FRAMES][x] = 'H';
        } else {
            ndx = age.indexOf(Math.max(...age));
            F[ndx] = P[x];
            log[ndx][x] = P[x];
            age[ndx] = -1;
        }

        for(y=0; y < FRAMES; y++){
            age[y]++;
            log[y].push(log[y][x]);
        }
    }
    
    faults = LIM - hits;
    console.log("Page hits: " + hits);
    console.log("Page faults: " + faults);
    
    console.log("Hit Ratio = " + `(${hits} / ${LIM}) * 100 = ` + hits/LIM*100 + '%');
    console.log("Hit Fault = " + `(${faults} / ${LIM}) * 100 = ` + faults/LIM*100 + '%');

    //console.log(log)
    display(P, log);
}

function Optimal(P){
    console.log("\nOptimal: ");
    const LIM = P.length;

    let F = Array(FRAMES).fill(-1);
    let log = Array(FRAMES).fill(null).map(() => [-1]);
    let nextArr = Array(FRAMES).fill(99);
    log.push([]);
    let x, y;
    let ndx, hits = 0, faults = 0;

    for(x = 0; x < LIM; x++){
        log[FRAMES].push('H');
        if(F.includes(P[x])){
            hits++;
            ndx = F.indexOf(P[x]);
        } else {
            ndx = nextArr.indexOf(Math.max(...nextArr));
            F[ndx] = P[x];
            log[ndx][x] = P[x];
            log[FRAMES][x] = 'F';
        }
        console.log(log[FRAMES][log[FRAMES].length - 1] + ": "+ nextArr);
        
        for(y=x+1; y<LIM && P[y] != P[x]; y++){}
        nextArr[ndx] = y; //so even if y = LIM, then the number doesn't exist anymore

        for(y=0; y < FRAMES; y++){
            log[y].push(log[y][x]);
        }
    }
    
    faults = LIM - hits;
    console.log("Page hits: " + hits);
    console.log("Page faults: " + faults);
    
    console.log("Hit Ratio = " + `(${hits} / ${LIM}) * 100 = ` + hits/LIM*100 + '%');
    console.log("Hit Fault = " + `(${faults} / ${LIM}) * 100 = ` + faults/LIM*100 + '%');

    //console.log(log)
    display(P, log);
}