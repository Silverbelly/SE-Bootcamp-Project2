// variable initialization
let pageSize = 10;
let totalItems = 0;
let totalPages = 1;
let currentPage = 1;
let offset = 0;

// using the event listener for the window load event to be sure
// the dom has completed load before grabbing the elements which
// will be used
let queryTypeElement;
let keywordElement;
let perPageElement;

window.addEventListener('load', (event) => {
    queryTypeElement = document.getElementById('query-type');
    keywordElement = document.getElementById('keyword');
    perPageElement = document.getElementById('per-page-selector');
});

// constants initialization
const API_KEY = '2H1hfhYVflid5QGVztHMFdkI6hOwXjb2';
const qsParm = (searchOption) => (searchOption === 'search' ? 'q' : searchOption === 'translate' ? 's' : 'tag');

// render content functions
function inializePagination() {
    totalPages = 1;
    currentPage = 1;
    offset = 0;
}

function renderPagination() {
    let paginationContainer = document.querySelector('.js-pagination-container');
    let pageControlElement = document.querySelector('.js-page-control');
    let nextButton = document.querySelector('.js-next');
    let prevButton = document.querySelector('.js-prev');

    pageControlElement.classList.remove('visually-hidden');
    if (totalItems <= 10) pageControlElement.classList.add('visually-hidden');

    paginationContainer.classList.remove('visually-hidden');
    nextButton.classList.remove('disabled');
    prevButton.classList.remove('disabled');
    if (totalPages <= 1) paginationContainer.classList.add('visually-hidden');
    if (currentPage === totalPages) nextButton.classList.add('disabled');
    else if (currentPage === 1) prevButton.classList.add('disabled');

    document.querySelector('.js-page-info').innerText = `${currentPage} of ${totalPages}`;
}

function setTotalPageCount() {
    let pages = Math.floor(totalItems / pageSize);
    if (totalItems % pageSize > 0) pages++;
    totalPages = pages;
}

function renderImages(imageList) {
    let imageListItems = imageList.data;
    totalItems = 0;
    let html = '';
    if (Array.isArray(imageListItems)) {
        if (imageListItems.length === 0) {
            html += '<div class="image-list-item"><p>Search returned no results.</p></div>'; // keyword 'balleywho' returns 0 results
        } else {
            for (let item of imageListItems) {
                html += `<div class="image-list-item">
                    <img src="${item.images.original.url}" alt="${item.title}" />
                    </div>`;
            }
            totalItems = imageList.pagination.total_count;
        }
    } else {
        html += `<div class="image-list-item">
            <img src="${imageListItems.images.original.url}" alt="${imageListItems.title}" />
            </div>`;
        totalItems = 1;
    }
    document.querySelector('.js-image-container').innerHTML = html;
    setTotalPageCount();
    renderPagination();
}

function getUrl() {
    let queryType = queryTypeElement.value;
    let keyword = keywordElement.value;
    let url = `https://api.giphy.com/v1/gifs/${queryType}?api_key=${API_KEY}&limit=${pageSize}&offset=${offset}`;
    if (keyword.trim() !== '' && queryType != 'random') {
        url += `&${qsParm(queryType)}=${keyword}`;
    }
    return url;
}

async function fetchImageList() {
    let url = getUrl();
    let response = await fetch(url);
    let data = await response.json();
    renderImages(data);
}

/**************************************
    event handler functions 
***************************************/

function handleSubmit(event) {
    event.preventDefault();

    let queryType = queryTypeElement.value;
    let keyword = keywordElement.value;
    // check the input
    if (queryType === '') {
        alert('Select a Search option');
        return;
    }
    if (queryType !== 'random' && keyword === '') {
        alert('Please enter a keyword.');
        return;
    }

    // input is good, proceed
    inializePagination();
    fetchImageList();
}

function handlePrevClick() {
    offset -= pageSize;
    fetchImageList();
    currentPage -= 1;
}

function handleNextClick() {
    offset += pageSize;
    fetchImageList();
    currentPage += 1;
}

function handlePerPageClick() {
    pageSize = Number(perPageElement.value);
    currentPage = 1;
    offset = 0;
    fetchImageList();
}

/**************************************
    event listeners
***************************************/
document.querySelector('button[type=submit').addEventListener('click', handleSubmit);
document.querySelector('.js-prev').addEventListener('click', handlePrevClick);
document.querySelector('.js-next').addEventListener('click', handleNextClick);
document.querySelector('.js-per-page-selector').addEventListener('change', handlePerPageClick);
