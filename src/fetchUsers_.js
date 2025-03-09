import { FormEditor, body, openContainer, latestIndex } from "./index.js";

let allUsers = [];
let activeFilters = [];
let searchInput = document.getElementById('searching');
searchInput.addEventListener('input', (e) => {
    e.preventDefault();
    filterAndDisplay(allUsers);

});

document.querySelectorAll('.active-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        console.log(btn.textContent.trim());
        const filterValue = btn.textContent.trim();
        const iTag = btn.children[0];

        if (iTag.classList.contains('fa-check')) {
            iTag.classList.remove('fa-check');
            iTag.classList.add('fa-check-no');
            activeFilters.push(filterValue);
            
            
        }else{
            iTag.classList.remove('fa-check-no');
            iTag.classList.add('fa-check');
            activeFilters = activeFilters.filter(filter => filter !== filterValue);
        }

        filterAndDisplay(allUsers);
    })
});


async function displayUsers() {
    try {
        const response = await fetch('/api/users'); 
        const users = await response.json();
        allUsers = users;


        filterAndDisplay(allUsers);

        return allUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
    
}


// function filterAndDisplay(usersToFilter) {
//     let searchInput = document.getElementById('searching');
//     let searchItem = searchInput.value; 

//     let usersToDisplay = usersToFilter; 

//     if (searchItem) {
//         usersToDisplay = usersToFilter.filter((item) => {
//             if (item.displayName && item.displayName.toLowerCase().includes(searchItem.toLowerCase())) {
//                 return true;
//             }
//             return false;
//         });
//     }

//     newArray(usersToDisplay); 
// };

function filterAndDisplay(usersToFilter) {
    let searchInput = document.getElementById('searching');
    let searchItem = searchInput.value;

    let usersToDisplay = usersToFilter;

    if (searchItem) {
        usersToDisplay = usersToFilter.filter((item) => {
            if (item.displayName && item.displayName.toLowerCase().includes(searchItem.toLowerCase())) {
                return true;
            }
            return false;
        });
    }

    // Apply the onLeave filter
    usersToDisplay = filterByOnLeave(usersToDisplay);

    newArray(usersToDisplay);
};

function filterByOnLeave(usersToFilter){
    console.log("Active Filters:", activeFilters);

    let filteredUsers = usersToFilter;

    if (activeFilters.length > 0) {
        filteredUsers = usersToFilter.filter(item => {
            if (item.customSecurityAttributes && item.customSecurityAttributes.AdditionalUserAttributes && item.customSecurityAttributes.AdditionalUserAttributes.onLeave) {
                const onLeaveValue = item.customSecurityAttributes.AdditionalUserAttributes.onLeave;
                const exclude = activeFilters.includes(onLeaveValue); // Check if onLeaveValue should be excluded
                console.log("User:", item.displayName, "onLeave:", onLeaveValue, "Exclude:", exclude);
                return !exclude; // Return true if the value should *not* be excluded
            }
            console.log("User without onLeave:", item.displayName);
            return true; // Keep users without onLeave (or handle as needed)
        });
    }

    console.log("Filtered Users:", filteredUsers);
    return filteredUsers;
}

// function filterAndDisplayUsers() {
    

//     let filteredUsers = allUsers;

//     if (activeFilters.length > 0) {
//         filteredUsers = allUsers.filter(item => {
//             if (item.customSecurityAttributes && item.customSecurityAttributes.AdditionalUserAttributes && item.customSecurityAttributes.AdditionalUserAttributes.onLeave) {
//                 const onLeaveValue = item.customSecurityAttributes.AdditionalUserAttributes.onLeave;
//                 const exclude = activeFilters.includes(onLeaveValue); 
//                 console.log("User:", item.displayName, "onLeave:", onLeaveValue, "Exclude:", exclude);
//                 return !exclude; 
//             }
//             console.log("User without onLeave:", item.displayName);
//             return true; 
//         });
//     }

    
//     filterAndDisplay(filteredUsers);
// }

function newArray(allDUsers){
    let currentPage = 1;
    const totalPages = Math.ceil(allDUsers.length / 5);
    function showItems(page) {
        const startIndex = (page - 1) * 5;
        const endIndex = startIndex + 5;
        const pageItems = allDUsers.slice(startIndex, endIndex);
        body.innerHTML ="";
    
        pageItems.forEach((item, index) => {
        const grade = item.customSecurityAttributes.AdditionalUserAttributes.Grade;
        
        
        
        
        //create each tr
        let tr = document.createElement('tr');
        tr.classList.add('body-item');
        tr.setAttribute('id', 'body-item');

        //td
        let tdGroupOne = document.createElement('td');
        tdGroupOne.classList.add('group-one');
        tdGroupOne.setAttribute('id', 'group-one');

        //img container and img
        let imgDiv = document.createElement('div');
        imgDiv.classList.add('img-div');
        imgDiv.classList.add('img-div');
        let img = document.createElement('img');
        img.setAttribute('src',`${item.photo}`);
        imgDiv.append(img);

        //name-group
        let nameGroup = document.createElement('div');
        nameGroup.classList.add('name-group');
        nameGroup.setAttribute('id','name-group');

        let nameDirect = document.createElement('div');
        nameDirect.classList.add('name-direct');
        nameDirect.setAttribute('id','name-direct');
        let h2GroupOne = document.createElement('h2');
        h2GroupOne.textContent = `${item.displayName}`;

        let emailOne = document.createElement('div');
        emailOne.classList.add('email');
        emailOne.setAttribute('id','email');
        let emailP = document.createElement('p');
        emailP.textContent = `${item.mail}`;

        //append 1st td
        nameDirect.append(h2GroupOne);
        emailOne.append(emailP);
        nameGroup.append(nameDirect, emailOne);
        tdGroupOne.append(imgDiv, nameGroup);

        //2nd td
        let tdGroupTwo = document.createElement('td');
        tdGroupTwo.classList.add('group-two');
        tdGroupTwo.setAttribute('id','group-two');

        let nameDirectTwo = document.createElement('div');
        nameDirectTwo.classList.add('name-direct');
        nameDirectTwo.setAttribute('id','name-direct');

        let h2GroupTwo = document.createElement('h2');
        h2GroupTwo.textContent = `${item.jobTitle}`;

        let emailTwo = document.createElement('div');
        emailTwo.classList.add('email');
        emailTwo.setAttribute('id','email');
        let emailPTwo = document.createElement('p');
        emailPTwo.textContent = `${grade}`;

        //2nd appends
        emailTwo.append(emailPTwo);
        nameDirectTwo.append(h2GroupTwo);
        tdGroupTwo.append(nameDirectTwo, emailTwo);

        //3rd td
        let tdGroupThree = document.createElement('td');
        tdGroupThree.classList.add('statb');
        tdGroupThree.setAttribute('id', 'statb');

        let spanOne = document.createElement('span');
        spanOne.classList.add('group-three');
        spanOne.setAttribute('id','group-three');
        let buttonSpan = document.createElement('button');
        let text = item.customSecurityAttributes.AdditionalUserAttributes.onLeave;
        buttonSpan.textContent = `${text.charAt(0).toUpperCase() + text.slice(1)}`;

        if (buttonSpan.textContent === 'On-leave') {
            buttonSpan.classList.remove('vacation');
            buttonSpan.classList.add('leave');
        }else if (buttonSpan.textContent === 'Vacation') {
            buttonSpan.classList.remove('leave');
            buttonSpan.classList.add('vacation');
        }else{
            buttonSpan.classList.remove('leave');
            buttonSpan.classList.remove('vacation');
            buttonSpan.classList.add('action');
        }


        spanOne.append(buttonSpan);

        let spanTwo = document.createElement('span');
        spanTwo.classList.add('group-four');
        spanTwo.setAttribute('id', 'group-four');

        let eye = document.createElement('div');
        eye.classList.add('eye');
        eye.setAttribute('id','eye');
        let eyeI = document.createElement('i');
        eyeI.classList.add('fa-regular','fa-eye');
        eyeI.addEventListener('click', (event) => {
            event.preventDefault();
            openContainer(index);
        })
        eye.append(eyeI);

        let edit = document.createElement('div');
        edit.classList.add('edit');
        edit.setAttribute('id','edit');
        let editI = document.createElement('i');
        editI.classList.add('fa-regular','fa-pen-to-square');
        let showingForm = new FormEditor(index);
        edit.addEventListener('click', (event) =>{
            event.preventDefault();
            latestIndex = index;
            showingForm.showForm();
        })
        edit.append(editI);

        let deleted = document.createElement('div');
        deleted.classList.add('delete');
        deleted.setAttribute('id','delete');
        let deletedI = document.createElement('i');
        deletedI.classList.add('fa-solid','fa-trash');
        let deletingItem = new FormEditor(index);
        deletedI.addEventListener('click', (event) =>{
            event.preventDefault();
            latestIndex = index;
            deletingItem.showDelete();
        });
        let mobile = document.createElement('p');
        mobile.classList.add('mobile');
        mobile.textContent = item.businessPhones;

        deleted.append(deletedI);
        spanTwo.append(mobile);
        tdGroupThree.append(spanOne, spanTwo);
        tr.append(tdGroupOne, tdGroupTwo, tdGroupThree);
        body.append(tr);

        







    })
}

function setupPagination() {
    const pagination = document.querySelector("#pagination");
    // pagination.classList.remove('pagination-container');
    // pagination.classList.add('page-items-container');
    pagination.innerHTML = "";
    let leftArrow = document.createElement('div');
    leftArrow.classList.add('left-arrow');
    leftArrow.setAttribute('id','left-arrow');
    let rightArrow = document.createElement('div');
    rightArrow.classList.add('right-arrow');
    rightArrow.setAttribute('id','right-arrow');
    let itemContainer = document.createElement('div');
    // pagination.appendChild(leftArrow);
    for (let i = 1; i <= totalPages; i++) {
        
        itemContainer.classList.add('d-number');
        itemContainer.setAttribute('id', 'd-number');
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = i;
        // itemContainer.append(link);

        if (i === currentPage) {
            link.classList.add("active");
        }
      
        link.addEventListener("click", (event) => {
          event.preventDefault();
          currentPage = i;
          showItems(currentPage);
      
          const currentActive = pagination.querySelector(".active");
          currentActive.classList.remove("active");
          itemContainer.classList.add("active");
        });
        pagination.appendChild(link);
      }
    //   pagination.appendChild(rightArrow);

}
showItems(currentPage);
setupPagination();
    
}

export { displayUsers }
