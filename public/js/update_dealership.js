
// Get the objects we need to modify
let updateDealershipForm = document.getElementById('update-dealership-form-ajax');

// Modify the objects we need
updateDealershipForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDealershipID = document.getElementById("mySelect");
    let inputDealershipName = document.getElementById("input-dealership-name-update");
    let inputDealershipEmail = document.getElementById("input-dealership-email-update");
    let inputDealershipPhone = document.getElementById("input-dealership-phone-update")

    // Get the values from the form fields
    let dealershipIDValue = inputDealershipID.value;
    let dealershipNameValue = inputDealershipName.value;
    let dealershipEmailValue = inputDealershipEmail.value;
    let dealershipPhoneValue = inputDealershipPhone.value;


    if (isNaN(dealershipIDValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        dealershipID: dealershipIDValue,
        dealershipName: dealershipNameValue,
        dealershipEmail: dealershipEmailValue,
        dealershipPhone: dealershipPhoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-dealership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, dealershipIDValue);

            inputDealershipID.value = '';
            inputDealershipName.value = '';
            inputDealershipEmail.value = '';
            inputDealershipPhone.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, dealershipID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("dealerships-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == dealershipID) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of updated values

            let dealershipNameTD = updateRowIndex.getElementsByTagName("td")[1];
            let dealershipEmailTD = updateRowIndex.getElementsByTagName("td")[2];
            let dealershipPhoneTD = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign dealership_name, dealership_email, dealership_phone to our value we updated to
            dealershipNameTD.innerHTML = parsedData[0].dealership_name;
            dealershipEmailTD.innerHTML = parsedData[0].dealership_email;
            dealershipPhoneTD.innerHTML = parsedData[0].dealership_phone;
       }
    }
}