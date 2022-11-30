function deleteSupplier(supplierID) {
    var link = '/delete-supplier-ajax/';
    link += supplierID;
    let data = {
      id: supplierID
    };
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(supplierID);
      }
    });
  }
  
  function deleteRow(supplierID){
      let table = document.getElementById("suppliers-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == supplierID) {
              table.deleteRow(i);
              deleteDropDownMenu(supplierID);
              break;
         }
      }
  }

  function deleteDropDownMenu(supplierID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(supplierID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }