console.log('app started');


let expenses = [];
let leaderboardData;
let downloadableExpenseFiles;
let dailyExpenses = [];
let weeklyExpenses = [];
let monthlyExpenses = [];
let totalPages;
let totalExpenseSum;


// Define a variable to track the current page
let currentPage = 1;

const token = localStorage.getItem('token');
let isPremiumUser = localStorage.getItem('isPremiumUser');
console.log(isPremiumUser);


let itemsPerPage = Number(localStorage.getItem('itemsPerPage')) || 3; // Number of expenses per page
console.log('items per page are: ');
console.log(itemsPerPage);

getExpenses();




// Function to add an expense to the list
function addExpense(amount, description, category) {
    const newExpense = { 'amount': amount, 'description': description, 'category': category };
    saveExpenseToServer(newExpense);
}

// Function to save expenses to Crud Crud server 
function saveExpenseToServer(expense) {
    axios.post("http://54.91.70.145:8000/expense/add-expense", expense, { headers: { "Authorization": token } })
        .then((response) => {
            // Display the updated list
            location.reload();
            getExpenses();
            console.log(response);
        })
        .catch((error) => console.log(error));
}


function deleteExpenseFromServer(expenseID) {
    axios.delete(`http://54.91.70.145:8000/expense/delete-expense/${expenseID}`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response);
            location.reload();
            getExpenses();

        })
        .catch((error) => console.log(error));
}


















//Handle Add Expense

const expenseForm = document.getElementById('add-expense-button');
expenseForm.addEventListener('click', handleExpenseSubmission);



function handleExpenseSubmission(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const description = document.getElementById('expenseDescription').value;
    const category = document.getElementById('expenseCategory').value;

    if (!isNaN(amount) && description && category) {
        addExpense(amount, description, category);
        e.target.reset();
    } else {
        alert('Please fill in all fields with valid data.');
    }
}

















//Buy Premium Razorpay API Integration

const buyPremiumButton = document.getElementById('buy-premium-button');
buyPremiumButton.addEventListener('click', handleBuyPremium);


async function handleBuyPremium(e) {
    e.preventDefault();
    let response = await axios.get("http://54.91.70.145:8000/purchase/premiummembership", { headers: { "Authorization": token } });
    console.log('hii everyone');
    console.log(response);

    var options = {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id, //This is a sample Order ID for 1 time payment. Pass the `id` obtained in the response of Step 1

        //this handler function is a callback function which will handle the success payments
        "handler": async function (razorpayResponse) {
            const response = await axios.post("http://54.91.70.145:8000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: razorpayResponse.razorpay_payment_id
            }, { headers: { "Authorization": token } });

            console.log('resoponse ....');
            console.log(response);

            localStorage.setItem('isPremiumUser', response.data.isPremiumUser);
            isPremiumUser = 'true';

            alert('you are a premium user now');
            updateButtons();
            //location.reload();
        }
    };


    console.log('$$$$$$$$$$$$');
    
    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        //in case your payment fails
        console.log(response);
    });
}



















updateButtons();

var dailyExpensesButton = document.getElementById("daily-expenses-button");
var weeklyExpensesButton = document.getElementById("weekly-expenses-button");
var monthlyExpensesButton = document.getElementById("monthly-expenses-button");

function updateButtons() {
    var buyPremiumButton = document.getElementById('buy-premium-button');
    var expenseList = document.getElementById("expenseList");
    var maindiv = document.getElementById('maindiv');
    console.log(maindiv);

    if (isPremiumUser === 'true') {

        var premiumUserMessage = document.createElement("button");
        premiumUserMessage.id = "premium-user";
        premiumUserMessage.className = "btn btn-primary";
        premiumUserMessage.innerText = "You are a Premium User";
        maindiv.insertBefore(premiumUserMessage, expenseList);


        var showLeaderboardButton = document.createElement("button");
        showLeaderboardButton.id = "show-leaderboard-button";
        showLeaderboardButton.className = "btn btn-primary";
        showLeaderboardButton.innerText = "Show Leaderboard";
        showLeaderboardButton.addEventListener("click", showLeaderboard);
        showLeaderboardButton.addEventListener("click", function (e) {
            e.preventDefault();
            removeExpensesButtons();
            removeExpensesSumButton();
        });
        maindiv.insertBefore(showLeaderboardButton, expenseList);


        var showExpensesButton = document.createElement("button");
        showExpensesButton.id = "show-expenses-button";
        showExpensesButton.className = "btn btn-primary";
        showExpensesButton.innerText = "Show Expenses";
        showExpensesButton.addEventListener("click", function (e) {
            e.preventDefault();
            removeExpensesSumButton();
            expenseFilter();
        });
        maindiv.insertBefore(showExpensesButton, expenseList);


        var downloadExpensesButton = document.createElement("button");
        downloadExpensesButton.id = "download-expense-button";
        downloadExpensesButton.className = "btn btn-primary";
        downloadExpensesButton.innerText = "Download Expenses";
        downloadExpensesButton.addEventListener("click", downloadFile);
        downloadExpensesButton.addEventListener("click", function (e) {
            e.preventDefault();
            removeExpensesSumButton();
            removeExpensesButtons();
        });
        maindiv.insertBefore(downloadExpensesButton, expenseList);


        buyPremiumButton.parentNode.removeChild(buyPremiumButton);
    }




    const container = document.createElement('div');
    container.id = 'itemsPerPageFieldContainer';

    // Create a text field input element
    const itemsPerPageField = document.createElement('input');
    itemsPerPageField.type = 'number'
    itemsPerPageField.id = 'itemsPerPageField';
    itemsPerPageField.name = 'Expenses Per Page';
    // Add a blur event listener to read the value when the user clicks elsewhere
    itemsPerPageField.addEventListener('blur', function (e) {
        e.preventDefault();
        const inputValue = itemsPerPageField.value;
        console.log('Input value changed: ' + inputValue);
        localStorage.setItem('itemsPerPage', inputValue);
        itemsPerPage = inputValue;
        currentPage = 1;
        removeExpensesSumButton();
        getExpenses();

        // You can use inputValue as needed here
    });


    // Create a button element
    var itemsPerPageButton = document.createElement("button");
    itemsPerPageButton.id = "itemsPerPage-button";
    itemsPerPageButton.className = "btn btn-info";
    itemsPerPageButton.innerText = "Expenses To Be Displayed Per Page";

    // Append the text field and button to the container in the desired order
    container.appendChild(itemsPerPageButton);
    container.appendChild(itemsPerPageField);

    maindiv.insertBefore(container, expenseList);

}



function removeExpensesButtons() {
    if (dailyExpensesButton && dailyExpensesButton.parentNode) {
        dailyExpensesButton.parentNode.removeChild(dailyExpensesButton);
    }

    if (weeklyExpensesButton && weeklyExpensesButton.parentNode) {
        weeklyExpensesButton.parentNode.removeChild(weeklyExpensesButton);
    }

    if (monthlyExpensesButton && monthlyExpensesButton.parentNode) {
        monthlyExpensesButton.parentNode.removeChild(monthlyExpensesButton);
    }
}




var dailyExpensesButton = document.createElement("button");
dailyExpensesButton.id = "daily-expenses-button";
dailyExpensesButton.className = "btn btn-primary";
dailyExpensesButton.innerText = "Daily Expenses";
dailyExpensesButton.addEventListener("click", ()=>{
    currentPage = 1;
    removeExpensesSumButton();
    getDailyExpenses();
});



var weeklyExpensesButton = document.createElement("button");
weeklyExpensesButton.id = "weekly-expenses-button";
weeklyExpensesButton.className = "btn btn-primary";
weeklyExpensesButton.innerText = "Weekly Expenses";
weeklyExpensesButton.addEventListener("click", ()=>{
    currentPage = 1;
    removeExpensesSumButton();
    getWeeklyExpenses();
});



