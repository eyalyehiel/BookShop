'use strict'



function onInit() {

    createBooks()
    renderBooks()
    renderPaging()
}

function onSetRenderType(renderType) {
    setRenderType(renderType)
    renderBooks()
}

function renderBooks() {
    const renderType = getRenderType()
    if (renderType === 'table') renderBooksByTable()
    else renderBooksByDivs()

    doTrans()
}

function renderBooksByTable() {

    document.querySelector('.books-display').classList.remove('divs-content')

    document.querySelector('.books-display').innerHTML = `
    <table>
        <thead>
            <th data-trans="id">Id</th>
            <th data-trans="title" onclick="onSortBy('names')">Title</th>
            <th data-trans="price" onclick="onSortBy('prices')">Price</th>
            <th data-trans="actions" colspan="4">Actions</th>
        </thead>
        <tbody></tbody>
    </table>`


    var books = getBooks()
    var strHtmls = books.map((book) => {

        return `<tr>
        <td class="book-id">${book.id}</td>
        <td class="book-title"><span>${book.name}</span></td>
        <td class="book-price">${formatPrice(book.price)}</td>
        <td class="action-btns""><button data-trans="read-btn" onclick="onReadBook('${book.id}')">Read</button></td>
        <td class="action-btns"><button data-trans="update-btn" onclick="onOpenUpdateBookModal('${book.id}')">Update</button></td>
        <td class="action-btns"><button data-trans="delete-btn" onclick="onRemoveBook('${book.id}')">Delete</button></td>
        <td class="action-btns"><button class="plus-btn" onclick="onRateBook(1,'${book.id}')" ${+book.rate === 10 ? 'disabled' : ''} >+</button><input class="book-rate" value="${book.rate}" disabled></input><button class="minus-btn" onclick="onRateBook(-1,'${book.id}')" ${+book.rate === 0 ? 'disabled' : ''}>-</button></td>
    </tr>`
    })

    document.querySelector('tbody').innerHTML = strHtmls.join('')
}

function renderBooksByDivs() {

    document.querySelector('.books-display').classList.add('divs-content')

    var books = getBooks()
    var strHtmls = books.map((book) => {

        return `<article class="book">
        <img src="${book.imgUrl}"/>
        <h4>${book.name}</h4>
        <h5><span data-trans="price">Price</span> <span>${formatPrice(book.price)}</span></h5>
        <span>${book.id}</span>
        <div class="action-div-btns">
            <button data-trans="read-btn" onclick="onReadBook('${book.id}')">Read</button>
            <button data-trans="update-btn" onclick="onOpenUpdateBookModal('${book.id}')">Update</button>
            <button data-trans="delete-btn" onclick="onRemoveBook('${book.id}')">Delete</button>
        </div>
        <hr>
        <button class="plus-btn" onclick="onRateBook(1,'${book.id}')" ${+book.rate === 10 ? 'disabled' : ''} >+</button><input class="book-rate" value="${book.rate}" disabled></input><button class="minus-btn" onclick="onRateBook(-1,'${book.id}')" ${+book.rate === 0 ? 'disabled' : ''}>-</button>
    </article>`
    })

    document.querySelector('.books-display').innerHTML = strHtmls.join('')
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onOpenAddBookModal() {
    document.querySelector('.create-book-modal').classList.add('cbm-open')
}

function onAddBook(ev) {
    ev.preventDefault()

    onCloseModal({ value: 'cbm-modal' })

    var name = document.querySelector('.book-name')
    var price = document.querySelector('.book-price-input')

    if (isNaN(+price.value)) {
        alert('not a number')
        onCloseModal({ value: 'cbm-modal' })
        return
    }

    addBook(name.value, +price.value)

    name.value = ''
    price.value = ''

    renderBooks()
}

function onOpenUpdateBookModal(bookId) {
    setCurrBookId(bookId)
    document.querySelector('.update-book-modal').classList.add('ubm-open')
}

function onUpdateBook(ev) {
    ev.preventDefault()
    var price = document.querySelector('[name="bu-price"]')

    if (isNaN(+price.value)) {
        alert('not a number')
        onCloseModal({ value: 'ubm-modal' })
        price.value = ''
        return
    }
    onCloseModal({ value: 'ubm-modal' })
    updateBook(+price.value)
    price.value = ''
    renderBooks()
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.book-modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 .price-span').innerText = book.price
    elModal.querySelector('p').innerHTML = `<img src="${book.imgUrl}"/>` + book.desc
    elModal.classList.add('open')
}

function onCloseModal(elBtn) {
    if (elBtn.value === 'cbm-modal') document.querySelector('.create-book-modal').classList.remove('cbm-open')
    if (elBtn.value === 'ubm-modal') document.querySelector('.update-book-modal').classList.remove('ubm-open')
    if (elBtn.value === 'book-modal') document.querySelector('.book-modal').classList.remove('open')
}

function onRateBook(value, bookId) {
    rateBook(value, bookId)
    renderBooks()
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?price=${filterBy.price}&rate=${filterBy.rate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSortBy(sortType) {
    sortBy(sortType)
    renderBooks()
}

function renderPaging() {
    var pageIdx = getPageIdx()
    var pages = getPages()

    var strHtmls = `<button ${(pageIdx === 0) ? 'disabled' : ''} onclick="onSetPageIdx(${pageIdx - 1})"><</button>`

    for (var i = 0; i < pages; i++) {
        strHtmls += `<button ${(pageIdx === i) ? 'disabled' : ''} onclick="onSetPageIdx(${i})">${i}</button>`
    }

    strHtmls += `<button ${(pageIdx === pages - 1) ? 'disabled' : ''} onclick="onSetPageIdx(${pageIdx + 1})">></button>`

    document.querySelector('.paging-bar').innerHTML = strHtmls
}

function onSetPageIdx(pageIdx) {
    setPageIdx(pageIdx)
    renderPaging()
    renderBooks()
}

function onSetLang(lang) {
    setLang(lang)
    setDirection(lang)

    renderBooks()
}
