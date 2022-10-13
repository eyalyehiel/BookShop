const gTrans = {
    'heading': {
        en: 'Book Shop',
        he: 'ספרים -ניהול מלאי'
    },
    'price-range': {
        en: 'Price:',
        he: 'מחיר:',
    },
    'rate-range': {
        en: 'Min Rate:',
        he: 'דירוג',
    },
    'add-book': {
        en: 'Create new book',
        he: 'צור ספר חדש',
    },
    'id': {
        en: 'Id',
        he: 'מזהה',
    },
    'title': {
        en: 'Title',
        he: 'שם',
    },
    'price': {
        en: 'Price',
        he: 'מחיר',
    },
    'actions': {
        en: 'Actions',
        he: 'פעולות',
    },
    'read-btn': {
        en: 'Read',
        he: 'קרא',
    },
    'update-btn': {
        en: 'Update',
        he: 'עדכן',
    },
    'delete-btn': {
        en: 'Delete',
        he: 'מחק',
    },
    'modal-name': {
        en: 'Name:',
        he: 'שם:',
    },
    'add-book-btn': {
        en: 'Add Book',
        he: 'הוסף ספר',
    },


}

let gCurrLang = 'en'

function getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'

    let trans = transMap[gCurrLang]
    if (!trans) trans = transMap.en
    return trans
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const trans = getTrans(transKey)
        el.innerText = trans
        if (el.placeholder) el.placeholder = trans
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatDate(time) {
    const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    }
    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}

function formatPrice(price) {
    var currency

    if(gCurrLang === 'he') {
        price = usdToShekel(price)
        currency = 'ILS'
    } else if(gCurrLang === 'en'){
        currency = 'USD'
    }
    return new Intl.NumberFormat(gCurrLang, {style: 'currency', currency: currency}).format(price)
}

function setElDirection(lang) {
    var elTableBtn = document.querySelector('.table-btn')
    var elDivsBtn = document.querySelector('.divs-btn')
    var elImgs = document.querySelectorAll('img')

    if(lang === 'he') {
        elTableBtn.classList.remove('ltr')
        elTableBtn.classList.add('rtl')
        elDivsBtn.classList.remove('ltr')
        elDivsBtn.classList.add('rtl')
        elImgs.forEach((img) => {
            img.style.float = 'right'
        })
    }
    if(lang === 'en') {
        elTableBtn.classList.remove('rtl')
        elTableBtn.classList.add('ltr')
        elDivsBtn.classList.remove('rtl')
        elDivsBtn.classList.add('ltr')
        elImgs.forEach((img) => {
            img.style.float = 'left'
        })
    }
}

function setDirection(lang) {
    if (lang === 'he') {
        document.body.classList.add('rtl')
        setElDirection(lang)
    }
    else {
        document.body.classList.remove('rtl')
        setElDirection(lang)
    }
}

function usdToShekel(price) {
    var changedPrice = price * 3.59
    console.log(changedPrice)
    // changedPrice = new Intl.NumberFormat('he', {style: 'currency', currency: 'ils'}).format(changedPrice)
    return changedPrice
}