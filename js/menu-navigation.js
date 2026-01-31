// ==========================================
// MENU NAVIGATION SCRIPT
// Maneja el desplazamiento del menú horizontal
// ==========================================

const menuContainer = document.getElementById('menuContainer');
const scrollLeft = document.getElementById('scrollLeft');
const scrollRight = document.getElementById('scrollRight');

const menuItems = menuContainer.querySelectorAll('.nav-item');
const itemWidth = 100; // Ancho de cada item
const visibleItems = 2; // Cantidad de items visibles
let currentIndex = 0;

// Variables para el arrastre mejorado
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let velocity = 0;
let lastMoveTime = Date.now();
let lastMovePos = 0;

function updateMenuPosition(animate = true) {
	const offset = -currentIndex * itemWidth;
	if (animate) {
		menuContainer.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
	} else {
		menuContainer.style.transition = 'none';
	}
	menuContainer.style.transform = `translateX(${offset}px)`;
	prevTranslate = offset;
	currentTranslate = offset;
}

function touchStart(event) {
	isDragging = true;
	startPos = getPositionX(event);
	lastMovePos = startPos;
	lastMoveTime = Date.now();
	velocity = 0;
	menuContainer.style.transition = 'none';
	menuContainer.style.cursor = 'grabbing';
}

function touchMove(event) {
	if (isDragging) {
		event.preventDefault();
		const currentPosition = getPositionX(event);
		const currentTime = Date.now();

		// Calcular velocidad
		const timeDelta = currentTime - lastMoveTime;
		if (timeDelta > 0) {
			velocity = (currentPosition - lastMovePos) / timeDelta;
		}

		lastMovePos = currentPosition;
		lastMoveTime = currentTime;

		currentTranslate = prevTranslate + currentPosition - startPos;

		// Aplicar resistencia en los bordes
		const maxTranslate = 0;
		const minTranslate = -(menuItems.length - visibleItems) * itemWidth;

		if (currentTranslate > maxTranslate) {
			currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.3;
		} else if (currentTranslate < minTranslate) {
			currentTranslate = minTranslate + (currentTranslate - minTranslate) * 0.3;
		}

		menuContainer.style.transform = `translateX(${currentTranslate}px)`;
	}
}

function touchEnd() {
	if (!isDragging) return;

	isDragging = false;
	menuContainer.style.cursor = 'grab';

	const movedBy = currentTranslate - prevTranslate;

	// Calcular desplazamiento basado en velocidad (inercia)
	const inertiaDistance = velocity * 200;
	const totalMove = movedBy + inertiaDistance;

	// Calcular nuevo índice basado en el movimiento total
	const indexChange = Math.round(totalMove / itemWidth);

	currentIndex = Math.max(0, Math.min(menuItems.length - visibleItems, currentIndex - indexChange));

	menuContainer.style.transition = 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
	updateMenuPosition(true);
}

function getPositionX(event) {
	return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

// Event listeners para mouse
menuContainer.addEventListener('mousedown', touchStart);
menuContainer.addEventListener('mousemove', touchMove);
menuContainer.addEventListener('mouseup', touchEnd);
menuContainer.addEventListener('mouseleave', touchEnd);

// Event listeners para touch (móvil)
menuContainer.addEventListener('touchstart', touchStart, { passive: false });
menuContainer.addEventListener('touchmove', touchMove, { passive: false });
menuContainer.addEventListener('touchend', touchEnd);

// Prevenir comportamiento por defecto en los enlaces durante el arrastre
menuContainer.addEventListener('click', function (e) {
	if (Math.abs(currentTranslate - prevTranslate) > 5) {
		e.preventDefault();
	}
});

// Estilo del cursor
menuContainer.style.cursor = 'grab';

// Botones de navegación mejorados
scrollRight.addEventListener('click', function () {
	currentIndex = Math.min(currentIndex + 1, menuItems.length - visibleItems);
	updateMenuPosition(true);
});

scrollLeft.addEventListener('click', function () {
	currentIndex = Math.max(currentIndex - 1, 0);
	updateMenuPosition(true);
});
