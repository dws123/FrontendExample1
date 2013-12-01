/**
 * @author dstallman
 */


function GridModel( rows, columns ){
	
	this.rows = rows;
	this.cols = columns;
	this.gameChosenCells = {};
	this.gameChosenCellCount = 0;
	this.humanCorrectCount = 0;
	this.humanIncorrectCount = 0;
		
	this.setup = function( numToChose ){
		do {
			var cell = Math.floor((Math.random() * this.rows * this.cols) +1); 
			if( !(cell in this.gameChosenCells) ){ //make sure not already chosen
				this.gameChosenCells[cell]=true;
				this.gameChosenCellCount++;
			}
		} while( this.gameChosenCellCount < numToChose );
	};
	
	this.makeGuess = function( cellNum ){
		if( cellNum in this.gameChosenCells )
			this.humanCorrectCount++;	
		else
			this.humanIncorrectCount++;
	};
	
	this.gameOver = function(){
		return this.gameChosenCellCount === ( this.humanCorrectCount + this.humanIncorrectCount ) ;

	};
	
	this.outcome = function(){
		if ( this.humanCorrectCount === this.gameChosenCellCount )
			alert( "YOU WON");
		else 
			alert( "YOU LOST");
	};
	
}
