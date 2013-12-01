/**
 * @author dstallman
 */

function GameController(gridDiv, statusDiv, clockDiv) {

	this.rows = 2;
	this.cols = 2;
	this.levelSetupTime = 9;
	this.timeToGuess = 8;
	this.grid;

	this.intervalTimer;
	this.gridClickHandler;
	this.levelOver =false;
	
	this.gridDiv = gridDiv;
	this.statusDiv = statusDiv;
	this.clockDiv = clockDiv;
	this.gameView = new GameView( gridDiv );

}

GameController.prototype.makeGuess = function(cellNum) {
	this.grid.makeGuess(cellNum);
	if (this.grid.gameOver()) {
		this.onLevelResult();
	}
};

GameController.prototype.start = function() {
	this.runNextLevel();
};

GameController.prototype.toggleChosen = function(show) {
	this.gameView.toggleChosen(this.grid, show);
};

GameController.prototype.onLevelResult = function() {
	clearInterval(this.intervalVar);
	this.levelOver=true;

	var levelOutcome = "";
	var game = this;

	if (this.grid.guessesCorrect()){
		levelOutcome += " YOU WON! :-D";
		setTimeout(function() {
			game.runNextLevel();
		}, 2000 );
	}
	else
		levelOutcome += " YOU LOST! :-(";

	this.statusDiv.innerHTML = levelOutcome;
};

GameController.prototype.runNextLevel = function() {
	
	this.gridDiv.setAttribute("class", "norotate");
	this.statusDiv.style.visibility = "hidden";
	this.clockDiv.style.visibility = "hidden";	
	this.rows += 1;
	this.cols += 1;
	this.grid = new GridModel(this.rows, this.cols);
	this.grid.setup(3);
	
	this.levelSetupTime--;
	this.timeToGuess--;
	
	this.gameView.showGrid(this.grid, false);
	this.startLevel(this);
};

GameController.prototype.startLevel = function(game) {

	var totalSetupTime = game.levelSetupTime * 1000;
	
	var delayToShowChosen = totalSetupTime * 0.3;
	var delayToHideChosen = delayToShowChosen + (totalSetupTime * 0.3);
	var delayToRotate = delayToHideChosen + (totalSetupTime * 0.2);
	var delayToStartTimer = delayToRotate + (totalSetupTime * 0.2);
	
	setTimeout(function() {
		game.toggleChosen(true);
	}, delayToShowChosen );

	setTimeout(function() {
		game.toggleChosen(false);
	}, delayToHideChosen );

	setTimeout(function() {
		document.getElementById("grid").className = "rotated";
	}, delayToRotate );

	setTimeout(function() {
		game.startGameTimer(game, game.timeToGuess);
	}, delayToStartTimer);
	
};

GameController.prototype.startGameTimer = function(game, seconds) {
	
	game.levelOver=false;

	game.gridClickHandler = function(e) {
		
		var cell = e.target || window.event.srcElement;
		if (!game.levelOver && cell.cellIndex >= 0) {
			cell.setAttribute("class", "selected");
			var xy = (cell.parentNode.rowIndex * game.rows ) + cell.cellIndex + 1;
			console.log('guess : ' + xy );
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
	game.statusDiv.style.visibility = "visible";

	game.intervalVar = setInterval(function() {

		game.clockDiv.innerHTML = seconds + " seconds left";

		game.clockDiv.style.visibility = "visible";

		if (seconds === 0) {
			clearInterval(game.intervalVar);
			game.onLevelResult();
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

