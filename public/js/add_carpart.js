// Get the objects we need to modify
let addCarPartForm = document.getElementById('add-carpart-form-ajax');

// Modify the objects we need
addCarPartForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCarId = document.getElementById("input-car_id");
    let inputPartId = document.getElementById("input-part_id");

    // Get the values from the form fields
    let carIdValue = inputCarId.value;
    let partIdValue = inputPartId.value;

    // Put our data we want to send in a javascript object
    let data = {
        car_id: carIdValue,
        part_id: partIdValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-carpart-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCarId.value = '';
            inputPartId.value = '';
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
    let currentTable = document.getElementById("carparts-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let modelNameCell = document.createElement("TD");
    let partNameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.car_part_id;
    modelNameCell.innerText = newRow.model_name;
    partNameCell.innerText = newRow.part_name;

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Delete";
    deleteCell.appendChild(deleteButton);
    deleteCell.onclick = function(){
        deleteCar(newRow.car_part_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(modelNameCell);
    row.appendChild(partNameCell);
    row.appendChild(deleteCell);

    //Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.car_part_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

}