/**
 * @author dstallman
 */

function GameController(displayDiv, statusDiv, clockDiv) {

	this.rows = 3;
	this.cols = 3;
	this.levelSetupTime = 10;
	this.timeToGuess = 7;
	this.grid = new GridModel(this.rows, this.cols);
	this.grid.setup(3);
	this.statusDiv = statusDiv;
	this.clockDiv = clockDiv;
	this.intervalTimer;
	this.gridClickHandler;
	this.gameView = new GameView(displayDiv);

}

GameController.prototype.makeGuess = function(cellNum) {
	this.grid.makeGuess(cellNum);
	if (this.grid.gameOver()) {
		
		clearInterval(this.intervalVar);
		
		var levelOutcome = "Level over.";
		
		if( this.grid.guessesCorrect() )
			levelOutcome += " YOU WON! :-D";
		else
			levelOutcome += " YOU LOST! :-(";
		
		this.statusDiv.innerHTML = levelOutcome;
	}
};

GameController.prototype.start = function() {
	this.gameView.showGrid(this.grid, false);
	this.doLevel(this);
};

GameController.prototype.toggleChosen = function(show) {
	this.gameView.toggleChosen(this.grid, show);
};

GameController.prototype.doLevel = function(game) {
	
	var setupMs = game.levelSetupTime * 1000;

	setTimeout(function() {
		game.toggleChosen(true);
	},  setupMs * 0.3);

	setTimeout(function() {
		game.toggleChosen(false);
	}, setupMs * 0.4);

	setTimeout(function() {
		document.getElementById("grid").className = "rotated";
	}, setupMs * 0.3);

	setTimeout(function() {
		game.startGameTimer(game, game.timeToGuess);
	}, setupMs );
};

GameController.prototype.startGameTimer = function(game, seconds) {

	game.gridClickHandler = function(e) {
		var cell = e.target || window.event.srcElement;
		cell.setAttribute("class", "selected");

		if (cell.cellIndex >= 0) {
			var xy = (cell.parentNode.rowIndex * game.rows ) + cell.cellIndex + 1;
			game.makeGuess(xy);
		}
	};

	var tbl = document.getElementById("grid").getElementsByTagName("table")[0];

	if (tbl.addEventListener) {
		tbl.addEventListener("click", game.gridClickHandler, false);
	} else if (tbl.attachEvent) {
		tbl.attachEvent("onclick", game.gridClickHandler);
	}

	game.statusDiv.innerHTML = "Now, click on the chosen cells. GO!";

	game.intervalVar = setInterval(function() {

		game.clockDiv.innerHTML = seconds + " seconds left";

		game.clockDiv.style.visibility = "visible";

		if (seconds === 0) {
			clearInterval(game.intervalVar);
			game.grid.outcome();
			return;
		}
		if (seconds <= 2) {
			game.clockDiv.style.backgroundColor = "red";
		} else if (seconds <= 4) {
			game.clockDiv.style.backgroundColor = "orangered";
		} else {
			game.clockDiv.style.backgroundColor = "green";
		}
		seconds--;
	}, 1000);
};

