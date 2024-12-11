// let ready = [
//     { id: 'A', arrT: 6, burT: 12, prio: 3, waiT: 0, comT: 0},
//     { id: 'B', arrT: 14, burT: 4, prio: 5, waiT: 0, comT: 0},
//     { id: 'C', arrT: 0, burT: 7, prio: 1, waiT: 0, comT: 0},
//     { id: 'D', arrT: 5, burT: 3, prio: 4, waiT: 0, comT: 0},
//     { id: 'E', arrT: 20, burT: 5, prio: 2, waiT: 0, comT: 0},
// ];

const readline = require('readline/promises');

// Initialize readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let count = 0;

// Recursive function to collect process data
console.log("Enter the times for Arrival and Burst & Priority # separated by spaces: ");
console.log("(Arrival, Burst, Priority): 5 10 1\n");
async function getProcessDetails(numProcesses) {
    let input = await rl.question(
        `Process ${count + 1}: `,
    );
    const [arrT, burT, prio] = input.split(' ');

    ready.push({
        id: String.fromCharCode(65 + count), // Assign IDs as A, B, C, ...
        arrT: parseInt(arrT),
        burT: parseInt(burT),
        prio: parseInt(prio),
        waiT: 0,
        comT: 0,
    });

    count++;

    // If all processes are entered, run algorithms
    if (count < numProcesses) {
        await getProcessDetails();
    } else {
        interface(ready);
    }
}

let ready = [];
console.clear();
rl.question('Enter the number of processes: ').then(numProcesses=>{
    numProcesses = parseInt(numProcesses); // Convert input to a number
    
    getProcessDetails(numProcesses); // Start collecting process details
})


async function interface(P) {
    display(ready);
    console.log("Mont Capoy's Preemptive Algorithms");

    console.log("\nOptions: ");
    console.log("[1]: Round Robin");
    console.log("[2]: Priority Queue");
    console.log("[3]: Shortest Remaining Time First");
    console.log("[4]: ALL");
    console.log("[9]: End");

    const option = parseInt(await rl.question("Enter option: "));

    switch (option) {
        case 1: 
            await round(JSON.parse(JSON.stringify(P)));
            break;
        case 2:
            await priority(JSON.parse(JSON.stringify(P)));
            break;
        case 3:
            await srtf(JSON.parse(JSON.stringify(P)));
            break;
        case 4:
            await priority(JSON.parse(JSON.stringify(P)));
            await srtf(JSON.parse(JSON.stringify(P)));
            await round(JSON.parse(JSON.stringify(P)));
            break;
        case 9:
            console.log("Exiting...");
            rl.close();
            return; // Exit the loop
        default:
            console.log("Invalid Option");
    }

    // Recursively return to the interface unless exiting
    if (option !== 9) {
        await interface(P);
    }
}

function askQuestion(query) {
    return new Promise(async (resolve) => {
        await rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function deleteProcess() {
    let answer = await rl.question('Do you want to delete a process (Y/N)? ');
    if (answer.toUpperCase() === 'Y') {
        let id = await rl.question('Enter the ID of the process to delete (A, B, C, etc.): ');
        const index = ready.findIndex(p => p.id === id.toLocaleUpperCase);
        if (index !== -1) {
            ready.splice(index, 1);
            console.log(`Process ${id} has been deleted.`);
            display(ready); // Show updated queue after deletion
        } else {
            console.log('Process not found.');
            id();
        }
    } 
}

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

async function round(P) {
    console.log("\n\n\nRound Robin:");

    // Wait for user input
    const quant = parseInt(await rl.question("How long is the quant (seconds): "));
    console.log(`The quant is: ${quant}`);

    // Execute Round Robin logic
    executeRoundRobin(P, quant);

    // Return to the interface
    await interface(P); // Recursive call back to options
}

function executeRoundRobin(P, quant) {
    const LIM = P.length;
    let log = Array(LIM + 1).fill(false); 
    let time = 0;
    let x, y, n; 

    let timeStr = "0    ", idStr = "", temp = "";
    for (n = -1; !log[LIM];) {
        let found = false;
        for (x = 0, y = n + 1; x < LIM; x++) {
            y = (n + 1 + x) % LIM;
            if (P[y].burT > 0 && P[y].arrT <= time) {
                n = y;
                found = true;
                break;
            }
        }

        if (!found) {
            time++;
            n = P.findIndex((process) => process.arrT === time);
            // console.log(`Wait: ${n}`);
            if(n >= 0){
                temp = time.toString().padEnd(5, " ");
                timeStr += temp;
                temp = ["|"].join("").padEnd(5, " ");
                idStr += temp;
            }
            continue;
        }

        for (x = 0; P[n].burT != 0 && x < quant; x++, time++) {
            P[n].burT--;
            for (y = 0; y < LIM; y++) {
                if (y != n && P[y].arrT <= time && P[y].burT > 0) {
                    P[y].waiT++;
                }
            }
            
            if (P[n].burT == 0) {
                P[n].comT = time + 1;
                log[n] = true;
            }
        }

        temp = time.toString().padEnd(5, " ");
        timeStr += temp;
        temp = P[n].id.padEnd(5, " ");
        idStr += temp;
        
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
    console.log("\n\n\nPreemptive Priority: ");
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
            n = P.findIndex((process) => process.arrT === time);
            // console.log(`Wait: ${n}`);
            if(n >= 0){
                temp = time.toString().padEnd(5, " ");
                timeStr += temp;
                temp = ["|"].join("").padEnd(5, " ");
                idStr += temp;
            }
            continue;
        }
        
        found = false; //reusing
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
    console.log("\n\n\nShortest Remaining Time First: ");
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
            n = P.findIndex((process) => process.arrT === time);
            // console.log(`Wait: ${n}`);
            if(n >= 0){
                temp = time.toString().padEnd(5, " ");
                timeStr += temp;
                temp = ["|"].join("").padEnd(5, " ");
                idStr += temp;
            }
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
