
// Get the objects we need to modify
let updateSupplierForm = document.getElementById('update-supplier-form-ajax');

// Modify the objects we need
updateSupplierForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSupplierID = document.getElementById("mySelect");
    let inputSupplierName = document.getElementById("input-supplier_name-update");
    let inputSupplierEmail = document.getElementById("input-supplier_email-update");
    let inputSupplierPhone = document.getElementById("input-supplier_phone-update");

    // Get the values from the form fields
    let supplierIDValue = inputSupplierID.value;
    let supplierNameValue = inputSupplierName.value;
    let supplierEmailValue = inputSupplierEmail.value;
    let supplierPhoneValue = inputSupplierPhone.value;


    if (isNaN(supplierIDValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        supplierID: supplierIDValue,
        supplierName: supplierNameValue,
        supplierEmail: supplierEmailValue,
        supplierPhone: supplierPhoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-supplier-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, supplierIDValue);

            inputSupplierID.value = '';
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

function updateRow(data, supplierID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("suppliers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == supplierID) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of updated values

            let supplierNameTD = updateRowIndex.getElementsByTagName("td")[1];
            let supplierEmailTD = updateRowIndex.getElementsByTagName("td")[2];
            let supplierPhoneTD = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign model_name, color, order_id, dealership_name to our value we updated to
            supplierNameTD.innerHTML = parsedData[0].supplier_name;
            supplierEmailTD.innerHTML = parsedData[0].supplier_email;
            supplierPhoneTD.innerHTML = parsedData[0].supplier_phone;
       }
    }
}
