console.log("Faye loaded!");

const flowerURL = chrome.runtime.getURL("flower.png");

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
    console.log("Marked keys:", [...markedKeys].sort((a,b) => a-b));

function addFlower(cell) {
    if (cell.querySelector(".period-flower"))
        return;
    const img = document.createElement("img");
    img.src = flowerURL;
    img.className = "period-flower";
    img.style.height = "25px";
    img.style.width = "25px";
    img.style.top = "5px";
    img.style.right = "5px";
    img.style.position = "absolute";
    cell.style.position = "relative";
    cell.appendChild(img);
    console.log("Adding flower to:", cell);
}

function findCells() {
  const cells = document.querySelectorAll("div[data-datekey][data-dragsource-type]");

  cells.forEach(cell => {
    const key = parseInt(cell.getAttribute("data-datekey"));
    console.log("Cell key:", key);

    if (markedKeys.has(key)) {
      addFlower(cell)
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