function deleteDealership(dealershipID) {
    var link = '/delete-dealership-ajax/';
    link += dealershipID;
    let data = {
      id: dealershipID
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(dealershipID);
      }
    });
  }
  
  function deleteRow(dealershipID){
      let table = document.getElementById("dealerships-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == dealershipID) {
              table.deleteRow(i);
              break;
         }
      }
  }
