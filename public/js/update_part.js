
// Get the objects we need to modify
let updatePartForm = document.getElementById('update-part-form-ajax');

// Modify the objects we need
updatePartForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPartID = document.getElementById("mySelect");
    let inputPartName = document.getElementById("input-part_name-update");
    let inputSupplierID = document.getElementById("input-supplier_id-update");

    // Get the values from the form fields
    let partIDValue = inputPartID.value;
    let partNameValue = inputPartName.value;
    let supplierIDValue = inputSupplierID.value;


    if (isNaN(partIDValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        partID: partIDValue,
        partName: partNameValue,
        supplierID: supplierIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-part-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, partIDValue);

            inputPartID.value = '';
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


function updateRow(data, partID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("parts-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == partID) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of updated values

            let partNameTD = updateRowIndex.getElementsByTagName("td")[1];
            let supplierIDTD = updateRowIndex.getElementsByTagName("td")[2];
            // let supplierNameTD = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign model_name, color, order_id, dealership_name to our value we updated to
            partNameTD.innerHTML = parsedData[0].part_name;
            supplierIDTD.innerHTML = parsedData[0].supplier_id;
            // supplierNameTD.innerHTML = parsedData[0].supplier_name;
       }
    }
}
