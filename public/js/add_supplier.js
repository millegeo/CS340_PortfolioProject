// Get the objects we need to modify
let addSupplierForm = document.getElementById('add-supplier-form-ajax');

// Modify the objects we need
addSupplierForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSupplierName = document.getElementById("input-supplier_name");
    let inputSupplierEmail = document.getElementById("input-supplier_email");
    let inputSupplierPhone = document.getElementById("input-supplier_phone");

    // Get the values from the form fields
    let supplierNameValue = inputSupplierName.value;
    let SupplierEmailValue = inputSupplierEmail.value;
    let SupplierPhoneValue = inputSupplierPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        supplier_name: supplierNameValue,
        supplier_email: SupplierEmailValue,
        supplier_phone: SupplierPhoneValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-supplier-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSupplierName.value = '';
            inputSupplierEmail.value = '';
            inputSupplierPhone.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response

    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("suppliers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let supplierIDCell = document.createElement("TD");
    let supplierNameCell = document.createElement("TD");
    let supplierEmailCell = document.createElement("TD");
    let supplierPhoneCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    supplierIDCell.innerText = newRow.supplier_id;
    supplierNameCell.innerText = newRow.supplier_name;
    supplierEmailCell.innerText = newRow.supplier_email;
    supplierPhoneCell.innerText = newRow.supplier_phone;

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Delete";
    deleteCell.appendChild(deleteButton);
    deleteCell.onclick = function(){
        deleteSupplier(newRow.supplier_id);
    };

    // Add the cells to the row 
    row.appendChild(supplierIDCell);
    row.appendChild(supplierNameCell);
    row.appendChild(supplierEmailCell);
    row.appendChild(supplierPhoneCell);
    row.appendChild(deleteCell);

    //Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.supplier_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.supplier_id;
    option.value = newRow.supplier_id;
    selectMenu.add(option);
}