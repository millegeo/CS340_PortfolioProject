function deleteCarPart(carPartId) {
    var link = '/delete-carpart-ajax/';
    link += carPartId;
    let data = {
      id: carPartId
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(carPartId);
      }
    });
  }
  
  function deleteRow(carPartId){
      let table = document.getElementById("carparts-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == carPartId) {
              table.deleteRow(i);
              deleteDropDownMenu(carPartId);
              break;
         }
      }
  }

  function deleteDropDownMenu(carPartId){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(carPartId)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }