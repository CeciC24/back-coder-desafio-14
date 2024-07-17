function generatePagination(totalPages, currentPage, url) {
    const container = document.querySelector('#pagination')

    let params = new URLSearchParams(window.location.search)
    
    const liPrev = document.createElement('li')
    liPrev.classList.add('page-item')

    if (currentPage === 1) {
        liPrev.classList.add('disabled')
        liPrev.innerHTML = `<span class='page-link'>Anterior</span>`
        
    } else {
        params.set('page', currentPage - 1)
        liPrev.innerHTML = `<a class='page-link' href='${url}?${params}'>Anterior</a>`
    }

    container.append(liPrev)

    for (let i = 1; i <= totalPages; i++) {
        const liPage = document.createElement('li')
        liPage.classList.add('page-item')

        if (i === currentPage) {
            liPage.classList.add('active')
            liPage.setAttribute('aria-current', 'page')

            liPage.innerHTML = `<span class='page-link'>${i}</span>`
        } else {
            params.set('page', i)
            liPage.innerHTML = `<a class='page-link' href='${url}?${params}'>${i}</a>`
        }

        container.append(liPage)
    }

    const liNext = document.createElement('li')
    liNext.classList.add('page-item')
    
    if (currentPage === totalPages) {
        liNext.classList.add('disabled')
        liNext.innerHTML = `<span class='page-link'>Siguiente</span>`
    } else {
        params.set('page', currentPage + 1)
        liNext.innerHTML = `<a class='page-link' href='${url}?${params}'>Siguiente</a>`
    }

    container.append(liNext)
}