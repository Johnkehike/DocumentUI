import { getSPO  } from "./fetch.js";

const searchInput = document.getElementById('search-input');

const searchIcon = document.querySelector('.fa-magnifying-glass');

searchInput.addEventListener('focus', (e) => {
    
    searchIcon.style.display = 'none'; 
});
searchInput.addEventListener('blur', (e) => {
    
    searchIcon.style.display = ''; 
});


getSPO();