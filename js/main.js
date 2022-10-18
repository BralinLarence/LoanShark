let $ = function(id) {
    return document.getElementById(id);
}


const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});


//Get values
function getValue() {
    
    //Show Table
    $("loanPaymentsTable").classList.remove("invisible", "d-none");
    
    //Get user input 
    let loanAmount = parseFloat($("loanAmount").value);
    let terms = parseFloat($("terms").value);
    let interestRate = parseFloat($("interestRate").value);

    //Check if values are numbers
    if(Number.isInteger(loanAmount) && Number.isInteger(terms) && Number.isInteger(interestRate))
    {
        //Call loan calculator function -- return the array
        let loanData = calculateLoan(loanAmount, terms, interestRate);
        //Call display function
        displayLoanData(loanData, loanAmount);

    }
    else
    {
        alert("Only enter numbers!");
    }


}

//Calaculate loan payments
function calculateLoan(loanAmount, terms, interestRate) {

    //Loan results object and loan data array
    let loanData = [];

    //Variables
    let balance = loanAmount;
    let principalPayment = 0;
    let interestPayment = 0;
    let totalInterest = 0;
  
    //Monthly calculations
    let monthlyPayment = parseFloat((loanAmount * (interestRate/1200)) / (1 - (1 + (interestRate / 1200)) ** (-Math.abs(terms))));


    for(let i = 0; i < terms; i++) {
    
        // Calculate loan data 
        interestPayment = parseFloat(balance * (interestRate / 1200));
        principalPayment = parseFloat(monthlyPayment - interestPayment);
        totalInterest = parseFloat(totalInterest + interestPayment);
        totalInterest = parseFloat(totalInterest);
        balance -= principalPayment;
        balance = Math.abs(parseFloat(balance));
        //monthlyPayment = monthlyPayment;

        if(i == terms - 1) {
            if(balance > 0){
                monthlyPayment = parseFloat(monthlyPayment + balance);
                // monthlyPayment = monthlyPayment.toFixed(2);
                balance = 0;
            }
        }

        //Assign the values to the variables to the loan results object

        let loanResults = {
            month: i + 1,
            monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
            principalPayment: parseFloat(principalPayment.toFixed(2)),
            interestPayment: parseFloat(interestPayment.toFixed(2)),
            totalInterest: parseFloat(totalInterest.toFixed(2)),
            balance: parseFloat(balance.toFixed(2))
        }

        //push the object into the loan data array. 
        loanData.push(loanResults);
    }

    return loanData; 
}


//Display data
function displayLoanData(loanData, loanAmount) {

    let tableBody = $("loanPaymentTableBody");
    let templateRow = $("loanTemplateRow");

    loanData.forEach((i) => {
        let tableRow = document.importNode(templateRow.content, true);
        let rowCols = tableRow.querySelectorAll("td");
        
        rowCols[0].textContent = i.month;
        rowCols[1].textContent = usd.format(i.monthlyPayment);
        rowCols[2].textContent = usd.format(i.principalPayment);
        rowCols[3].textContent = usd.format(i.interestPayment);
        rowCols[4].textContent = usd.format(i.totalInterest);
        rowCols[5].textContent = usd.format(i.balance);

        tableBody.appendChild(tableRow);
    })

    //Total Interest
    totalInterest = loanData[loanData.length -1].totalInterest;
    

    // Total Cost
    let totalCostAmt = $("totalCostAmt");
    totalCostAmt = loanAmount + parseFloat(totalInterest);
    $("totalCostAmt").innerHTML = usd.format(totalCostAmt);
    $("totalInterestAmt").innerHTML = usd.format(totalInterest);
    
    //Total Principle
    $("totalPrincipalAmt").innerHTML = usd.format(loanAmount);

    // Monthly Payment
    monthlyPayment = parseFloat(loanData[0].monthlyPayment);
    $("monthlyPayment").innerHTML = usd.format(monthlyPayment);
}


function clearForm() {
    $("loanPaymentsTable").classList.add("invisible", "d-none");

    $("loanAmount").value = 25000.00;
    $("terms").value = 60;
    $("interestRate").value = 5;

    $("totalCostAmt").innerHTML = usd.format(28306.85);
    $("totalInterestAmt").innerHTML = usd.format(3306.85);
    $("totalPrincipalAmt").innerHTML = usd.format(25000.00);
}