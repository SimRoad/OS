let ready = [
    { id: 'A', arrT: 6, burT: 12, prio: 3, waiT: 0, comT: 0},
    { id: 'B', arrT: 14, burT: 4, prio: 5, waiT: 0, comT: 0},
    { id: 'C', arrT: 0, burT: 7, prio: 1, waiT: 0, comT: 0},
    { id: 'D', arrT: 5, burT: 3, prio: 4, waiT: 0, comT: 0},
    { id: 'E', arrT: 20, burT: 5, prio: 2, waiT: 0, comT: 0},
];

display(ready);

console.log("Mont Capoy's Preemptive Algorithms");
round(JSON.parse(JSON.stringify(ready)));
// priority(JSON.parse(JSON.stringify(ready)));
// srtf(JSON.parse(JSON.stringify(ready)));

function display(P){
    P.sort((a, b) => a.arrT - b.arrT);
    let output = [], temp, tAt = 0, wait = 0;
    
    let x, LIM = P.length;
    for(x = 0; x < LIM; x++){
        temp = {Process: P[x].id, Arrival: P[x].arrT, Burst: P[x].burT, Completion: P[x].comT, Wait: P[x].waiT, Turnaround: P[x].comT - P[x].arrT};
        tAt += temp.Turnaround;
        wait += temp.Wait;
        output.push(temp);
    }
    console.table(output);

    tAt /= LIM; wait /= LIM;
    console.log("Avg Turnaround: " + tAt + "\nAvg Wait: " + wait);
    console.log(" ");
}

function retBurst(P){
    for(let x=0; x < ready.length;x++){
        P[x].burT = ready[x].burT;
    }
}

function round(P) {
    console.log("Round Robin: ");

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

function priority(P){
    console.log("Preemptive Priority: ");
    const LIM = P.length;

    let log = Array(LIM + 1).fill(false); 
    let time = 0; 
    let x, y, n, ctr; 

    let timeStr = "0    ", idStr = "", temp = "";

    for (n = -1, time = 0, ctr = 0; !log[LIM]; ctr++) {
        // Find the next process to execute
        let found = false;
        //console.log("-----");

        for (x = 0, y = 99; x < LIM; x++) {
            if (P[x].arrT <= time && P[x].burT > 0 ) {
                if(P[x].prio < y){
                    y = P[x].prio;
                    n = x;
                    //console.log(n);
                    found = true;
                }
            }
        }
        

        // If no process is ready
        if (!found) {
            time++;
            console.log("Wait");
            continue;
        }
        found = false;

        // Executing the current process
        let burst = P[n].burT;
        for (x = 0; x < burst; x++, time++) {
            // Update waiting time for other ready processes
            for (y = 0;y < LIM; y++) {
                if (y != n && P[y].arrT <= time && P[y].burT > 0) {
                    P[y].waiT++;
                    if(P[n].prio >= P[y].prio){
                        //console.log(P[y].id + ": " + time);
                        found = true;
                    } 
                }
            }

            if(found){ break; }
            P[n].burT--;
            // If process completes
            if (P[n].burT == 0) {
                //console.log(P[n].id + " Done!");
                P[n].comT = time + 1; // Completion time
                log[n] = true;
            }
        }

        //console.log(`${P[n].id}: ${time}`);
        temp = time.toString().padEnd(5, " ");
        timeStr += temp;
        temp = P[n].id.padEnd(5, " ")
        idStr += temp;
        //Check if all processes are done
        if (log.slice(0, LIM).every(Boolean)) {
            log[LIM] = true;
        }

    }

    console.log(timeStr);
    console.log(idStr);
    retBurst(P);
    display(P);
}

function srtf(P){
    console.log("Shortest Remaining Time First: ");
    const LIM = P.length;

    let log = Array(LIM + 1).fill(false); 
    let time = 0; 
    let x, y, n, ctr; 

    let timeStr = "0    ", idStr = "", temp = "";

    for (n = -1, time = 0, ctr = 0; !log[LIM]; ctr++) {
        // Find the next process to execute
        let found = false;
        //console.log("-----");

        for (x = 0, y = 99; x < LIM; x++) {
            if (P[x].arrT <= time && P[x].burT > 0 ) {
                if(P[x].burT < y){
                    y = P[x].burT;
                    n = x;
                    //console.log(n);
                    found = true;
                }
            }
        }
        

        // If no process is ready
        if (!found) {
            time++;
            console.log("Wait");
            continue;
        }
        found = false;

        // Executing the current process
        let burst = P[n].burT;
        for (x = 0; x < burst; x++, time++) {
            // Update waiting time for other ready processes
            for (y = 0;y < LIM; y++) {
                if (y != n && P[y].arrT <= time && P[y].burT > 0) {
                    P[y].waiT++;
                    if(P[n].burT >= P[y].burT){
                        //console.log(P[y].id + ": " + time);
                        found = true;
                    } 
                }
            }

            if(found){ break; }
            P[n].burT--;
            // If process completes
            if (P[n].burT == 0) {
                //console.log(P[n].id + " Done!");
                P[n].comT = time + 1; // Completion time
                log[n] = true;
            }
        }

        //console.log(`${P[n].id}: ${time}`);
        temp = time.toString().padEnd(5, " ");
        timeStr += temp;
        temp = P[n].id.padEnd(5, " ")
        idStr += temp;
        //Check if all processes are done
        if (log.slice(0, LIM).every(Boolean)) {
            log[LIM] = true;
        }

    }

    console.log(timeStr);
    console.log(idStr);
    retBurst(P);
    display(P);
}
