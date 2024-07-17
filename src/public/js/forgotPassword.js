const form = document.getElementById('forgotForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const data = new FormData(form)
	const obj = {}
	data.forEach((value, key) => (obj[key] = value))

	console.log(obj)

	fetch('/api/sessions/forgot-password', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (response.status === 200) {
			window.location.href = '/login?emailsend=true'
		} else {
			alert('El correo no se encuentra registrado')
		}
	})
})