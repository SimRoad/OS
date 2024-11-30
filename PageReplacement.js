let pages = [7,0,1,2,0,3,0,4,2,3,0,3,1,2,0];
console.log(pages);

console.log("Mont Capoy's Page Replacement Algorithms");
FIFO(JSON.parse(JSON.stringify(pages)));

function FIFO(P){
    console.log("First in, First out: ");
    const LIM = P.length;

    let F = [-1, -1, -1];
    let x, ndx = 0, hits = 0, faults = 0;

    for(x = 0; x < LIM; x++){
        if(F.includes(P[x])){
            hits++;
        } else {
            faults++;
            F[ndx] = P[x];
            ndx = (ndx + 1) % 3;
        }
    }
    console.log(hits + " " + faults);
}