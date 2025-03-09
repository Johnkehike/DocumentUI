// import { displayUsers, allUsers } from "./fetchUsers.js";
// import { FormEditor, body, openContainer, latestIndex } from "./index.js";

async function apiCall() {
    try {
        const users = await displayUsers();
        console.log(users);
        if (users) {
            newArray(users);
        }
             
    } catch (error) {
        console.error('Error initialising', error);
        
    }
}

function newArray(allDUsers){
    
    allDUsers.forEach((item, index) => {
        console.log(item.displayName);
        
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
        emailPTwo.textContent = `${item.customSecurityAttributes.additionalUserAttributes.Grade}`;

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
        let text = item.givenName;
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
        mobile.textContent = item.businessPhones[index];

        deleted.append(deletedI);
        spanTwo.append(mobile);
        tdGroupThree.append(spanOne, spanTwo);
        tr.append(tdGroupOne, tdGroupTwo, tdGroupThree);
        body.append(tr);

        







    })
    
}

export { apiCall }