var monthlyExpensesButton = document.createElement("button");
monthlyExpensesButton.id = "monthly-expenses-button";
monthlyExpensesButton.className = "btn btn-primary";
monthlyExpensesButton.innerText = "Monthly Expenses";
monthlyExpensesButton.addEventListener("click", ()=>{
    currentPage = 1;
    removeExpensesSumButton();
    getMonthlyExpenses();
});




function expenseFilter() {
    getExpenses();

    var expenseList = document.getElementById("expenseList");
    var maindiv = document.getElementById('maindiv');
    //Daily weekly and monthly buttons
    maindiv.insertBefore(dailyExpensesButton, expenseList);
    maindiv.insertBefore(weeklyExpensesButton, expenseList);
    maindiv.insertBefore(monthlyExpensesButton, expenseList);

}




function removeExpensesSumButton() {
    const totalExpenses = document.getElementById('total-expense-button');
    if(totalExpenses && totalExpenses.parentNode){
        totalExpenses.parentNode.removeChild(totalExpenses);
    }
}


















//get Daily Expenses

function getExpenses() {
    //fetching the stored token from local storage
    let storedExpenses = axios.get(`http://54.91.70.145:8000/expense/get-expenses/${currentPage}/${itemsPerPage}`, { headers: { "Authorization": token } });

    storedExpenses
        .then((response) => {
            console.log('logging response@@@@@@@');
            console.log(response);
        
            expenses = [...response.data.expenses] || [];
          
            totalPages = Math.ceil((response.data.totalItemsAndSum[0].rowCount || 1) / itemsPerPage);
            
            totalExpenseSum = response.data.totalItemsAndSum[0].totalAmount;
            if(totalExpenseSum === null){
                totalExpenseSum = 0;
            }

            displayExpenses();
        })
        .catch((error) => console.log(error));
}





function displayExpenses() {
    console.log('displaying expenses array : ');
    console.log(expenses);

    const expenseList = document.getElementById('expenseList');
    var maindiv = document.getElementById('maindiv');
    expenseList.innerHTML = '';

    // Get the paginationButtons element
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';


    //to display total expenses
    const totalExpenses = document.createElement('button');
    totalExpenses.id = 'total-expense-button';
    totalExpenses.className = "btn btn-info";
    totalExpenses.textContent = `TOTAL EXPENSE : ${totalExpenseSum} Rs. `;

    maindiv.insertBefore(totalExpenses, paginationButtons);
    



    // Create buttons for Previous Page, Current Page, and Next Page
    const prevPageButton = document.createElement('button');
    prevPageButton.id = 'previous-page-button';
    prevPageButton.className = "btn btn-primary";
    prevPageButton.textContent = 'Previous Page';
    prevPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        previousPageLoad();
    });
    

    const currentPageButton = document.createElement('button');
    currentPageButton.id = 'current-page-button';
    currentPageButton.className = "btn btn-primary";
    currentPageButton.textContent = `Page ${currentPage}`;

    const nextPageButton = document.createElement('button');
    nextPageButton.id = 'next-page-button';
    nextPageButton.className = "btn btn-primary";
    nextPageButton.textContent = 'Next Page';
    nextPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        nextPageLoad();
    });



    paginationButtons.appendChild(prevPageButton);
    paginationButtons.appendChild(currentPageButton);
    paginationButtons.appendChild(nextPageButton);


    if (currentPage === 1) {
        const prevPageButton = document.getElementById("previous-page-button");
        //prevPageButton.style.display = "none";  
        //prevPageButton.style.backgroundColor = 'white';
        prevPageButton.disabled = true;

    }

    if (currentPage === totalPages) {
        const nextPageButton = document.getElementById("next-page-button");
        //nextPageButton.style.display = "none";
        nextPageButton.disabled = true;
    }

    expenses.forEach((expense, index) => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'alert alert-info';

        expenseElement.innerHTML = `
            <p><strong>Amount:</strong> ${expense.amount} Rs</p>
            <p><strong>Description:</strong> ${expense.description}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger delete-edit-buttons';
        deleteButton.textContent = 'Delete Expense';
        deleteButton.addEventListener('click', () => {
            deleteExpenseFromServer(expense.id);
            getExpenses();
        });

        expenseElement.appendChild(deleteButton);

        expenseList.appendChild(expenseElement);
    });
}



function nextPageLoad() {
    if (currentPage < totalPages) {
        currentPage++;
        getExpenses(); // Refresh the display with the new page
    }
}

function previousPageLoad() {
    if (currentPage > 1) {
        currentPage--;
        getExpenses(); // Refresh the display with the new page
    }
}




















//get Daily Expenses

function getDailyExpenses() {
    //currentPage = 1;
    //fetching the stored token from local storage
    let storedExpenses = axios.get(`http://54.91.70.145:8000/expense/get-daily-expenses/${currentPage}/${itemsPerPage}`, { headers: { "Authorization": token } });


    storedExpenses
        .then((response) => {
            console.log(response);
            dailyExpenses = [...response.data.expenses] || [];
            totalPages = Math.ceil((response.data.totalItemsAndSum[0].rowCount || 1) / itemsPerPage);
            totalExpenseSum = response.data.totalItemsAndSum[0].totalAmount;
            if(totalExpenseSum === null){
                totalExpenseSum = 0;
            }
            console.log('$%$%$%$%$%$%$%$%');
            console.log(totalExpenseSum);


            // Display existing expenses on page load
            displayDailyExpenses();
        })
        .catch((error) => console.log(error));



}


