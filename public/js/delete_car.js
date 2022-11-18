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
              deleteDropDownMenu(carID);
              break;
         }
      }
  }

  function deleteDropDownMenu(carID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(carID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }