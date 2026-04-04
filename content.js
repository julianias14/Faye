console.log("Faye loaded!");

const flowerURL = chrome.runtime.getURL("flower.png");

function findCells() {
  const cells = document.querySelectorAll("div[data-datekey]");

  cells.forEach(cell => {
    const key = cell.getAttribute("data-datekey");

    if (key === "28804" && !cell.querySelector(".period-flower")) {
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