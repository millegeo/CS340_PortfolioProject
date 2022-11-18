function deleteCar(carID) {
    var link = '/delete-car-ajax/';
    link += carID;
    let data = {
      id: carID
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(carID);
      }
    });
  }
  
  function deleteRow(carID){
      let table = document.getElementById("cars-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == carID) {
              table.deleteRow(i);
              break;
         }
      }
  }