// Get the objects we need to modify
let addPartForm = document.getElementById('add-part-form-ajax');

// Modify the objects we need
addPartForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPartName = document.getElementById("input-part_name");
    let inputSupplierID = document.getElementById("input-supplier_id");

    // Get the values from the form fields
    let partNameValue = inputPartName.value;
    let supplierIDValue = inputSupplierID.value;

    // Put our data we want to send in a javascript object
    let data = {
        part_name: partNameValue,
        supplier_id: supplierIDValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-part-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPartName.value = '';
            inputSupplierID.value = '';
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
    let currentTable = document.getElementById("parts-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let partIDCell = document.createElement("TD");
    let partNameCell = document.createElement("TD");
    let supplierIDCell = document.createElement("TD");
    let supplierNameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    partIDCell.innerText = newRow.part_id;
    partNameCell.innerText = newRow.part_name;
    supplierIDCell.innerText = newRow.supplier_id;
    supplierNameCell.innerText = newRow.supplier_name;

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Delete";
    deleteCell.appendChild(deleteButton);
    deleteCell.onclick = function(){
        deletePart(newRow.part_id);
    };

    // Add the cells to the row 
    row.appendChild(partIDCell);
    row.appendChild(partNameCell);
    row.appendChild(supplierIDCell);
    row.appendChild(supplierNameCell);
    row.appendChild(deleteCell);

    //Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.part_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.part_id;
    option.value = newRow.part_id;
    selectMenu.add(option);
}