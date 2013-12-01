/**
 * @author dstallman
 */


function GameController( displayDiv ){
	
	this.rows=4;
	this.cols=4;
	this.grid = new GridModel( this.rows, this.cols );
	this.grid.setup( 4 );
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
	this.gameView.reveal( document, this.grid );
};

