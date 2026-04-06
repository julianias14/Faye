console.log("Faye loaded!");

const flowerURL = chrome.runtime.getURL("flower.png");
const predictedFlowerURL = chrome.runtime.getURL("yellow_flower.png");

function dateToKey(dateStr) {
  const date = new Date(dateStr);
  const epoch = new Date("2000-01-01");
  const diffDays = Math.round((date - epoch) / (1000 * 60 * 60 * 24));
  return 19215+diffDays;
}

fetch(chrome.runtime.getURL("measurements.json"))
  .then(response => response.json())
  .then(data => {
    const markedKeys = new Set();
    data.forEach(entry => {
      if (entry.type === "period" || entry.type === "spotting") {
        const key = dateToKey(entry.date);
        markedKeys.add(key);
      }
    });
    //console.log("Marked keys:", [...markedKeys].sort((a,b) => a-b));
    
    const startKeys = [...markedKeys].filter(key => !markedKeys.has(key - 1));
    //console.log("Period starts:", startKeys.sort((a,b) => a-b));

    const gaps = [];
    for (let i = 1; i < startKeys.length; i++) {
      gaps.push(startKeys[i] - startKeys[i - 1]);
    }
    const cleanGaps = gaps.filter(g => g >= 20 && g <= 45);
    const avgCycle = Math.round(cleanGaps.reduce((sum, g) => sum + g, 0) / cleanGaps.length);
    //console.log("Average cycle length:", avgCycle, "days");
    //console.log("Cycle gaps:", cleanGaps);

    const sortedStartKeys = startKeys.sort((a,b) => a-b);
    const lastStart = sortedStartKeys[sortedStartKeys.length - 1];
    //console.log("Last start key:", lastStart);
    //console.log("First prediction:", lastStart + avgCycle);

    const periodLengths = [];

    let count = 1;
    for (let i = 1; i < [...markedKeys].sort((a,b) => a-b).length; i++) {
        const sorted = [...markedKeys].sort((a,b) => a-b);
        if (sorted[i] === sorted[i-1] + 1) {
            count++;
        } else {
            periodLengths.push(count);
            count = 1;
        }
    }
    periodLengths.push(count);
    const avgPeriodLength = Math.round(periodLengths.reduce((sum, l) => sum + l, 0) / periodLengths.length);
    console.log("Average period length:", avgPeriodLength, "days");
    //console.log("Starting period length calculation...");

    const predictions = [];

    for (let i = 1; i <= 6; i++) {
      predictions.push(lastStart + avgCycle * i);
    }
    const predictionKeys = new Set();
    predictions.forEach(startKey => {
    for (let i = 0; i < avgPeriodLength; i++) {
      //console.log("adding period length:", avgPeriodLength);
      predictionKeys.add(startKey + i);
    }
  });
    //console.log("Prediction keys:", [...predictionKeys].sort((a,b) => a-b));

    //console.log("Predicted keys:", predictions);

function addFlower(cell, imageURL) {
    if (cell.querySelector(".period-flower"))
        return;
    const img = document.createElement("img");
    img.src = imageURL;
    img.className = "period-flower";
    img.style.height = "25px";
    img.style.width = "25px";
    img.style.top = "5px";
    img.style.right = "5px";
    img.style.position = "absolute";
    cell.style.position = "relative";
    cell.appendChild(img);
    //console.log("Adding flower to:", cell);
}

function findCells() {
  const cells = document.querySelectorAll("div[data-datekey][data-dragsource-type]");

  cells.forEach(cell => {
    const key = parseInt(cell.getAttribute("data-datekey"));
    //console.log("Cell key:", key);

    if (markedKeys.has(key)) {
      addFlower(cell, flowerURL)
    } else if (predictionKeys.has(key)) {
      addFlower(cell, predictedFlowerURL)
    }
  });
}

const observer = new MutationObserver(() => {
    findCells();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

findCells();
});