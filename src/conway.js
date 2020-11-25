let container = document.getElementById("content");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let width = 20;
let height = 20;

let delay = 100;

let xCount = Math.floor(windowWidth / width);
let yCount = Math.floor(windowHeight / height);

let cells = [];

let interval = false;

init();


function init() {
	console.log("init. lol");
	for (let y = 0; y < yCount; y++) {
		for (let x = 0; x < xCount; x++) {
			let newCell = new Cell(x, y);
			cells.push(newCell);
		}
	}

	document.addEventListener("keypress", handleKey);

	container.addEventListener("click", function (event) {
//		console.log("event", event);
		let id = event.target.id.split("-");
		if (id.length == 2) {
//			console.log("id", id[0], id[1]);
			let target = cells[parseInt(id[0]) + parseInt(id[1]) * xCount];
//			console.log("target:", target);
			target.state = !target.state;
			render(target);
		}
		return;
	});

	start();
}

function handleKey(event) {
	switch (event.key) {
		case " ":
			toggleRun();
			break;
		case "c":
			clear();
			break;
		case "r":
			randomize();
			break;
		case "+":
			changeSpeed("+");
			break;
		case "-":
			changeSpeed("-");
			break;
		case "#":
			changeSpeed("#");
			break;
		default:
			console.info("unknown key", event.key);
	}
}

function start() {
	if (interval) {
		return;
	}
	interval = window.setInterval(cycle, delay);
}

function stop() {
	if (!interval) {
		return;
	}
	window.clearInterval(interval);
	interval = false;
}

function toggleRun() {
	if (interval) {
		stop();
	} else {
		start();
	}
}

function changeSpeed(key) {
	stop();
	if (key == "+") {
		delay -= 10;
		if (delay < 40) {
			delay = 40;
		}
	} else if (key == "-") {
		delay += 10;
	} else if (key == "#") {
		delay = 100;
	}
	start();
}



function clear() {
	stop();

	cells.forEach(function (cell) {
		cell.state = false;
		cell.age = 0;
		render(cell);
	});
}

function randomize() {
	cells.forEach(function (cell) {
		cell.state = Math.random() > 0.5;
		cell.age = 0;
		render(cell);
	});
}



function cycle() {
	cells.forEach(getNextState);
	cells.forEach(updateState);
	cells.forEach(render);
}



function Cell(x, y) {
	this.x = x;
	this.y = y;
	
	this.age = 0;

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
		this.age = 1;
//		element.classList.add("alive");
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

			if (x < 0) x += xCount;
			if (y < 0) y += yCount;
			
			x %= xCount;
			y %= yCount;

			if (xOffset != 0 || yOffset != 0) {
				if (cells[x + y * xCount].state) {
					neighbors++;
				}
			}
		});
	});

	cell.nextState = applyRules(cell.state, neighbors);
	cell.age = cell.nextState ? cell.age + 1 : 0;
}

function updateState(cell) {
	cell.state = cell.nextState;
}

function render(cell) {
	if (cell.state) {
		cell.element.style.backgroundColor = "hsl(" + getColorFromAge(cell.age) + ", 100%, 50%)";
//		cell.element.classList.add("alive");
	} else {
		cell.element.style.backgroundColor = "hsl(0, 0%, 0%)";
//		cell.element.classList.remove("alive");
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

function getColorFromAge(age) {
	let result = 0;
	result = 5 * age;
	return result;
}


