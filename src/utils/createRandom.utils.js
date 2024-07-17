import { faker } from '@faker-js/faker'

export function createRandomProduct() {
    let numRepetitions = faker.number.int(3)
    let imageUrls = []

    for (let i = 0; i < numRepetitions; i++) {
        let imageUrl = faker.image.urlLoremFlickr({ width: 300 })
        imageUrls.push(imageUrl)
    }

	return {
		id: faker.database.mongodbObjectId(),
		status: faker.datatype.boolean(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		code: faker.string.alphanumeric(6),
		price: faker.commerce.price(),
		stock: faker.number.int(1000),
		category: faker.database.mongodbObjectId(),
		thumbnails: imageUrls,
	}
}
