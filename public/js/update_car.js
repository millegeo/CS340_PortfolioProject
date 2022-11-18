
// Get the objects we need to modify
let updateCarForm = document.getElementById('update-car-form-ajax');

// Modify the objects we need
updateCarForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputModelName = document.getElementById("mySelect");
    let inputOrderID = document.getElementById("input-order-update");
    let inputColor = document.getElementById("input-color-update")

    // Get the values from the form fields
    let modelNameValue = inputModelName.value;
    let orderIDValue = inputOrderID.value;
    let colorValue = inputColor.value;


    if (isNaN(orderIDValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
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
            updateRow(xhttp.response, modelNameValue);

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

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
