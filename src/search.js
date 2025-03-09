

// function search(){
//     let statusBody = document.getElementById('status-body-no');
//     let statsBtn = document.getElementById('status-btn');

//     statsBtn.addEventListener('click', (e) => {
//         if (statusBody.classList.contains('status-body-no')) {
//             statusBody.classList.remove('status-body-no');
//             statusBody.classList.add('status-body');
//         }else{
//             statusBody.classList.remove('status-body');
//             statusBody.classList.add('status-body-no');
//         }
//     });
// }

function search() {
    let searchIcon = document.querySelector('.fa-magnifying-glass');
    let inputField = document.getElementById('searching');
    inputField.addEventListener('focus', (e) => {
        searchIcon.style.display = 'none'
    });
    inputField.addEventListener('blur', (e) => {
        searchIcon.style.display = 'block'
    });
    let statusBody = document.getElementById('status-body-no');
    let statsBtn = document.getElementById('status-btn');

    function closePopupOutside(e) {
        if (!statusBody.contains(e.target) && e.target !== statsBtn) {
            statusBody.classList.remove('status-body');
            statusBody.classList.add('status-body-no');
            document.removeEventListener('click', closePopupOutside);
        }
    }

    statsBtn.addEventListener('click', (e) => {
        if (statusBody.classList.contains('status-body-no')) {
            statusBody.classList.remove('status-body-no');
            statusBody.classList.add('status-body');
            document.addEventListener('click', closePopupOutside);
        } else {
            statusBody.classList.remove('status-body');
            statusBody.classList.add('status-body-no');
            document.removeEventListener('click', closePopupOutside);
        }
    });
}
export { search };