// variable initialization
let apiEndpointInfo = {
    endpoint: 'search',
    qsParmName: 'q',
};

let totalPages = 1;
let currentPage = 1;
let offset = 0;

// constants initialization
const API_KEY = '2H1hfhYVflid5QGVztHMFdkI6hOwXjb2';
const PAGE_SIZE = 15;

// render content functions
function inializePagination() {
    totalPages = 1;
    currentPage = 1;
    offset = 0;
}

function renderPagination() {
    let paginationContainer = document.querySelector('.js-pagination-container');
    if (totalPages > 1) {
        paginationContainer.classList.remove('hidden');
    } else {
        paginationContainer.classList.add('hidden');
    }

    // todo
    pagesText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('pagination-info').innerText = pagesText;
    if (currentPage === totalPages) {
        document.querySelector('.js-next').classList.add('hidden');
    } else if (currentPage === 1) {
        document.querySelector('.js-prev').classList.add('hidden');
    } else {
        document.querySelector('.js-next').classList.remove('hidden');
        document.querySelector('.js-prev').classList.remove('hidden');
    }
}

function setTotalPageCount(totalItems) {
    let pages = Math.floor(totalItems / PAGE_SIZE);
    if (totalItems % PAGE_SIZE > 0) pages++;
    totalPages = pages;
}

function renderImages(imageList) {
    let imageListItems = imageList.data;
    let totalItems = 0;
    let html = '';
    if (Array.isArray(imageListItems)) {
        if (imageListItems.length === 0) {
            html += '<div class="image-list-item"><p>Search returned no results.</p></div>'; // keyword 'balleywho' returns 0 results
        } else {
            for (let item of imageListItems) {
                html += `<div class="image-list-item">
                    <img src="${item.images.original.url}" />
                    </div>`;
            }
            totalItems = imageList.pagination.total_count;
        }
    } else {
        html += `<div class="image-list-item">
            <img src="${imageListItems.images.original.url}" />
            </div>`;
        totalItems = 1;
    }
    document.querySelector('.js-image-container').innerHTML = html;
    setTotalPageCount(totalItems);
    renderPagination();
}

function getUrl(keyword, offset) {
    let url = `https://api.giphy.com/v1/gifs/${apiEndpointInfo.endpoint}?api_key=${API_KEY}&limit=${PAGE_SIZE}`;
    if (keyword.trim() !== '') {
        url += `&${apiEndpointInfo.qsParmName}=${keyword}`;
    }
    url += `&offset=${offset}`;
    console.log(url);
    return url;
}

async function fetchImageList(keyword, offset) {
    let url = getUrl(keyword, offset);
    let response = await fetch(url);
    let data = await response.json();
    renderImages(data);
}

// event handler functions
function handleSearchTypeClick(event) {
    event.preventDefault();
    document.querySelector('.js-search-type').innerText = event.target.innerText;
    let endpoint = event.target.dataset.endpoint;
    apiEndpointInfo.endpoint = endpoint;
    apiEndpointInfo.qsParmName = endpoint === 'search' ? 'q' : endpoint === 'translate' ? 's' : 'tag';
}

function handleSubmit(event) {
    event.preventDefault();
    inializePagination();
    let keyword = document.getElementById('keyword').value;
    if (apiEndpointInfo.endpoint !== 'random' && keyword.trim() === '') {
        alert('Please provide a keyword to search.');
        return;
    }
    fetchImageList(keyword, offset);
}

function handlePrevClick() {
    offset -= PAGE_SIZE;
    fetchImageList(document.getElementById('keyword').value, offset);
    currentPage -= 1;
}

function handleNextClick() {
    offset += PAGE_SIZE;
    fetchImageList(document.getElementById('keyword').value, offset);
    currentPage += 1;
}

// event listeners
for (let element of document.querySelectorAll('.dropdown-item')) {
    element.addEventListener('click', handleSearchTypeClick);
}

document.querySelector('button[type=submit').addEventListener('click', handleSubmit);
document.querySelector('.js-prev').addEventListener('click', handlePrevClick);
document.querySelector('.js-next').addEventListener('click', handleNextClick);
