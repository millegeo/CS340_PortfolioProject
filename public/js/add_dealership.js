// Get the objects we need to modify
let addDealershipForm = document.getElementById('add-dealership-form-ajax');

// Modify the objects we need
addDealershipForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDealershipName = document.getElementById("input-dealership_name");
    let inputDealershipEmail = document.getElementById("input-dealership_email");
    let inputDealershipPhone = document.getElementById("input-dealership_phone");

    // Get the values from the form fields
    let dealershipNameValue = inputDealershipName.value;
    let dealershipEmailValue = inputDealershipEmail.value;
    let dealershipPhoneValue = inputDealershipPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        dealership_name: dealershipNameValue,
        dealership_email: dealershipEmailValue,
        dealership_phone: dealershipPhoneValue,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dealership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDealershipName.value = '';
            inputDealershipEmail.value = '';
            inputDealershipPhone.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response

    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Dealerships

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("dealerships-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dealershipNameCell = document.createElement("TD");
    let dealershipEmailCell = document.createElement("TD");
    let dealershipPhoneCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.dealership_id;
    dealershipNameCell.innerText = newRow.dealership_name;
    dealershipEmailCell.innerText = newRow.dealership_email;
    dealershipPhoneCell.innerText = newRow.dealership_phone;

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Delete";
    deleteCell.appendChild(deleteButton);
    deleteCell.onclick = function(){
        deleteCar(newRow.dealership_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dealershipNameCell);
    row.appendChild(dealershipEmailCell);
    row.appendChild(dealershipPhoneCell);
    row.appendChild(deleteCell);

    //Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.dealership_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}