function displayDailyExpenses() {

    console.log('displaying expenses array : ');
    console.log(expenses);

    const expenseList = document.getElementById('expenseList');
    var maindiv = document.getElementById('maindiv');
    expenseList.innerHTML = '';

    // Get the paginationButtons element
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';


    //to display total expenses
    const totalExpenses = document.createElement('button');
    totalExpenses.id = 'total-expense-button';
    totalExpenses.className = "btn btn-info";
    totalExpenses.textContent = `TOTAL EXPENSE : ${totalExpenseSum} Rs. `;

    maindiv.insertBefore(totalExpenses, paginationButtons);

    // Create buttons for Previous Page, Current Page, and Next Page
    const prevPageButton = document.createElement('button');
    prevPageButton.id = 'previous-page-button';
    prevPageButton.className = "btn btn-primary";
    prevPageButton.textContent = 'Previous Page';
    prevPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        previousPageLoadDaily();
    });

    const currentPageButton = document.createElement('button');
    currentPageButton.id = 'current-page-button';
    currentPageButton.className = "btn btn-primary";
    currentPageButton.textContent = `Page ${currentPage}`;

    const nextPageButton = document.createElement('button');
    nextPageButton.id = 'next-page-button';
    nextPageButton.className = "btn btn-primary";
    nextPageButton.textContent = 'Next Page';
    nextPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        nextPageLoadDaily();
    });



    paginationButtons.appendChild(prevPageButton);
    paginationButtons.appendChild(currentPageButton);
    paginationButtons.appendChild(nextPageButton);


    if (currentPage === 1) {
        const prevPageButton = document.getElementById("previous-page-button");
        //prevPageButton.style.display = "none";  
        //prevPageButton.style.backgroundColor = 'white';
        prevPageButton.disabled = true;

    }

    if (currentPage === totalPages) {
        const nextPageButton = document.getElementById("next-page-button");
        //nextPageButton.style.display = "none";
        nextPageButton.disabled = true;
    }

    dailyExpenses.forEach((expense, index) => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'alert alert-info';

        expenseElement.innerHTML = `
            <p><strong>Amount:</strong> ${expense.amount} Rs</p>
            <p><strong>Description:</strong> ${expense.description}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger delete-edit-buttons';
        deleteButton.textContent = 'Delete Expense';
        deleteButton.addEventListener('click', () => {
            deleteExpenseFromServer(expense.id);
            //getDailyExpenses();
        });

        expenseElement.appendChild(deleteButton);

        expenseList.appendChild(expenseElement);

    });
}


function nextPageLoadDaily() {
    if (currentPage < totalPages) {
        currentPage++;
        getDailyExpenses(); // Refresh the display with the new page
    }
}

function previousPageLoadDaily() {
    if (currentPage > 1) {
        currentPage--;
        getDailyExpenses(); // Refresh the display with the new page
    }
}





























//leaderboard functionality:

function showLeaderboard() {
    axios.get("http://54.91.70.145:8000/premium/show-leaderboard", { headers: { "Authorization": token } })


        .then((response) => {
            console.log(response);
            leaderboardData = [...response.data.leaderboardData] || [];
            displayLeaderboard();
        })
        .catch((error) => console.log(error));

}


function displayLeaderboard() {
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    console.log('displaying expenses array : ');
    console.log(expenses);

    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    leaderboardData.forEach((user, index) => {
        const userElement = document.createElement('div');
        userElement.className = 'alert alert-info';

        if (user.totalExpense === null) {
            userElement.innerHTML = `
            <p><strong>Name : </strong> ${user.name}</p>
            <p><strong>Total Expense : </strong> 0 Rs</p>
        `;
        }
        else {
            userElement.innerHTML = `
            <p><strong>Name : </strong> ${user.name}</p>
            <p><strong>Total Expense : </strong> ${user.totalExpense} Rs</p>
        `;
        }

        expenseList.appendChild(userElement);
    });
}
































//Download Expenses:


function downloadFile() {
    console.log('%%%%%%%%%%%%%%%');
    axios.get(`http://54.91.70.145:8000/expense/download`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response);
            if (response.status === 201) {
                getDownloadableExpenseFiles();
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            console.log(err);
        });
}



