// ==========================================
// MENU NAVIGATION SCRIPT
// Maneja el desplazamiento del menú horizontal
// ==========================================

const menuContainer = document.getElementById('menuContainer');
const scrollLeft = document.getElementById('scrollLeft');
const scrollRight = document.getElementById('scrollRight');

const menuItems = menuContainer.querySelectorAll('.nav-item');
const itemWidth = 100; // Ancho aproximado de cada item
let currentIndex = 0;

// Variables para el arrastre mejorado
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let velocity = 0;
let lastMoveTime = Date.now();
let lastMovePos = 0;

// Función para obtener el máximo desplazamiento permitido
function getMaxScroll() {
	const containerWidth = menuContainer.parentElement.offsetWidth;
	const totalWidth = menuContainer.scrollWidth;
	return Math.max(0, totalWidth - containerWidth);
}

function updateMenuPosition(animate = true) {
	const offset = -currentIndex * itemWidth;
	const maxScroll = getMaxScroll();

	// Limitar el desplazamiento para que no se pase del final
	const limitedOffset = Math.max(-maxScroll, Math.min(0, offset));

	if (animate) {
		menuContainer.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
	} else {
		menuContainer.style.transition = 'none';
	}
	menuContainer.style.transform = `translateX(${limitedOffset}px)`;
	prevTranslate = limitedOffset;
	currentTranslate = limitedOffset;
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
		const maxScroll = getMaxScroll();
		const minTranslate = -maxScroll;

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

	// Calcular el máximo índice permitido
	const maxScroll = getMaxScroll();
	const maxIndex = Math.ceil(maxScroll / itemWidth);

	currentIndex = Math.max(0, Math.min(maxIndex, currentIndex - indexChange));

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
	const maxScroll = getMaxScroll();
	const maxIndex = Math.ceil(maxScroll / itemWidth);
	currentIndex = Math.min(currentIndex + 1, maxIndex);
	updateMenuPosition(true);
});

scrollLeft.addEventListener('click', function () {
	currentIndex = Math.max(currentIndex - 1, 0);
	updateMenuPosition(true);
});
