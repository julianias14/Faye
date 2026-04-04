console.log("Faye loaded!");

function findCells() {
    const cells = document.querySelectorAll("td[data-date]");

    cells.forEach(cell => {
    const date = cell.getAttribute("data-date");
    
    if (date === "20260404") {
      console.log("Match found! Placing flower on", date);
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