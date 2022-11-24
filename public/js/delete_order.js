function deleteOrder(orderId) {
    
    var link = '/delete-order-ajax/';
    link += orderId;
    let data = {
      id: orderId
    };
    
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
        deleteRow(orderId);
        }
    });
}
  
  function deleteRow(orderId){
    let table = document.getElementById("orders-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == orderId) {
            table.deleteRow(i);
            break;
        }
    }
}