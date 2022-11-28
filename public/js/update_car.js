
// Get the objects we need to modify
let updateCarForm = document.getElementById('update-car-form-ajax');

// Modify the objects we need
updateCarForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCarID = document.getElementById("mySelect");
    let inputModelName = document.getElementById("input-model-name-update");
    let inputOrderID = document.getElementById("input-order-update");
    let inputColor = document.getElementById("input-color-update");

    // Get the values from the form fields
    let carIDValue = inputCarID.value;
    let modelNameValue = inputModelName.value;
    let orderIDValue = inputOrderID.value;
    let colorValue = inputColor.value;


    if (isNaN(carIDValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        carID: carIDValue,
        modelName: modelNameValue,
        orderID: orderIDValue,
        color: colorValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-car-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, carIDValue);

            inputCarID.value = '';
            inputColor.value = '';
            inputModelName.value = '';
            inputOrderID.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, carID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("cars-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == carID) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of updated values

            let modelNameTD = updateRowIndex.getElementsByTagName("td")[1];
            let colorTD = updateRowIndex.getElementsByTagName("td")[2];
            let orderIdTD = updateRowIndex.getElementsByTagName("td")[3];
            let dealershipNameTD = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign model_name, color, order_id, dealership_name to our value we updated to
            modelNameTD.innerHTML = parsedData[0].model_name;
            colorTD.innerHTML = parsedData[0].color;
            orderIdTD.innerHTML = parsedData[0].order_id;
            dealershipNameTD.innerHTML = parsedData[0].dealership_name; 
       }
    }
}
