/* 
----------------------------------
This runs by using the terminal
Go in the directory you saved this in and run:
node DiskScheduler.js
----------------------------------
*/

const readline = require("readline");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let arrPOSITIONS = []; // Array to store track positions
let PREV;
let TRACK;
let SEEK_RATE;
let ALPHA;


// Function to initialize the array
console.log("The previous node is not included")
function initializeArray() {
  rl.question(
    "Enter initial positions (comma or space-separated): ",
    (input) => {
      arrPOSITIONS = input
        .split(/[\s,]+/) // Split by spaces or commas
        .map((num) => parseInt(num.trim(), 10))
        .filter((num) => !isNaN(num)); // Filter out invalid inputs

      console.log("Initialized array:", arrPOSITIONS);

      rl.question("Previous node: ", (num) => {
            PREV = parseInt(num);
            rl.question("Track size: ", (n1) => {
                    TRACK = parseInt(n1);
                    rl.question("Seek rate: ", (n2)=>{
                        SEEK_RATE = parseInt(n2);
                        rl.question("Alpha: ", (n3)=> {
                            ALPHA = parseInt(n3);
                            displayMenu(); 
                        });
                    });
                });
        }
      );
    }
  );
}

// Function to display menu options
function displayMenu() {
    console.log("\n--- Edit ---");
    console.log("[1] Add a position");
    console.log("[2] Delete a position (only the first instance)");
    console.log("[3] Change previous node"); // New option
    console.log("[4] Change Track size");
    console.log("[5] Change seek rate");
    console.log("[6] Change alpha");

    console.log("\n\n--- Algorithms ---");
    console.log("[7] First Come First Serve");
    console.log("[8] C-Scan");
    console.log("[9] C-Look");
    console.log("[10] All");

    console.log("\n\n--- Exit ---");
    console.log("[0] Exit");
    rl.question("Choose an option: ", handleMenuChoice);
}

// Handle user input for menu choice
function handleMenuChoice(choice) {
    switch (choice.trim()) {
        case "1":
            addNumber(); 
        break;
        case "2":
            deleteNumber(); 
        break;
        case "3":
            changePrevNode(); 
            break;
        case "4":
            changeTrackSize();
            break;
        case "5":
            changeSeekRate();
            break;
        case "6":
            changeAlpha();
            break;
        case "7":
            FCFS(arrPOSITIONS); 
            break;
        case "8":
            cScan(arrPOSITIONS); 
            break;
        case "9":
            cLook(arrPOSITIONS); 
            break;
        case "10":
            FCFS(arrPOSITIONS); 
            cScan(arrPOSITIONS); 
            cLook(arrPOSITIONS); 
            break; 
        case "0":
            console.log("Exiting...");
            rl.close(); // Close the readline interface
            break;
        default:
            console.log("Invalid option. Try again.");
    }
    
    if(choice != "0"){
      setTimeout(() => {
            console.log("\n\n\n\n\n\n");
            showArray();
            displayMenu();
        }, 5000);
    }
}

function addNumber() {
  rl.question("Enter a number to add: ", (input) => {
    const num = parseInt(input, 10);
    if (!isNaN(num)) {
      arrPOSITIONS.push(num);
      console.log(`Added ${num} to the array.`);
    } else {
      console.log("Invalid number. Try again.");
    }
  });
}

function deleteNumber() {
  rl.question("Enter a number to delete: ", (input) => {
    const num = parseInt(input, 10);
    if (!isNaN(num)) {
      const index = arrPOSITIONS.indexOf(num);
      if (index !== -1) {
        arrPOSITIONS.splice(index, 1); // Remove the number
        console.log(`Deleted ${num} from the array.`);
      } else {
        console.log(`${num} is not in the array.`);
      }
    } else {
      console.log("Invalid number. Try again.");
    }
  });
}

function changePrevNode() {
    rl.question("Enter a new previous node: ", (input) => {
      const num = parseInt(input, 10);
      if (!isNaN(num)) {
        PREV = num;
      } else {
        console.log("Invalid number. Try again.");
      }
    });
}

function changeTrackSize() {
    rl.question("Enter a new track size: ", (input) => {
      const num = parseInt(input, 10);
      if (!isNaN(num)) {
        TRACK = num;
      } else {
        console.log("Invalid number. Try again.");
      }
    });
}

function changeSeekRate() {
    rl.question("Enter a new seek rate: ", (input) => {
      const num = parseInt(input, 10);
      if (!isNaN(num)) {
        SEEK_RATE = num;
      } else {
        console.log("Invalid number. Try again.");
      }
    });
}

function changeAlpha() {
    rl.question("Enter new alpha: ", (input) => {
      const num = parseInt(input, 10);
      if (!isNaN(num)) {
        ALPHA = num;
      } else {
        console.log("Invalid number. Try again.");
      }
    });
}

function showArray() {
    console.log(arrPOSITIONS);
    console.log(`Track size: ${TRACK} \tPrevious Node: ${PREV} \t Current Node: ${arrPOSITIONS[0]}`);
    console.log(`Seek rate: ${SEEK_RATE} \tAlpha: ${ALPHA}`);
}

initializeArray();

let headMovement = (a, b) => a > b ? a - b : b - a;

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
            a = P[x-1]; 
            b = P[x]; 
            if(P[x] < P[x - 1]){
                a = P[x];
                b = P[x-1];
            }

            let pos = `${a}`;
            pos = pos.padStart(a+2, " ");
            pos = pos.padEnd(b, (P[x] < P[x - 1]) ? '<' : '>')
            pos += `${b}`

            // console.log(pos);
        }
    }
    THM += ALPHA;

    console.log("Total Head Movement: " + THM);
    console.log("Seek Time: " + THM * SEEK_RATE);
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
    THM += ALPHA;

    console.log("Total Head Movement: " + THM);
    console.log("Seek Time: " + THM * SEEK_RATE);
    console.log("\n\n");
}