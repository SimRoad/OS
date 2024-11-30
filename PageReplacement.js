let pages = [7,0,1,2,0,3,0,4,2,3,0,3,1,2,0];
console.log(pages);

console.log("Mont Capoy's Page Replacement Algorithms");
console.log("*Disclaimer: Due to limited displaying options, there will be a letter next to the pages");

FIFO(JSON.parse(JSON.stringify(pages)));

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
    const FRAMES = 3;

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
    faults = LIM - hits;
    console.log("Page hits: " + hits);
    console.log("Page faults: " + faults);
    
    console.log("Hit Ratio = " + `(${hits} / ${LIM}) * 100 = ` + hits/LIM*100 + '%');
    console.log("Hit Fault = " + `(${faults} / ${LIM}) * 100 = ` + faults/LIM*100 + '%');

    //console.log(log)
    display(P, log);
}

function LRU(P){
    console.log("\nLeast Recently Used: ");
    const LIM = P.length;
    const FRAMES = 3;

    let F = Array(FRAMES).fill(-1);
    let uses = Array(FRAMES).fill(-1);
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
    faults = LIM - hits;
    console.log("Page hits: " + hits);
    console.log("Page faults: " + faults);
    
    console.log("Hit Ratio = " + `(${hits} / ${LIM}) * 100 = ` + hits/LIM*100 + '%');
    console.log("Hit Fault = " + `(${faults} / ${LIM}) * 100 = ` + faults/LIM*100 + '%');

    //console.log(log)
    display(P, log);
}