function getDownloadableExpenseFiles() {
    //fetching the stored token from local storage
    console.log('printing token in getDownloadableExpenseFiles function');
    console.log(token);
    let storedExpenseFiles = axios.get("http://54.91.70.145:8000/file/get-downloadable-expense-files", { headers: { "Authorization": token } });

    console.log(storedExpenseFiles);
    storedExpenseFiles
        .then((response) => {
            console.log(storedExpenseFiles);
            console.log('$$$$printing getDownloadableExpenseFiles function response')
            console.log(response);
            console.log('$$$$printing getDownloadableExpenseFiles function response')
            downloadableExpenseFiles = [...response.data.files] || [];
            displayDownloadableExpenseFiles();

        })
        .catch((error) => console.log(error));
}


function displayDownloadableExpenseFiles() {

    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';


    console.log('displaying dowanloadable files array : ');
    console.log(downloadableExpenseFiles);

    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    downloadableExpenseFiles.forEach((file, index) => {
        const fileElement = document.createElement('div');
        fileElement.className = 'alert alert-info';

        fileElement.innerHTML = `
            <p><strong>ID:</strong> ${file.id}</p>
            <p><strong>Date:</strong> ${file.createdAt}</p>
        `;

        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-file-button';
        downloadButton.className = 'btn btn-success';
        downloadButton.textContent = 'Download Expense Details';
        downloadButton.addEventListener("click", function (e) {
            e.preventDefault();
            download(file.fileURL, `Expense/${new Date()}`);
        });

        const deleteFileButton = document.createElement('button');
        deleteFileButton.id = 'delete-file-button';
        deleteFileButton.className = 'btn btn-danger';
        deleteFileButton.textContent = 'Delete File';
        deleteFileButton.addEventListener("click", function (e) {
            e.preventDefault();
            deleteExpenseFile(file.id);
        });

        fileElement.appendChild(downloadButton);
        fileElement.appendChild(deleteFileButton);

        expenseList.appendChild(fileElement);
    });
}




function download(fileURL, filename) {

    axios.get(fileURL, { responseType: 'blob' })     // Set the responseType to 'blob'

        .then((response) => {
            // Create a blob URL from the response
            const blob = new Blob([response.data]);
            const blobUrl = window.URL.createObjectURL(blob);

            // Create an invisible anchor element to trigger the download
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;  // Specify the filename

            // Trigger the download and then clean up
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        })
        .catch((err) => {
            console.log(err);
        });
}


