import { apiCall } from "./allUsers.js";
import { displayUsers } from "./fetchUsers_.js";
import { paginate } from "./paginate.js";
import { search } from "./search.js";


displayUsers();
search();



let body = document.getElementById('table-body');
let formContainer = document.getElementById('form-container');
let form = document.getElementById('form');
let userName = document.getElementById('naming');
let userEmail = document.getElementById('emailing');
let statusGet = document.getElementById('status');
let btnB = document.getElementById('my-btn');
let btnClick = document.getElementById('my-btn-button');

//global variables
const originalText = btnB.textContent;
let latestIndex;


function closeContainer(){

    formContainer.classList.remove('form-container');
    form.classList.remove('form');

    formContainer.classList.add('form-display');
    form.classList.add('form-display');

    form.reset();

    userName.readOnly = false;
    userEmail.readOnly = false;
    statusGet.readOnly = false;
    btnB.classList.remove('my-btn-no');
    btnB.classList.add('my-btn');
    btnClick.classList.remove('my-btn-button-no');
    btnClick.classList.add('my-btn-button');
    btnB.style.display = '';
}

function openContainer(index){

    userName.value = myArray[index].name;
    userEmail.value = myArray[index].email;
    statusGet.value = myArray[index].active;
    userName.readOnly = true;
    userEmail.readOnly = true;
    statusGet.readOnly = true;
    btnB.style.display = 'none';

    formContainer.classList.remove('form-display');
    form.classList.remove('form-display');

    formContainer.classList.add('form-container');
    form.classList.add('form');
}
class FormEditor {
    constructor(item) {
        this.currentIndex = item;
        // this.showForm();
    }

    showForm() {
        formContainer.classList.remove('form-display');
        form.classList.remove('form-display');

        formContainer.classList.add('form-container');
        form.classList.add('form');

        userName.value = myArray[this.currentIndex].name;
        userEmail.value = myArray[this.currentIndex].email;
        statusGet.value = myArray[this.currentIndex].active;
    }

    nowEdit() {
        const obj = {
            name: userName.value,
            email: userEmail.value,
            active: statusGet.value,
            profile: myArray[this.currentIndex].profile,
            level: myArray[this.currentIndex].level,
            role: myArray[this.currentIndex].role
        };

        myArray[this.currentIndex] = obj;
        body.innerHTML = ``;
        displayUI();
        latestIndex = 0;

        formContainer.classList.remove('form-container');
        form.classList.remove('form');
        formContainer.classList.add('form-display');
        form.classList.add('form-display');
    }

    showDelete(){
        console.log(myArray[this.currentIndex]);
        
        
        formContainer.classList.remove('form-display');
        form.classList.remove('form-display');

        formContainer.classList.add('form-container');
        form.classList.add('form');

        userName.value = myArray[this.currentIndex].name;
        userEmail.value = myArray[this.currentIndex].email;
        statusGet.value = myArray[this.currentIndex].active;

        userName.readOnly = true;
        userEmail.readOnly = true;
        statusGet.readOnly = true;
        btnB.classList.remove('my-btn');
        btnB.classList.add('my-btn-no');
        btnClick.classList.remove('my-btn-button');
        btnClick.classList.add('my-btn-button-no');
        
        
    }

    nowDelete(){
        console.log(btnB.textContent);
        myArray.forEach((item, index) => {

            if (this.currentIndex === index) {

                myArray.splice(index, 1);
                console.log(myArray);
                
                body.innerHTML = ``;
                displayUI();
                latestIndex = 0;
                formContainer.classList.remove('form-container');
                form.classList.remove('form');
                formContainer.classList.add('form-display');
                form.classList.add('form-display');
                btnB.classList.remove('delete-udate');
                
                

                btnB.classList.remove('my-btn-no');
                btnB.classList.add('my-btn');
                btnClick.classList.remove('my-btn-button-no');
                btnClick.classList.add('my-btn-button');
                userName.readOnly = false;
                userEmail.readOnly = false;
                statusGet.readOnly = false;
            }
        })
    }
}


btnClick.addEventListener('click',(e) => {
    e.preventDefault();
   
        let deleteItem = new FormEditor(latestIndex);
        deleteItem.nowDelete();
    

});


form.addEventListener('submit', (event) =>{
    event.preventDefault();
    let editor = new FormEditor(latestIndex);
    editor.nowEdit();
});



let myArray = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        profile: 'assets/1.jpg',
        role: 'Software Engineer',
        level: 'Senior',
        active: 'active'
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        profile: 'assets/2.jpg',
        role: 'Project Manager',
        level: 'Lead',
        active: 'vacation'
    },
    {
        name: 'David Lee',
        email: 'david.lee@example.com',
        profile: 'assets/3.jpg',
        role: 'Data Analyst',
        level: 'Junior',
        active: 'on-leave'
    },
    {
        name: 'Jimmy Jat',
        email: 'Jimmy.Jat@example.com',
        profile: 'assets/4.jpg',
        role: 'Site reliability Engineer',
        level: 'Senior',
        active: 'active'
    },
    {
        name: 'Shaun Wilbrow',
        email: 'Shaun.Wilbrow@example.com',
        profile: 'assets/5.jpg',
        role: 'Backend Engineer',
        level: 'Lead',
        active: 'vacation'
    },
    {
        name: 'James Rollings',
        email: 'james.rollings@example.com',
        profile: 'assets/6.jpg',
        role: 'Application Analyst',
        level: 'Junior',
        active: 'on-leave'
    }
]



function displayUII(){
    myArray.forEach((item, index) => {
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
        img.setAttribute('src',`${item.profile}`);
        imgDiv.append(img);

        //name-group
        let nameGroup = document.createElement('div');
        nameGroup.classList.add('name-group');
        nameGroup.setAttribute('id','name-group');

        let nameDirect = document.createElement('div');
        nameDirect.classList.add('name-direct');
        nameDirect.setAttribute('id','name-direct');
        let h2GroupOne = document.createElement('h2');
        h2GroupOne.textContent = `${item.name}`;

        let emailOne = document.createElement('div');
        emailOne.classList.add('email');
        emailOne.setAttribute('id','email');
        let emailP = document.createElement('p');
        emailP.textContent = `${item.email}`;

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
        h2GroupTwo.textContent = `${item.role}`;

        let emailTwo = document.createElement('div');
        emailTwo.classList.add('email');
        emailTwo.setAttribute('id','email');
        let emailPTwo = document.createElement('p');
        emailPTwo.textContent = `${item.level}`;

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
        let text = item.active;
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
        })
        deleted.append(deletedI);
        spanTwo.append(eye, edit, deleted);
        tdGroupThree.append(spanOne, spanTwo);
        tr.append(tdGroupOne, tdGroupTwo, tdGroupThree);
        body.append(tr);

        







    })
    
}

//displayUI();



export { FormEditor, body, openContainer, latestIndex }