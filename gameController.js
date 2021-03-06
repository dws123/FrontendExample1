/**
 * @author dstallman
 */

function GameController() {

	this.rows = 3;
	this.cols = 3;
	this.gameChosenCells = 3;

	this.levelSetupTime = 9;
	this.timeToGuess = 8;
	this.secondsRemaining = 8;
	this.levelsWon = 0;
	this.firstTime = true;

	this.grid = {};
	//instance of GridModel, set in runNextLevel()

	this.intervalTimer = {};
	this.gridClickHandler = {};
	this.levelOver = false;
	

	this.gridDiv = document.getElementById('grid');
	this.statusDiv = document.getElementById('status');
	this.clockDiv = document.getElementById('clock');
	this.gameView = new GameView( this.gridDiv );
	this.levelCountDiv = document.getElementById('levelCount');

}

GameController.prototype.makeGuess = function(cellElement) {

	if (!this.levelOver && cellElement.cellIndex >= 0) {

		var cellNum = (cellElement.parentNode.rowIndex * this.rows ) + cellElement.cellIndex + 1;
		console.log('guess : ' + cellNum);

		if (this.grid.makeGuess(cellNum)) {
			cellElement.setAttribute("class", "guessedCorrect");
			this.playSound("sounds/Blop-Mark_DiAngelo-79054334.mp3");
		} else {
			cellElement.setAttribute("class", "guessedWrong");
			this.playSound("sounds/wrongGuess.mp3");
		}

		if (this.grid.gameOver()) {
			this.onLevelResult();
		}
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
	this.levelOver = true;

	var levelOutcome = "";
	var game = this;

	if (this.grid.guessesCorrect()) {
		levelOutcome += " YOU WON! :-D";
		this.levelsWon++;
				
		if (this.levelsWon % 2 === 0)
			game.playSound("sounds/Applause-SoundBible.com-151138312.mp3");
		else
			game.playSound("sounds/SMALL_CROWD_APPLAUSE-Yannick_Lemieux-1268806408.mp3");

		setTimeout(function() {
			game.runNextLevel();
		}, 2000);
	} else {

		levelOutcome += " YOU LOST! :-(";
		if (game.secondsRemaining === 0) {
			//ran out of time
			game.playSound("sounds/TimeBombShort-SoundBible.com-1562499525.mp3");
		} else {
			//guessed wrong
			//play sound after a delay
			setTimeout(function() {
				var rnd = Math.floor((Math.random() * 2) + 1);
				if (rnd == 2)
					game.playSound("sounds/Maniacal_Witches_Laugh-SoundBible.com-262127569.mp3");
				else
					game.playSound("sounds/Sad_Trombone-Joe_Lamb-665429450.mp3");
			}, 1000);
		}
	}
	
	
	this.levelCountDiv.innerHTML = "Levels Won: " + this.levelsWon;
	this.levelCountDiv.style.visibility = "visible";

	this.statusDiv.innerHTML = levelOutcome;
};

GameController.prototype.randomChance = function(percentOfTheTime) {
	//will return true x percentOfTheTime
	var chance = Math.floor((Math.random() * 100) + 1);
	if (chance <= percentOfTheTime)
		return true;
	else
		return false;
};

GameController.prototype.runNextLevel = function() {

	//reset view
	this.gridDiv.setAttribute("class", "norotate");
	this.statusDiv.style.visibility = "hidden";
	this.clockDiv.style.visibility = "hidden";
	this.levelCountDiv.style.visibility = "hidden";

	if ( !this.firstTime ) { //after the first time, randomly increase difficulty
		if (this.randomChance(30)) this.rows++;
		if (this.randomChance(30)) this.cols++;
		if (this.randomChance(20)) this.levelSetupTime--;
		if (this.randomChance(30)) this.timeToGuess--;
		if (this.randomChance(30)) this.gameChosenCells++;
	}
	else {
		this.firstTime = false;
	}

	this.grid = new GridModel(this.rows, this.cols);
	this.grid.setup(this.gameChosenCells);
	this.gameView.showGrid(this.grid, false);
	
	this.secondsRemaining = this.timeToGuess;
	this.startLevel(this);
};

GameController.prototype.startLevel = function(game) {

	//add click handler to grid
	this.gridClickHandler = function(e) {
		var cellElement = e.target || window.event.srcElement;
		game.makeGuess(cellElement);
	};

	var tbl = document.getElementById("grid").getElementsByTagName("table")[0];
	if (tbl.addEventListener) {
		tbl.addEventListener("click", this.gridClickHandler, false);
	} else if (tbl.attachEvent) {
		tbl.attachEvent("onclick", this.gridClickHandler);
	}

	//start timers to control game flow
	var totalSetupTime = game.levelSetupTime * 1000;

	var delayToShowChosen = totalSetupTime * 0.3;
	var delayToHideChosen = delayToShowChosen + (totalSetupTime * 0.3);
	var delayToRotate = delayToHideChosen + (totalSetupTime * 0.2);
	var delayToStartTimer = delayToRotate + (totalSetupTime * 0.2);

	setTimeout(function() {
		game.toggleChosen(true);
	}, delayToShowChosen);

	setTimeout(function() {
		game.toggleChosen(false);
	}, delayToHideChosen);

	setTimeout(function() {
		document.getElementById("grid").className = "rotated";
	}, delayToRotate);

	setTimeout(function() {
		game.startGameClock(game, game.timeToGuess);
	}, delayToStartTimer);

};

GameController.prototype.startGameClock = function(game) {

	game.levelOver = false;

	game.statusDiv.innerHTML = "Now, click on the chosen cells. GO!";
	game.statusDiv.style.visibility = "visible";

	game.intervalVar = setInterval(function() {

		game.playSound("sounds/tick.mp3");
		game.clockDiv.innerHTML = game.secondsRemaining + " seconds left";
		game.clockDiv.style.visibility = "visible";

		if (game.secondsRemaining === 0) {
			clearInterval(game.intervalVar);
			game.onLevelResult();
			return;
		}
		if (game.secondsRemaining <= 2) {
			game.clockDiv.style.backgroundColor = "red";
		} else if (game.secondsRemaining <= 4) {
			game.clockDiv.style.backgroundColor = "orangered";
		} else {
			game.clockDiv.style.backgroundColor = "green";
		}
		game.secondsRemaining--;
	}, 1000);
};

GameController.prototype.playSound = function(soundFile) {
	var snd = new Audio(soundFile);
	// buffers automatically when created
	snd.play();
};