function deleteExpenseFile(fileID) {
    axios.delete(`http://54.91.70.145:8000/file/delete-file/${fileID}`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response);
            //location.reload();
            getDownloadableExpenseFiles();

        })
        .catch((error) => console.log(error));
}













































//Weekly and monthly feature:


function getWeeklyExpenses() {
    //currentPage = 1;
    //fetching the stored token from local storage
    let storedExpenses = axios.get(`http://54.91.70.145:8000/expense/get-weekly-expenses/${currentPage}/${itemsPerPage}`, { headers: { "Authorization": token } });

    storedExpenses
        .then((response) => {
            console.log(response);
            weeklyExpenses = [...response.data.expenses] || [];
            totalPages = Math.ceil((response.data.totalItemsAndSum[0].rowCount || 1) / itemsPerPage);
            totalExpenseSum = response.data.totalItemsAndSum[0].totalAmount;
            if(totalExpenseSum === null){
                totalExpenseSum = 0;
            }
            // Display existing expenses on page load
            displayWeeklyExpenses();
        })
        .catch((error) => console.log(error));

}


function displayWeeklyExpenses() {

    
    console.log('displaying expenses array : ');
    console.log(expenses);

    const expenseList = document.getElementById('expenseList');
    var maindiv = document.getElementById('maindiv');
    expenseList.innerHTML = '';


    // Get the paginationButtons element
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';


    //to display total expenses
    const totalExpenses = document.createElement('button');
    totalExpenses.id = 'total-expense-button';
    totalExpenses.className = "btn btn-info";
    totalExpenses.textContent = `TOTAL EXPENSE : ${totalExpenseSum} Rs. `;

    maindiv.insertBefore(totalExpenses, paginationButtons);

    // Create buttons for Previous Page, Current Page, and Next Page
    const prevPageButton = document.createElement('button');
    prevPageButton.id = 'previous-page-button';
    prevPageButton.className = "btn btn-primary";
    prevPageButton.textContent = 'Previous Page';
    prevPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        previousPageLoadWeekly();
    });
    

    const currentPageButton = document.createElement('button');
    currentPageButton.id = 'current-page-button';
    currentPageButton.className = "btn btn-primary";
    currentPageButton.textContent = `Page ${currentPage}`;

    const nextPageButton = document.createElement('button');
    nextPageButton.id = 'next-page-button';
    nextPageButton.className = "btn btn-primary";
    nextPageButton.textContent = 'Next Page';
    nextPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        nextPageLoadWeekly();
    });



    paginationButtons.appendChild(prevPageButton);
    paginationButtons.appendChild(currentPageButton);
    paginationButtons.appendChild(nextPageButton);


    if (currentPage === 1) {
        const prevPageButton = document.getElementById("previous-page-button");
        //prevPageButton.style.display = "none";  
        //prevPageButton.style.backgroundColor = 'white';
        prevPageButton.disabled = true;

    }

    if (currentPage === totalPages) {
        const nextPageButton = document.getElementById("next-page-button");
        //nextPageButton.style.display = "none";
        nextPageButton.disabled = true;
    }

    weeklyExpenses.forEach((expense, index) => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'alert alert-info';

        expenseElement.innerHTML = `
            <p><strong>Amount:</strong> ${expense.amount} Rs</p>
            <p><strong>Description:</strong> ${expense.description}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger delete-edit-buttons';
        deleteButton.textContent = 'Delete Expense';
        deleteButton.addEventListener('click', () => {
            deleteExpenseFromServer(expense.id);
            //getWeeklyExpenses();
        });

        expenseElement.appendChild(deleteButton);

        expenseList.appendChild(expenseElement);
    });
}


function nextPageLoadWeekly() {
    if (currentPage < totalPages) {
        currentPage++;
        getWeeklyExpenses(); // Refresh the display with the new page
    }
}

function previousPageLoadWeekly() {
    if (currentPage > 1) {
        currentPage--;
        getWeeklyExpenses(); // Refresh the display with the new page
    }
}




function getMonthlyExpenses() {
    //currentPage = 1;
    //fetching the stored token from local storage

    let storedExpenses = axios.get(`http://54.91.70.145:8000/expense/get-monthly-expenses/${currentPage}/${itemsPerPage}`, { headers: { "Authorization": token } });

    storedExpenses
        .then((response) => {
            console.log(response);
            monthlyExpenses = [...response.data.expenses] || [];
            totalPages = Math.ceil((response.data.totalItemsAndSum[0].rowCount || 1) / itemsPerPage);
            totalExpenseSum = response.data.totalItemsAndSum[0].totalAmount;
            if(totalExpenseSum === null){
                totalExpenseSum = 0;
            }


            // Display existing expenses on page load
            displayMonthlyExpenses();
        })
        .catch((error) => console.log(error));
}

