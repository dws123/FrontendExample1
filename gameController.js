/**
 * @author dstallman
 */


function GameController( displayDiv ){
	
	this.rows=3;
	this.cols=3;
	this.grid = new GridModel( this.rows, this.cols );
	this.grid.setup( 3 );
	this.gameView = new GameView( displayDiv );

}

GameController.prototype.makeGuess = function( cellNum ){
	this.grid.makeGuess( cellNum );
	if( this.grid.gameOver() ){
		this.grid.outcome();
	}
};

GameController.prototype.start = function(){
	this.gameView.showGrid( this.grid, false );
};

GameController.prototype.reveal = function( document ){
	this.gameView.toggleChosen( document, this.grid, true );
};

GameController.prototype.hide = function( document ){
	this.gameView.toggleChosen( document, this.grid, false );
};

