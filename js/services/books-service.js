'use strict'
const BOOKS_DATA = 'booksDB'
const RENDER_TYPE = 'renderType'
const PAGE_SIZE = 6

var gBooks
var gFilterBy = {price: 0,rate: 0, txt: ''}
var gPageIdx = 0
var gPages
var gRenderType ='table'
var gCurrBookId
var gSortBy = ''


function _createBook(name,price) {
    
    var rndPrice = getRandomIntInclusive(1,100)
    var rndPrice = rndPrice.toFixed(2)
    return {
        id: makeId(),
        name,
        price: price || rndPrice,
        imgUrl: '../img/harrypotter.jpg',
        desc: makeLorem(),
        rate: 0
    }
}

function createBooks(){
    var books = loadFromStorage(BOOKS_DATA)

    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 40; i++) {
            var name = 'Book' + i
            books.push(_createBook(name))
        }
    }
    gBooks = books
    gPages = Math.ceil(gBooks.length / PAGE_SIZE)
    _saveBooksToStorage()
}

function _saveBooksToStorage(){
    saveToStorage(BOOKS_DATA,gBooks)
}

function getBooks(){

    var books = gBooks.filter(book => book.price >= gFilterBy.price && book.rate >= gFilterBy.rate)
    books = books.filter(book => book.name.toLowerCase().includes(gFilterBy.txt.toLowerCase()))

    if(gSortBy === 'names') books.sort((b1,b2) => {return b1.name.localeCompare(b2.name)})
    if(gSortBy === 'prices') books.sort((b1,b2) => b1.price - b2.price)

    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)

    return books
}

function removeBook(bookId){
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(name,price){
    const book = _createBook(name,price)
    gBooks.unshift(book)
    _saveBooksToStorage()
}

function setCurrBookId(bookId) {
    gCurrBookId = bookId
}

function updateBook(newPrice) {
    const book = gBooks.find(book => gCurrBookId === book.id)
    book.price = newPrice
    _saveBooksToStorage()
}

function getBookById(bookId) {
    return gBooks.find(book => bookId === book.id)
}

function rateBook(value,bookId) {
    const book = getBookById(bookId)
    book.rate += +value
    _saveBooksToStorage()
}

function setBookFilter(filterBy = {}) {
    if (filterBy.price !== undefined) gFilterBy.price = filterBy.price
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt
    return gFilterBy
}

function setRenderType(renderType) {
    gRenderType = renderType
    saveToStorage(RENDER_TYPE,gRenderType)
}

function getRenderType(){
    return loadFromStorage(RENDER_TYPE)
}

function sortBy(sortType){
    gSortBy = sortType
}

function getPageIdx(){
    return gPageIdx
}

function getPages(){
    return gPages
}

function setPageIdx(pageIdx) {
    gPageIdx = pageIdx
}