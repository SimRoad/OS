/* 
----------------------------------
This runs by using the terminal
Go in the directory you saved this in and run:
node PageReplaceInterface.js
----------------------------------
*/

const readline = require("readline/promises");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let PAGES = []; // Array to store PAGES
let FRAMES;

// Function to initialize the array
async function initializeArray() {
  let input = await rl.question(
    "Enter initial pages (comma or space-separated): ");
    PAGES = input
        .split(/[\s,]+/) // Split by spaces or commas
        .map((num) => parseInt(num.trim(), 10))
        .filter((num) => !isNaN(num)); // Filter out invalid inputs

      console.log("Initialized array:", PAGES);

      let num = await rl.question(
        "How many frames?: "
      );
      FRAMES = parseInt(num);
            displayMenu(); // Proceed to menu
}

// Function to display menu options
async function displayMenu() {
    console.log("\n--- Menu ---");
    console.log("[1] Add a page");
    console.log("[2] Delete a page (only the first instance)");
    console.log("[3] Change Frames"); // New option
    console.log("[4] First in First Out");
    console.log("[5] Least Recently Used");
    console.log("[6] Optimal");
    console.log("[7] All Algorithms");
    console.log("[0] Exit");
    await handleMenuChoice(await rl.question("Choose an option: "));
}

// Handle user input for menu choice
async function handleMenuChoice(choice) {
  switch (choice.trim()) {
    case "1":
      await addNumber();
      break;
    case "2":
      await deleteNumber(); 
      break;
    case "3":
        await changeFrames(); 
        break;
    case "4":
        FIFO(PAGES); 
        break;
    case "5":
        LRU(PAGES); 
        break;
    case "6":
        Optimal(PAGES); 
        break;
    case "7":
        FIFO(PAGES); 
        LRU(PAGES); 
        Optimal(PAGES); 
        break; 
      break;
    case "0":
      console.log("Exiting...");
      rl.close(); // Close the readline interface
      break;
    default:
      console.log("Invalid option. Try again.");
    }
    displayMenu()
}

async function addNumber() {
  let input = await rl.question("Enter a number to add: ");
  const num = parseInt(input, 10);
  if (!isNaN(num)) {
    PAGES.push(num);
    console.log(`Added ${num} to the array.`);
  } else {
    console.log("Invalid number. Try again.");
  }
}

async function deleteNumber() {
  let input = await rl.question("Enter a number to delete: ");
  const num = parseInt(input, 10);
  if (!isNaN(num)) {
    const index = PAGES.indexOf(num);
    if (index !== -1) {
      PAGES.splice(index, 1); // Remove the number
      console.log(`Deleted ${num} from the array.`);
    } else {
      console.log(`${num} is not in the array.`);
    }
  } else {
    console.log("Invalid number. Try again.");
  }
}

async function changeFrames() {
    let input = await rl.question("Enter a new # of frames: ");
    const num = parseInt(input, 10);
    if (!isNaN(num)) {
      FRAMES = num;
    } else {
      console.log("Invalid number. Try again.");
    }
  }

function showArray() {
  console.log("Current Array:", PAGES.length > 0 ? PAGES : "Empty");
  console.log("Frames: " + FRAMES);
}

initializeArray();

function displayPAGES(P, F){
    const LIM = P.length;
    const pFrames = F.length;

    let x, y;
    let char = 97, tStr = "";
    let table = Array(pFrames).fill(null).map(() => ({}));
    let temp = {};
    for(x=0;x<pFrames;x++){
        table[x].PAGES = `F${x+1}`;
    }
    table[pFrames-1].PAGES = " ";
    
    console.log("*Disclaimer: Due to limited displaying options, there will be a letter next to the pages\n The letters doesn't mean anything nor the index");
    for(x=0;x<LIM;x++){
        tStr = String.fromCharCode(char++);
        for(y=0;y<pFrames;y++){
            table[y][`${P[x]} ${tStr}`] = F[y][x];
        }
    }
    console.table(table);
}

function FIFO(P){
    console.log("\nFirst in, First out------------------------------");
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
    displayPAGES(P, log);
    
    faults = LIM - hits;
    console.log("Page hits: " + hits);
    console.log("Page faults: " + faults);
    
    console.log("Hit Ratio = " + `(${hits} / ${LIM}) * 100 = ` + hits/LIM*100 + '%');
    console.log("Hit Fault = " + `(${faults} / ${LIM}) * 100 = ` + faults/LIM*100 + '%');

    //console.log(log)
}

function LRU(P){
    console.log("\nLeast Recently Used------------------------------");
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
    displayPAGES(P, log);
}

function Optimal(P){
    console.log("\nOptimal------------------------------------------");
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
        //console.log(log[FRAMES][log[FRAMES].length - 1] + ": "+ nextArr);
        
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
    displayPAGES(P, log);
}

