/**
 * @author dstallman
 */

function GameView(element) {

	this.displayElement = element;

}

GameView.prototype.showGrid = function(grid) {

	var table = "<table cellpadding=\"0\" cellspacing=\"0\"><tbody><tr>";

	var numCells = grid.rows * grid.cols;

	var cellNum = 1;

	for (var i = 1; i <= numCells; i++) {
		if (i % grid.rows == 1 && i != 1) {
			table += "</tr><tr>";
		}
		table += "<td id=\"cell" + cellNum + "\">";
		table += "</td>";
		cellNum++;
	}

	table += "</tr></tbody></table>";

	this.displayElement.innerHTML = table;

};

GameView.prototype.toggleChosen = function(grid, revealChosen) {

	for (var i = 0, keys = Object.keys(grid.gameChosenCells), ii = keys.length; i < ii; i++) {
		
		var cellId = "cell" + keys[i];
		if (revealChosen) {
			document.getElementById(cellId).className = "chosen";
			console.log('key : ' + keys[i] + ' val : ' + grid.gameChosenCells[keys[i]]);
		}
		else
			document.getElementById(cellId).className = "default";
	}
}; 