import FSProductManager from '../dao/memory/products.memory.js'
import { Server } from 'socket.io'

// Inicialización de Websockets (File System)
export default function webSocketsInit(server) {
    try {
        const FSProductMngr = new FSProductManager('src/dao/memory/data/products.json')
    
        const io = new Server(server)
        server.on('error', (error) => console.error(`Server error: ${error}`))
    
        io.on('connection', (socket) => {
            console.log('Nuevo cliente conectado')
    
            socket.on('addProduct', async (product) => {
                try {
                    const productAdded = await FSProductMngr.addProduct(product)
                    io.emit('addToTheList', productAdded)
                } catch (error) {
                    console.error(error.message)
                }
            })
    
            socket.on('deleteProduct', async (productID) => {
                try {
                    await FSProductMngr.deleteProduct(productID)
                    io.emit('deleteFromList', productID)
                } catch (error) {
                    console.error(error.message)
                }
            })
    
            socket.on('addToCart', async (product) => {
                // Aún no implementado
                /* const cart = await CartMngr.addProductToCart(cartID, product._id) */
                /* io.emit('productAddedToCart', cart) */
            })
        })
    } catch (error) {
        throw new Error('No se pudieron inicializar los websockets: ' + error.message)
    }
}