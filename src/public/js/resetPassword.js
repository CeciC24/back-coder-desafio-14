const form = document.getElementById('resetForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const data = new FormData(form)
	const obj = {}
	data.forEach((value, key) => (obj[key] = value))
	const pathSegments = window.location.pathname.split('/')
	const token = pathSegments[pathSegments.length - 1]
	obj.token = token

	console.log(obj)

	fetch('/api/sessions/reset-password', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		console.log(response)
		if (response.status === 200) {
			window.location.href = '/login?success=true'
		} else if (response.message === 'Token inválido') {
			window.location.href = `/forgot-password?error=token`
		} else if (response.message === 'Contraseña repetida') {
			form.reset()
			alert('La contraseña no puede ser igual a la anterior')
			window.location.href = `/reset-password/${token}?error=password`
		} else {
			alert('Error al restablecer contraseña')
		}
	})
})
