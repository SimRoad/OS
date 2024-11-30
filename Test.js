let ready = [
    { id: 'A', arrT: 6, burT: 12, prio: 2, waiT: 0, comT: 0},
    { id: 'B', arrT: 8, burT: 4, prio: 5, waiT: 0, comT: 0},
    { id: 'C', arrT: 0, burT: 7, prio: 1, waiT: 0, comT: 0},
    { id: 'D', arrT: 5, burT: 3, prio: 4, waiT: 0, comT: 0},
    { id: 'E', arrT: 10, burT: 5, prio: 3, waiT: 0, comT: 0},
];

console.log("Mont Capoy's Preemptive Algorithms");
console.log("Round Robin: ");
let robin = JSON.parse(JSON.stringify(ready));
round(robin);

function display(P){
    P.sort((a, b) => a.arrT - b.arrT);
    console.log(robin);
    
    let x, LIM = P.length;
    console.log("Process Arrival Burst\t");
    for(x = 0; x < LIM; x++){
        console.log(`Process ${P[x].id}`);
    }
}

function retBurst(P){
    for(let x=0; x < ready.length;x++){
        P[x].burT = ready[x].burT;
    }
}

function round(P) {
    const LIM = P.length;
    const quant = 4; // Quantum time slice

    let log = Array(LIM + 1).fill(false); 
    let time = 0; 
    let x, y, n; 

    let timeStr = "0    ", idStr = "", temp = "";

    for (n=-1; !log[LIM];) {
        // Find the next process to execute
        let found = false;
        //console.log("-----");

        for (x = 0, y = n + 1; x < LIM; x++) {
            y = (n + 1 + x) % LIM; // Round-robin search
            //console.log(y);
            if (P[y].burT > 0 && P[y].arrT - 1 <= time) {
                n = y;
                found = true;
                break;
            }
        }

        // If no process is ready
        if (!found) {
            time++;
            console.log("Wait");
            continue;
        }

        // Executing the current process
        for (x = 0; P[n].burT != 0 && x < quant; x++, time++) {
            P[n].burT--;

            // Update waiting time for other ready processes
            for (y = 0; y < LIM; y++) {
                if (y != n && P[y].arrT <= time && P[y].burT > 0) {
                    P[y].waiT++;
                }
            }

            // If process completes during this quantum
            if (P[n].burT == 0) {
                P[n].comT = time + 1; // Completion time
                log[n] = true;
            }
        }

        //console.log(`${P[n].id}: ${time}`);
        temp = time.toString().padEnd(5, " ");
        timeStr += temp;
        temp = P[n].id.padEnd(5, " ")
        idStr += temp;
        // Check if all processes are done
        if (log.slice(0, LIM).every(Boolean)) {
            log[LIM] = true;
        }
    }

    console.log(timeStr);
    console.log(idStr);
    retBurst(P);
    display(P);
}

