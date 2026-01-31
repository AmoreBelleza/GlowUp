// ==========================================
// PRODUCTS MANAGEMENT SCRIPT
// Maneja la carga, visualización y detalle de productos
// ==========================================

// Variable global para almacenar los productos
let products = [];

// Función para cargar productos desde JSON
async function loadProducts() {
	try {
		const response = await fetch('products.json');
		if (!response.ok) {
			throw new Error('Error al cargar productos');
		}
		products = await response.json();
		return Promise.resolve();
	} catch (error) {
		console.error('Error cargando productos:', error);
		document.getElementById('productsContainer').innerHTML = `
			<div class="col-12 no-products">
				<i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
				<p>Error al cargar los productos. Por favor, intenta nuevamente.</p>
			</div>
		`;
		return Promise.reject(error);
	}
}

// Función para obtener el color de fondo según el menú
function getBackgroundColor(menuId) {
	const colors = {
		1: '#ffe5ec',
		2: '#d4ebf2',
		3: '#fff9d4',
		4: '#e8d4f1',
		5: '#fce4d4',
	};
	return colors[menuId] || '#ffe5ec';
}

// Función para truncar descripción
function truncateDescription(text, maxWords = 15) {
	const words = text.trim().split(/\s+/);
	if (words.length <= maxWords) {
		return text;
	}
	return words.slice(0, maxWords).join(' ') + '...';
}

// Función para renderizar productos
function renderProducts(menuId) {
	const container = document.getElementById('productsContainer');

	// Filtrar productos según el menú
	const filteredProducts = products.filter(p => p.menu === menuId);

	// Si no hay productos
	if (filteredProducts.length === 0) {
		container.innerHTML = `
			<div class="col-12 no-products">
				<i class="fas fa-inbox fa-3x mb-3"></i>
				<p>No hay productos disponibles en esta categoría</p>
			</div>
		`;
		return;
	}

	// Renderizar productos
	container.innerHTML = filteredProducts
		.map(
			product => `
		<div class="col-6 col-md-4 col-lg-3">
			<div class="product-card d-flex flex-column"
				style="
					border-radius: 12px;
					overflow: hidden;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
					transition: transform 0.3s ease, box-shadow 0.3s ease;
					height: 100%;
					cursor: pointer;
				"
				onclick="showProductDetail(${product.id})">
				<div class="product-img position-relative">
					<img class="img-fluid w-100" src="${product.image}" alt="${product.title}" 
						style="height: 200px; object-fit: cover" />
					<span class="position-absolute top-0 end-0 m-2 badge" 
						style="font-size: 11px; padding: 6px 10px; border-radius: 20px; 
						background: ${product.available ? '#a8d5ba' : '#ffcccb'}; 
						color: ${product.available ? '#1a4d2e' : '#8b0000'}; 
						font-weight: 600; font-family: 'Montserrat', 'Arial', sans-serif">
						${product.available ? 'Disponible' : 'Agotado'}
					</span>
				</div>
				<div class="product-content p-3 d-flex flex-column flex-grow-1" 
					style="background: ${getBackgroundColor(product.menu)}">
					<h5 class="mb-2"  
						style="font-weight: 400; color: #333; font-size: 16px; min-height: 48px; height: auto;
						font-family: 'Playfair Display', 'Georgia', serif;  
						letter-spacing: 0.5px"> 
						${product.title} 
					</h5>
					<p class="mb-3 flex-grow-1" 
						style="font-size: 13px; color: #888; line-height: 1.6; 
						font-family: 'Montserrat', 'Arial', sans-serif; 
						font-weight: 300">
						${truncateDescription(product.sort_description)}
					</p>
					<div class="d-flex justify-content-between align-items-center mt-auto">
						<span style="font-size: 17px; font-weight: 600; color: #c2185b; 
							font-family: 'Montserrat', 'Arial', sans-serif">
							Bs. ${product.price.toFixed(2)}
						</span>
					</div>
				</div>
			</div>
		</div>
	`
		)
		.join('');
}

