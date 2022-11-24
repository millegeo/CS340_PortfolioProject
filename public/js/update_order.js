
// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("mySelect");
    let inputOrderDate = document.getElementById("input-order-date-update");
    let inputDealershipName = document.getElementById("input-dealership-name-update");

    // Get the values from the form fields
    let orderIdValue = inputOrderId.value;
    let orderDateValue = inputOrderDate.value;
    let dealershipNameValue = inputDealershipName.value;

    if (isNaN(orderIdValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        orderId: orderIdValue,
        orderDate: orderDateValue,
        dealershipName: dealershipNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderIdValue);

            inputOrderId.value = '';
            inputOrderDate.value = '';
            inputDealershipName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderId){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderId) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of updated values

            let orderDateTD = updateRowIndex.getElementsByTagName("td")[1];
            let dealershipNameTD = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign model_name, color, order_id, dealership_name to our value we updated to
            orderDateTD.innerHTML = parsedData[0].order_date;
            dealershipNameTD.innerHTML = parsedData[0].dealership_name;
       }
    }
}
