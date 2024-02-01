const library = [];
const tempArr = []; // Created a temporary array in which we will save books until we press button Print books
let isBlocksHidden = true;
const todayYear = new Date().getFullYear();

const addButton = document.getElementById("add");
const printButton = document.getElementById("print");

const isbnInput = document.getElementById('isbn');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');

const hiddenBlocks = Array.from(document.getElementsByClassName('hidden'));

const inputs = [isbnInput, titleInput, authorInput, yearInput];

addButton.addEventListener('click', e => {
    
    const isbn = isbnInput.value.trim();
    console.log(isbn);
    
    if (isBookNotExists(isbn)) {
        if (isAllFieldsFilled()) {
            let book = new Book(isbn, titleInput.value.trim(), authorInput.value.trim(), +yearInput.value.trim());
            tempArr.push(book);
            inputs.forEach(i => i.value = '');
        }
    } else {
        alert(`Book with ISBN "${isbn}" is already exists`);
    }

});

printButton.addEventListener('click', e => {
    if (tempArr.length > 0){
        const list = document.getElementById('allBooks');
        tempArr.forEach(book => {
            const li = document.createElement('li');
            const textNode = document.createTextNode(book.toString());
            li.appendChild(textNode)
            list.appendChild(li)
        });
    
        library.push(...tempArr);
        tempArr.length = 0;


        if (isBlocksHidden){
            hiddenBlocks.forEach(b => b.classList.remove('hidden'));
            isBlocksHidden = false;
        }
        
        printOldestAndNewest();
    } 
});


function isBookNotExists(isbn) {
    return library.findIndex(b => b.isbn === isbn) === -1 && tempArr.findIndex(b => b.isbn === isbn) === -1;
}


function findBook(isbn) {
    return library.findIndex(b => b.isbn === isbn);
}

function Book(isbn, title, author, year) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = +year;
    this.toString = function () {
        return `ISBN: ${this.isbn}, TITLE: ${this.title}, AUTHOR: ${this.author}, YEAR: ${this.year}`
    }
}

function isAllFieldsFilled() {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim().length === 0) {
            const atrName = inputs[i].getAttribute('data-name');
            alert(`The field "${atrName}" is required`);
            return false;
        }
    }
    return true;
}

function findNewestBook(){
    return library.reduce((max, book) => max.year > book.year ? max : book).toString();
}

function findOldestBook(){
    return library.reduce((min, book) => min.year < book.year ? min : book).toString();
}

function printOldestAndNewest (){
    const oldestTN = document.createTextNode(findOldestBook())
    const newestTN = document.createTextNode(findNewestBook())
    
    const oldest = document.getElementById('oldest');
    const newest = document.getElementById('newest');
    
    if(oldest.lastChild){
        oldest.replaceChild(oldestTN, oldest.lastChild);
    }else{
        oldest.appendChild(oldestTN);
    }

    if(newest.lastChild){
        newest.replaceChild(newestTN, newest.lastChild);
    }else{
        newest.appendChild(newestTN);
    }
    
    
}


yearInput.oninput = function () {
    this.value = this.value.replace(/[^\d]/g, ''); // Accept only numbers
    if (this.value.length > 4) {
        this.value = this.value.substring(0, 4); // Maximal length = 4
    }
    
    if (+this.value > todayYear) {
        this.value = todayYear; // Not allowing to set year greater than current year
    }
};

// TODO some notification, when we added a book (to show user, that book was added)