const input = document.querySelectorAll('#inputField');
const toast = document.querySelector('#toast');
const toastMsg = document.querySelector('#toastMsg');
const errorMsg = document.querySelector('#errorMsg');

const form = document.querySelector('#admissionForm');

const length = input.length


/*form.addEventListener('submit', (event) => {

    input.forEach((inputField) => {
        if(inputField.value.trim() === '' && inputField.value.trim.length < length) {

            //event.preventDefault(); // Prevent form submission
            inputField.style.border = '1px solid red';
            errorMsg.style.display = 'block';
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);

            console.log(inputField.value.trim())

        } else if(inputField.value.trim() != ''){
            //event.preventDefault(); // Prevent form submission
            inputField.style.border = '1px solid green';
        }
        if(inputField.value.trim() != '' && inputField.value.trim.length == length){

            inputField.style.border = '1px solid green';
            toastMsg.style.display = 'block';
            setTimeout(() => {
                toastMsg.style.display = 'none';
            }, 5000);

            console.log(inputField.value)
        }
    })
});*/

