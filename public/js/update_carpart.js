
// Get the objects we need to modify
let updateCarPartForm = document.getElementById('update-carpart-form-ajax');

// Modify the objects we need
updateCarPartForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCarPartId = document.getElementById("mySelect")
    let inputCarId = document.getElementById("input-car-id-update");
    let inputPartId = document.getElementById("input-part-id-update");

    // Get the values from the form fields
    let carPartIdValue = inputCarPartId.value;
    let carIdValue = inputCarId.value;
    let partIdValue = inputPartId.value;

    if (isNaN(carPartIdValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        carPartId: carPartIdValue,
        carId: carIdValue,
        partId: partIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-carpart-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, carPartIdValue);

            inputCarPartId.value = '';
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


function updateRow(data, carPartId){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("carparts-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == carPartId) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of updated values

            let modelNameTD = updateRowIndex.getElementsByTagName("td")[1];
            let partNameTD = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign model_name, color, order_id, dealership_name to our value we updated to
            modelNameTD.innerHTML = parsedData[0].model_name;
            partNameTD.innerHTML = parsedData[0].part_name; 
       }
    }
}
