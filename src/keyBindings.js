GRA.keyControlDown = function(key) {

	// console.log(key);
	switch (key) {
		case 82:
			// GRA.cellTypeAdd = "root";
			GRA.resetGame();
			break;
		case 39:
			GRA.moveRight();
			break;
		case 37:
			GRA.moveLeft();
			break;
		case 38:
			GRA.moveUp();
			break;
		case 40:
			GRA.moveDown();
			break;
		case 189:
		case 173:
			GRA.zoomOut();
			break;
		case 187:
		case 61:
			GRA.zoomIn();
			break;
	}
};