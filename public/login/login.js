const newUserButton = document.getElementById('new-user-button');
newUserButton.addEventListener('click', newUserHandling);


const forgetPasswordButton = document.getElementById('forgot-password-button');
forgetPasswordButton.addEventListener('click', forgetPasswordHandling);



function newUserHandling(e){
    //redirecting to signup page
    const destinationURL = "../signup/signup.html";
    // Redirect to the destination page
    window.location.href = destinationURL;     
}


function forgetPasswordHandling(e){
    //redirecting to signup page
    const destinationURL = "../forgetpassword/ForgetPassword.html";
    // Redirect to the destination page
    window.location.href = destinationURL;     
}

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', formSubmitHandler);

function formSubmitHandler(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === null || password === null) {
        alert('Please fill in all fields with valid data.');
    } else {
        console.log(email);
        console.log(password);
        loginUser(email, password);
        // Reset the form
        e.target.reset();
    }

}

function loginUser(email, password){
    user = {email, password};
    loginUserOnServer(user);
}

function loginUserOnServer(user)
{
    console.log('hiiii@@@@');
    
    axios.post("http://54.91.70.145:8000/user/login", user)
    .then(response =>{
        console.log(response);
        console.log('#########');
        
        if(response.data.success === true){
            // Assume you receive a successful response from the backend
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isPremiumUser', response.data.user.isPremiumUser);
            console.log(`user is a premium user ::: ${response.data.user.isPremiumUser}`)
            window.location.href = "../expense/ExpenseTracker.html"; 
        }
        else{
            alert(response.data.message);  
        }
    })
    .catch(err =>{
        alert('Something went wrong');
        console.log(err);
    })
}