function displayMonthlyExpenses() {

  
    console.log('displaying expenses array : ');
    console.log(expenses);

    const expenseList = document.getElementById('expenseList');
    var maindiv = document.getElementById('maindiv');
    expenseList.innerHTML = '';


    // Get the paginationButtons element
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    //to display total expenses
    const totalExpenses = document.createElement('button');
    totalExpenses.id = 'total-expense-button';
    totalExpenses.className = "btn btn-info";
    totalExpenses.textContent = `TOTAL EXPENSE : ${totalExpenseSum} Rs. `;

    maindiv.insertBefore(totalExpenses, paginationButtons);

    // Create buttons for Previous Page, Current Page, and Next Page
    const prevPageButton = document.createElement('button');
    prevPageButton.id = 'previous-page-button';
    prevPageButton.className = "btn btn-primary";
    prevPageButton.textContent = 'Previous Page';
    prevPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        previousPageLoadMonthly();
    });

    const currentPageButton = document.createElement('button');
    currentPageButton.id = 'current-page-button';
    currentPageButton.className = "btn btn-primary";
    currentPageButton.textContent = `Page ${currentPage}`;

    const nextPageButton = document.createElement('button');
    nextPageButton.id = 'next-page-button';
    nextPageButton.className = "btn btn-primary";
    nextPageButton.textContent = 'Next Page';
    nextPageButton.addEventListener("click", function (e) {
        e.preventDefault();
        removeExpensesSumButton();
        nextPageLoadMonthly();
    });



    paginationButtons.appendChild(prevPageButton);
    paginationButtons.appendChild(currentPageButton);
    paginationButtons.appendChild(nextPageButton);


    if (currentPage === 1) {
        const prevPageButton = document.getElementById("previous-page-button");
        //prevPageButton.style.display = "none";  
        //prevPageButton.style.backgroundColor = 'white';
        prevPageButton.disabled = true;

    }

    if (currentPage === totalPages) {
        const nextPageButton = document.getElementById("next-page-button");
        //nextPageButton.style.display = "none";
        nextPageButton.disabled = true;
    }

    monthlyExpenses.forEach((expense, index) => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'alert alert-info';

        expenseElement.innerHTML = `
            <p><strong>Amount:</strong> ${expense.amount} Rs</p>
            <p><strong>Description:</strong> ${expense.description}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger delete-edit-buttons';
        deleteButton.textContent = 'Delete Expense';
        deleteButton.addEventListener('click', () => {
            deleteExpenseFromServer(expense.id);
            //getMonthlyExpenses();
        });

        expenseElement.appendChild(deleteButton);

        expenseList.appendChild(expenseElement);

    });
}



function nextPageLoadMonthly() {
    
    if (currentPage < totalPages) {
        currentPage++;
        getMonthlyExpenses(); // Refresh the display with the new page
    }
}

function previousPageLoadMonthly() {
    
    if (currentPage > 1) {
        currentPage--;
        getMonthlyExpenses(); // Refresh the display with the new page
    }
}
