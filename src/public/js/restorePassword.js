const form = document.getElementById('restoreForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const data = new FormData(form)
	const obj = {}
	data.forEach((value, key) => (obj[key] = value))

	fetch('/api/sessions/restore', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((json) => {
			form.reset()
			console.log(json)
		})
})