// Función para mostrar el detalle del producto
function showProductDetail(productId) {
	const product = products.find(p => p.id === productId);
	if (!product) return;

	// Ocultar contenido principal
	const mainContent = document.querySelector('.container-fluid.services');
	mainContent.style.display = 'none';

	// Crear contenedor de detalle si no existe
	let detailContainer = document.getElementById('productDetailContainer');
	if (!detailContainer) {
		detailContainer = document.createElement('div');
		detailContainer.id = 'productDetailContainer';
		detailContainer.className = 'container-fluid py-5';
		mainContent.parentNode.insertBefore(detailContainer, mainContent.nextSibling);
	}

	// Mostrar detalle
	detailContainer.style.display = 'block';
	detailContainer.innerHTML = `
		<div class="container">
			<button class="btn btn-outline-primary mb-4" onclick="closeProductDetail()" 
				style="font-family: 'Montserrat', 'Arial', sans-serif">
				<i class="fas fa-arrow-left me-2"></i>Volver al catálogo
			</button>
			
			<div class="row g-4">
				<div class="col-md-6">
					<div class="product-images">
						<img src="${product.image}" alt="${product.title}" 
							id="mainProductImage"
							class="img-fluid mb-3" 
							style="border-radius: 12px; width: 100%; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)">
						${
							product.all_images && product.all_images.length > 1
								? `
							<div class="row g-2">
								${product.all_images
									.map(
										img => `
									<div class="col-4">
										<img src="${img}" alt="${product.title}" 
											class="img-fluid" 
											style="border-radius: 8px; cursor: pointer; border: 2px solid #ddd; transition: border-color 0.3s"
											onmouseover="this.style.borderColor='var(--bs-primary)'"
											onmouseout="this.style.borderColor='#ddd'"
											onclick="document.getElementById('mainProductImage').src = this.src">
									</div>
								`
									)
									.join('')}
							</div>
						`
								: ''
						}
					</div>
				</div>
				
				<div class="col-md-6">
					<h2 class="mb-3" style="font-family: 'Playfair Display', 'Georgia', serif; color: #333; font-weight: 400; letter-spacing: 0.5px">
						${product.title}
					</h2>
					
					<div class="mb-3">
						<span class="badge" 
							style="font-size: 14px; padding: 8px 16px; border-radius: 20px; 
							background: ${product.available ? '#a8d5ba' : '#ffcccb'}; 
							color: ${product.available ? '#1a4d2e' : '#8b0000'}; 
							font-family: 'Montserrat', 'Arial', sans-serif; font-weight: 600">
							${product.available ? 'Disponible' : 'Agotado'}
						</span>
					</div>
					
					<h3 class="mb-4" style="font-size: 32px; font-weight: 600; color: #c2185b; 
						font-family: 'Montserrat', 'Arial', sans-serif">
						Bs. ${product.price.toFixed(2)}
					</h3>
					
					<div class="mb-4" style="background: ${getBackgroundColor(product.menu)}; padding: 20px; border-radius: 8px">
						<h5 style="font-family: 'Montserrat', 'Arial', sans-serif; font-weight: 600; color: #333; margin-bottom: 12px">
							Descripción
						</h5>
						<p style="font-family: 'Montserrat', 'Arial', sans-serif; color: #666; line-height: 1.8; margin: 0">
							${product.sort_description}
						</p>
					</div>
					
					${
						product.benefits && product.benefits.length > 0
							? `
						<div class="mb-4">
							<h5 style="font-family: 'Montserrat', 'Arial', sans-serif; font-weight: 600; color: #333; margin-bottom: 12px">
								<i class="fas fa-check-circle me-2" style="color: #a8d5ba"></i>Beneficios
							</h5>
							<ul style="font-family: 'Montserrat', 'Arial', sans-serif; color: #666; line-height: 1.8; padding-left: 20px">
								${product.benefits.map(benefit => `<li class="mb-2">${benefit}</li>`).join('')}
							</ul>
						</div>
					`
							: ''
					}
					
					${
						product.how_to_use && product.how_to_use.length > 0
							? `
						<div class="mb-4">
							<h5 style="font-family: 'Montserrat', 'Arial', sans-serif; font-weight: 600; color: #333; margin-bottom: 12px">
								<i class="fas fa-hand-sparkles me-2" style="color: #d4ebf2"></i>Cómo usar
							</h5>
							<ol style="font-family: 'Montserrat', 'Arial', sans-serif; color: #666; line-height: 1.8; padding-left: 20px">
								${product.how_to_use.map(step => `<li class="mb-2">${step}</li>`).join('')}
							</ol>
						</div>
					`
							: ''
					}
					
					<div class="d-grid gap-2 mt-4">
						<a href="https://wa.me/59176543210?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(product.title)}" 
							class="btn btn-success btn-lg" 
							target="_blank"
							style="font-family: 'Montserrat', 'Arial', sans-serif; font-weight: 600; padding: 12px; border-radius: 8px">
							<i class="fab fa-whatsapp me-2"></i>Consultar por WhatsApp
						</a>
					</div>
				</div>
			</div>
		</div>
	`;

	// Scroll al inicio
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para cerrar el detalle del producto
function closeProductDetail() {
	// Ocultar detalle
	const detailContainer = document.getElementById('productDetailContainer');
	if (detailContainer) {
		detailContainer.style.display = 'none';
	}

	// Mostrar contenido principal
	const mainContent = document.querySelector('.container-fluid.services');
	mainContent.style.display = 'block';

	// Scroll al inicio
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Manejar clicks en el menú
document.querySelectorAll('.menu-link').forEach(menuItem => {
	menuItem.addEventListener('click', function (e) {
		// Prevenir click si hubo arrastre (importado desde menu-navigation.js)
		if (typeof currentTranslate !== 'undefined' && typeof prevTranslate !== 'undefined') {
			if (Math.abs(currentTranslate - prevTranslate) > 5) {
				e.preventDefault();
				return;
			}
		}

		// Cerrar detalle de producto si está abierto
		closeProductDetail();

		// Remover active de todos
		document.querySelectorAll('.menu-link').forEach(item => {
			item.classList.remove('active');
		});

		// Agregar active al seleccionado
		this.classList.add('active');

		// Obtener el ID del menú
		const menuId = parseInt(this.getAttribute('data-menu-id'));

		// Renderizar productos filtrados
		renderProducts(menuId);
	});
});

// Activar el primer menú (id=1) por defecto
function initializeMenu() {
	const firstMenuItem = document.querySelector('.menu-link[data-menu-id="1"]');
	if (firstMenuItem) {
		firstMenuItem.classList.add('active');
		renderProducts(1);
	}
}

// Cargar todos los productos al inicio
loadProducts().then(() => {
	initializeMenu();
});
