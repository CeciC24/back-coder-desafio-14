const socket = io()

const addForm = document.getElementById('addProductForm')
const deleteForm = document.getElementById('deleteProductForm')

addForm.addEventListener('submit', async function (event) {
	event.preventDefault()

	const formData = new FormData(this)

	const product = {
		title: formData.get('title'),
		description: formData.get('description'),
		code: formData.get('code'),
		price: formData.get('price'),
		stock: formData.get('stock'),
		category: formData.get('category'),
		thumbnails: formData.get('thumbnails') !== null ? formData.get('thumbnails') : []
	}
	
	socket.emit('addProduct', product)
	console.log('Producto enviado:', product)
})

deleteForm.addEventListener('submit', async function (event) {
	event.preventDefault()

	const formData = new FormData(this)
	const productID = formData.get('productID')

	socket.emit('deleteProduct', productID)
})


socket.on('addToTheList', (product) => {
	const productList = document.getElementById('productListContainer')
	const newProductHTML = `
        <div id=${product.id}>
            <h3>${product.title}</h3>
            <p>${product.id}</p>
            <p>${product.description}</p>
            <p>${product.price}</p>
        </div>
    `
	productList.innerHTML += newProductHTML
})

socket.on('deleteFromList', (productID) => {
	const productToDelete = document.getElementById(productID)

	if (productToDelete) {
		productToDelete.remove()
	}
})