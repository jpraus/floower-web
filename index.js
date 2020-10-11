
/* Connect to device */

document.getElementById('connect').addEventListener('click', async () => {
	await Floower.connect();

	document.body.classList.add('connected');
	document.body.style.setProperty('--color', Floower.color);
	document.body.style.setProperty('--petal', Floower.petals);

	if (Floower.petals) {
		document.body.classList.add('open');
	}

	document.getElementById('threshold').value = Floower.threshold;

	let container = document.getElementById('colorView');
	let swatches;

	Floower.colorScheme.forEach((color, i) => {
		if (i % 4 == 0) {
			swatches = document.createElement('div');
			swatches.className = 'swatches';
			container.appendChild(swatches);
		}

		let button = document.createElement('button');
		button.className = 'color';
		button.style.backgroundColor = color;
		button.dataset.value = color;
		button.dataset.swatch = i;
		swatches.appendChild(button);
	});
	
	Floower.addEventListener('disconnected', () => {
		document.body.classList.remove('connected');
		document.body.style.setProperty('--petal', 0);
		document.body.style.setProperty('--color', '#000000');

		document.getElementById('colorView').innerHTML = '';
	});
});

document.getElementById('disconnect').addEventListener('click', async () => {
	Floower.disconnect();
});


/* Open / close */

document.getElementById('open').addEventListener('click', () => {
	Floower.petals = 100;
	document.body.style.setProperty('--petal', 100);
	document.body.classList.add('open');
});	
	
document.getElementById('close').addEventListener('click', () => {
	Floower.petals = 0;
	document.body.style.setProperty('--petal', 0);
	document.body.classList.remove('open');
});	

document.getElementById('off').addEventListener('click', () => {
	Floower.off();

	document.body.style.setProperty('--color', "#000000");
	document.body.style.setProperty('--petal', 0);
	document.body.classList.remove('open');
});	



/* Pills */

document.getElementById('color').addEventListener('click', (e) => {
	document.body.classList.remove('color', 'customize');
	document.body.classList.add('color');
});

document.getElementById('customize').addEventListener('click', (e) => {
	document.body.classList.remove('color', 'customize');
	document.body.classList.add('customize');
});



/* Threshold */

document.getElementById('threshold').addEventListener('change', event => {
	console.log(event);
	Floower.threshold = event.target.value;
});



/* Color picker */

let picker = null;

function createPicker(event) {
	if (picker) {
		picker.remove();
	}

	picker = document.createElement('input');
	picker.type = 'color';
	picker.value = event.target.dataset.value;
	picker.style.position = 'absolute';
	picker.style.left = event.pageX + 'px';
	picker.style.top = event.pageY + 'px';
	picker.style.opacity = 0;
	
	picker.oninput = (e) => { 
		event.target.style.backgroundColor = picker.value;
		event.target.dataset.value = picker.value;
	}

	picker.onchange = (e) => {
		Floower.colorScheme[event.target.dataset.swatch] = picker.value;
	}

	document.body.appendChild(picker);
	setTimeout(() => { picker.click(); picker.style.pointerEvents = 'none'; }, 100);
	event.preventDefault();
}

var controls = document.getElementById('colorView');
controls.addEventListener('mousedown', handleMouseEvent);
controls.addEventListener('touchstart', handleMouseEvent);



/* Color swatches */

function handleMouseEvent(event) {
    if (event.target.tagName != 'BUTTON') {
        return;
	}
	
	if (event.altKey || event.ctrlKey) {
		return createPicker(event);
	}
    
	var c = event.target.dataset.value;
	Floower.color = c;
	document.body.style.setProperty('--color', c);

    event.preventDefault();
}



