const button = document.querySelector('.nav-link[href="/logout"]')

button.addEventListener('click', (e) => {
	e.preventDefault()

	fetch('/api/sessions/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (response.token || response.status === 200) {
			window.location.replace('/login')
		} else {
			console.log('Algo salió mal')
		}
	})
})
