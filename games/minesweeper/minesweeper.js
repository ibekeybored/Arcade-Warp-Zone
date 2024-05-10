let gameBoard = [];
let gridRows = 8;
let gridColumns = 8;
let totalMines = 10;
let minePositions = [];
let tilesRevealed = 0;
let flagModeActive = false;
let gameIsOver = false;

window.onload = function() {
    initializeGame();
    setupButtonListeners();
}

function setupButtonListeners() {
    let refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            console.log('Refresh button clicked');
            window.location.reload();
        });
    } else {
        console.error('Refresh button not found');
    }

    let flagButton = document.getElementById('flag-button');
    if (flagButton) {
        flagButton.addEventListener("click", toggleFlag);
    } else {
        console.error('Flag button not found');
    }
}

function placeMines() {
    let minesToPlace = totalMines;
    while (minesToPlace > 0) {
        let row = Math.floor(Math.random() * gridRows);
        let col = Math.floor(Math.random() * gridColumns);
        let id = row.toString() + "-" + col.toString();

        if (!minePositions.includes(id)) {
            minePositions.push(id);
            minesToPlace -= 1;
        }
    }
}

function initializeGame() {
    document.getElementById("mines-count").innerText = totalMines;
    document.getElementById("flag-button").addEventListener("click", toggleFlag);
    placeMines();

    document.getElementById('mine-image').src = 'https://ih0.redbubble.net/image.395419500.9164/raf,360x360,075,t,fafafa:ca443f4786.jpg';

    for (let r = 0; r < gridRows; r++) {
        let row = [];
        for (let c = 0; c < gridColumns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", handleTileClick);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        gameBoard.push(row);
    }

    console.log(gameBoard);
}

function toggleFlag() {
    flagModeActive = !flagModeActive;
    document.getElementById("flag-button").style.backgroundColor = flagModeActive ? "darkgray" : "lightgray";
}

function handleTileClick() {
    if (gameIsOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagModeActive) {
        if (tile.innerText === "") {
            tile.innerText = "🚩";
        } else if (tile.innerText === "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minePositions.includes(tile.id)) {
        gameIsOver = true;
        showAllMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    exposeTile(r, c);
}

function showAllMines() {
    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridColumns; c++) {
            let tile = gameBoard[r][c];
            if (minePositions.includes(tile.id)) {
                tile.innerText = "✹";
                tile.style.backgroundColor = "red";                
            }
        }
    }

    document.getElementById('mine-image').src = 'https://ih0.redbubble.net/image.395422638.9241/raf,360x360,075,t,fafafa:ca443f4786.jpg';
}

function exposeTile(r, c) {
    if (r < 0 || r >= gridRows || c < 0 || c >= gridColumns) {
        return;
    }
    if (gameBoard[r][c].classList.contains("tile-clicked")) {
        return;
    }

    gameBoard[r][c].classList.add("tile-clicked");
    tilesRevealed += 1;

    let minesNearby = 0;

    minesNearby += inspectTile(r-1, c-1);    
    minesNearby += inspectTile(r-1, c); 
    minesNearby += inspectTile(r-1, c+1);

    minesNearby += inspectTile(r, c-1); 
    minesNearby += inspectTile(r, c+1); 

    minesNearby += inspectTile(r+1, c-1); 
    minesNearby += inspectTile(r+1, c); 
    minesNearby += inspectTile(r+1, c+1);

    if (minesNearby > 0) {
        gameBoard[r][c].innerText = minesNearby;
        gameBoard[r][c].classList.add("x" + minesNearby.toString());
    }
    else {
        gameBoard[r][c].innerText = "";

        exposeTile(r-1, c-1);
        exposeTile(r-1, c); 
        exposeTile(r-1, c+1); 

        exposeTile(r, c-1); 
        exposeTile(r, c+1);

        exposeTile(r+1, c-1);
        exposeTile(r+1, c);
        exposeTile(r+1, c+1);
    }

    if (tilesRevealed == gridRows * gridColumns - totalMines) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameIsOver = true;
    }
}

function inspectTile(r, c) {
    if (r < 0 || r >= gridRows || c < 0 || c >= gridColumns) {
        return 0;
    }
    if (minePositions.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
