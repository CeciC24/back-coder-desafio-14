const socket = io()

const addToCartBtn = document.querySelector('.addToCartBtn')

addToCartBtn.addEventListener('click', async function (event) {
	const product = this.getAttribute('product')
    socket.emit('addToCart', product)
})
