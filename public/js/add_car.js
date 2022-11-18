// Get the objects we need to modify
let addCarForm = document.getElementById('add-car-form-ajax');

// Modify the objects we need
addCarForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputModelName = document.getElementById("input-model_name");
    let inputColor = document.getElementById("input-color");
    let inputOrderID = document.getElementById("input-order_id");

    // Get the values from the form fields
    let modelNameValue = inputModelName.value;
    let colorValue = inputColor.value;
    let orderIDValue = inputOrderID.value;

    // Put our data we want to send in a javascript object
    let data = {
        model_name: modelNameValue,
        color: colorValue,
        order_id: orderIDValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-car-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputModelName.value = '';
            inputColor.value = '';
            inputOrderID.value = '';
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
    let currentTable = document.getElementById("cars-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let modelNameCell = document.createElement("TD");
    let colorCell = document.createElement("TD");
    let orderIDCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.car_id;
    modelNameCell.innerText = newRow.model_name;
    colorCell.innerText = newRow.color;
    orderIDCell.innerText = newRow.order_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCar(newRow.car_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(modelNameCell);
    row.appendChild(colorCell);
    row.appendChild(orderIDCell);
    row.appendChild(deleteCell);

    //Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.car_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.car_id;
    option.value = newRow.car_id;
    selectMenu.add(option);
}