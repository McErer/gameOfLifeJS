let container = document.getElementById("content");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let width = 20;
let height = 20;

let xCount = Math.floor(windowWidth / width);
let yCount = Math.floor(windowHeight / height);

let cells = [];

let run = true;

init();

if (run) {
	window.setInterval(function () {
		cycle();
	}, 200);
}



function init() {
	for (let y = 0; y < yCount; y++) {
		for (let x = 0; x < xCount; x++) {
			let newCell = new Cell(x, y);
			cells.push(newCell);
		}
	}
}

function cycle() {
	cells.forEach(getNextState);
	cells.forEach(updateState);
	cells.forEach(render);
}

function Cell(x, y) {
	this.x = x;
	this.y = y;

	this.id = this.x + "-" + this.y;

	this.state = Math.random() < 0.3;
	this.nextState = false;

	let element = document.createElement("div");
	element.style.position = "absolute";
	element.style.left = this.x * width;
	element.style.top = this.y * height;
	element.style.width = width;
	element.style.height = height;
	element.id = this.id;

	if (this.state) {
		element.classList.add("alive");
	}

	this.element = element;
	container.appendChild(this.element);
}

function getNextState(cell) {
	let offsets = [-1, 0, 1];
	let neighbors = 0;
	
	offsets.forEach(function (xOffset) {
		offsets.forEach(function (yOffset) {
			let x = cell.x + xOffset;
			let y = cell.y + yOffset;

			if (x >= 0 && x < xCount && y >= 0 && y < yCount && (xOffset != 0 || yOffset != 0)) {
				if (cells[x + y * xCount].state) {
					neighbors++;
				}
			}
		});
	});

	cell.nextState = applyRules(cell.state, neighbors);
}

function updateState(cell) {
	cell.state = cell.nextState;
}

function render(cell) {
	if (cell.state) {
		cell.element.classList.add("alive");
	} else {
		cell.element.classList.remove("alive");
	}
}

function applyRules(current, neighbors) {
	if (current && neighbors == 2) {
		return true;
	} else if (neighbors == 3) {
		return true;
	}
	return false;
}


