const paginateFormat = (toFormat, url) => {
        let response = {
            status: 'success',
            payload: toFormat.docs,
            totalPages: toFormat.totalPages,
            prevPage: toFormat.prevPage,
            nextPage: toFormat.nextPage,
            page: toFormat.page,
            hasPrevPage: toFormat.hasPrevPage,
            hasNextPage: toFormat.hasNextPage,
            prevLink: toFormat.hasPrevPage ? `${url}?page=${toFormat.prevPage}` : null,
            nextLink: toFormat.hasNextPage ? `${url}?page=${toFormat.nextPage}` : null,
        }
    
        return response
    }

export default paginateFormat