// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var path = require('path');
PORT        = 10258;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { query } = require('express');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public/css')));

/*
    ROUTES
*/

// Render index page/home page which is just a navigation to the other pages
app.get('/', function(req, res) 
    {
       return res.render('index')
    });

/*
***************Routes for Cars entity and data manipulations***************************
*/

// Render main cars-page that selects all of the information required for the table.

app.get('/cars-page', function(req, res)
    {

        let query1;

        if (req.query.model_name === undefined)
        {
            query1 = "SELECT Cars.car_id, Cars.model_name, Cars.color, Cars.order_id, Dealerships.dealership_name FROM Cars JOIN Car_orders ON Cars.order_id = Car_orders.order_id JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id;";
        }

        else
        {
            query1 = `SELECT Cars.car_id, Cars.model_name, Cars.color, Cars.order_id, Dealerships.dealership_name FROM Cars JOIN Car_orders ON Cars.order_id = Car_orders.order_id JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id AND model_name LIKE "${req.query.model_name}%";`;
        }

        let query2 = "SELECT * FROM Car_orders;";

        db.pool.query(query1, function(error, rows, fields){
            
            let cars = rows;

            db.pool.query(query2, (error, rows, fields) =>{
                let orders = rows;
                return res.render('cars-page', {data: cars, orders: orders});
            })
            
        })
    });

// Route handler for INSERT query/automatically updates the table without refresh.

app.post('/add-car-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let order_id = parseInt(data.order_id);
    if (isNaN(order_id))
    {
        order_id = 'NULL'
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Cars (model_name, color, order_id) VALUES ('${data.model_name}', '${data.color}', ${order_id})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT Cars.car_id, Cars.model_name, Cars.color, Cars.order_id, Dealerships.dealership_name FROM Cars JOIN Car_orders ON Cars.order_id = Car_orders.order_id JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//Delete handler for Cars entity

app.delete('/delete-car-ajax/:carID', function(req,res,next){
    let data = req.body;
    let carID = parseInt(data.id);
    let deleteCar = `DELETE FROM Cars WHERE car_id = ${carID}`;
  
    db.pool.query(deleteCar, [req.params.carID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

//Update handler for Cars entity

app.put('/put-car-ajax', function(req,res,next){
    let data = req.body;
  
    let carID = parseInt(data.carID);
    let modelName = (data.modelName);
    let color = data.color;
    let orderID = parseInt(data.orderID);
  
    let queryUpdateCar = `UPDATE Cars SET Cars.model_name = "${modelName}", order_id = ${orderID}, color= "${color}" WHERE Cars.car_id = ${carID}`;
    let selectCar = `SELECT Cars.car_id, Cars.model_name, Cars.color, Cars.order_id, Dealerships.dealership_name FROM Cars JOIN Car_orders ON Cars.order_id = Car_orders.order_id JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id WHERE Cars.car_id = ${carID}`
  
          // Run the 1st query
          db.pool.query(queryUpdateCar, [carID, orderID, modelName, color], function(error, rows, fields){
            
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the car's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectCar, [orderID, modelName, color], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/* 
********************************ROUTE HANDLING FOR ALL DEALERSHIPS ENTITY QUERIES********************
*/

// RENDER THE DEALERSHIPS PAGE/SHOW TABLE FOR ENTITY

app.get('/dealerships-page', function(req, res) 
{

    let query1;

    if (req.query.dealership_name === undefined)
    {
        query1 = "SELECT * FROM Dealerships;";
    }

    // If search being performed use input to retrieve dealership information
    else
    {
        query1 = `SELECT * FROM Dealerships WHERE dealership_name LIKE "${req.query.dealership_name}%";`;
    }

    db.pool.query(query1, function(error, rows, fields){
        
        let dealerships = rows;
        return res.render('dealerships-page', {data: dealerships});
        
    })
});

// Route handler for INSERT query/automatically updates the table without refresh.

app.post('/add-dealership-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Dealerships (dealership_name, dealership_email, dealership_phone) VALUES ('${data.dealership_name}', '${data.dealership_email}', '${data.dealership_phone}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
             // If there was no error, perform a SELECT * on bsg_people
             query2 = `SELECT * FROM Dealerships`;
             db.pool.query(query2, function(error, rows, fields){
 
                 // If there was an error on the second query, send a 400
                 if (error) {
                     
                     // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                     console.log(error);
                     res.sendStatus(400);
                 }
                 // If all went well, send the results of the query back.
                 else
                 {
                     res.send(rows);
                 }
             })
        }
    })
});

//Delete handler for Dealerships entity

app.delete('/delete-dealership-ajax/:dealershipID', function(req,res,next){
    let data = req.body;
    let dealershipID = parseInt(data.id);
    let deleteDealership = `DELETE FROM Dealerships WHERE dealership_id = ${dealershipID}`;
  
    db.pool.query(deleteDealership, [req.params.dealershipID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

//Update handler for Dealerships entity

app.put('/put-dealership-ajax', function(req,res,next){
    let data = req.body;
  
    let dealershipID = parseInt(data.dealershipID);
    let dealershipName = (data.dealershipName);
    let dealershipEmail = data.dealershipEmail;
    let dealershipPhone = data.dealershipPhone;
  
    let queryUpdateDealership = `UPDATE Dealerships SET Dealerships.dealership_name = "${dealershipName}", Dealerships.dealership_email = "${dealershipEmail}", Dealerships.dealership_phone = "${dealershipPhone}" WHERE Dealerships.dealership_id = ${dealershipID}`;
    let selectDealership = `SELECT * FROM Dealerships WHERE Dealerships.dealership_id = ${dealershipID}`
  
          // Run the 1st query
          db.pool.query(queryUpdateDealership, [dealershipID, dealershipName, dealershipEmail, dealershipPhone], function(error, rows, fields){
            
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the car's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectDealership, [dealershipName, dealershipEmail, dealershipPhone], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/* 
********************************ROUTE HANDLING FOR ALL ORDERS ENTITY QUERIES********************
*/

app.get('/orders-page', function(req, res)
{

    let query1;

    if (req.query.dealership_name === undefined)
    {
        query1 = "SELECT Car_orders.order_id, Car_orders.order_date, Dealerships.dealership_name FROM Car_orders INNER JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id";
    }

    else
    {
        query1 = `SELECT Car_orders.order_id, Car_orders.order_date, Dealerships.dealership_name FROM Car_orders INNER JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id AND Dealerships.dealership_name LIKE "${req.query.dealership_name}%";`;
    }

    let query2 = "SELECT * FROM Dealerships;";

    db.pool.query(query1, function(error, rows, fields){
        
        let orders = rows;

    // Transform default JS date format into better format. Used code from https://stackoverflow.com/questions/58887820/how-to-display-specific-date-format-on-html
        for (let i=0; i < orders.length; i++) {
            var dateStr = orders[i]['order_date']
            var date = new Date(dateStr);
            var y = String(date.getFullYear());
            var m = String(date.getMonth());
            var d = String(date.getDate());
            var newDate = y + '-'+m+'-'+d;
            
            if (y == 'NaN' || m == 'NaN' || d == 'NaN') {
                orders[i]['order_date'] = 'NULL'
            }
            else {
                orders[i]['order_date'] = newDate
            }
        }

        db.pool.query(query2, (error, rows, fields) =>{
            let dealerships = rows;
            return res.render('orders-page', {data: orders, dealerships: dealerships});
        })
        
    })
});

// Route handler for INSERT query/automatically updates the table without refresh.

app.post('/add-order-ajax', function(req, res) 
{
// Capture the incoming data and parse it back to a JS object
let data = req.body;

let dealership_id = parseInt(data.dealership_id);
if (isNaN(dealership_id))
{
    dealership_id = 'NULL'
}

// Create the query and run it on the database
query1 = `INSERT INTO Car_orders (order_date, dealership_id) VALUES ('${data.order_date}', ${dealership_id})`;
db.pool.query(query1, function(error, rows, fields){

    // Check to see if there was an error
    if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
    }
    else
    {
        // If there was no error, perform a SELECT * on bsg_people
        query2 = "SELECT Car_orders.order_id, Car_orders.order_date, Dealerships.dealership_name FROM Car_orders INNER JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id";
        db.pool.query(query2, function(error, rows, fields){

        // Transform default JS date format into better format. Used code from https://stackoverflow.com/questions/58887820/how-to-display-specific-date-format-on-html
        for (let i=0; i < rows.length; i++) {
            var dateStr = rows[i]['order_date']
            var date = new Date(dateStr);
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate();
            var newDate = y + '-'+m+'-'+d;
            if (y == 'NaN' || m == 'NaN' || d == 'NaN') {
                rows[i]['order_date'] = 'NULL'
            }
            else {
                rows[i]['order_date'] = newDate
            }
        }

            // If there was an error on the second query, send a 400
            if (error) {
                
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
            // If all went well, send the results of the query back.
            else
            {
                res.send(rows);
            }
        })
    }
})
});

//Delete handler for Orders entity

app.delete('/delete-order-ajax/:orderId', function(req,res,next){
    let data = req.body;
    let orderId = parseInt(data.id);
    let deleteOrder = `DELETE FROM Car_orders WHERE order_id = ${orderId}`;
  
    db.pool.query(deleteOrder, [req.params.orderId], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

//Update handler for Orders entity

app.put('/put-order-ajax', function(req,res,next){
    let data = req.body;
    let orderId = parseInt(data.orderId);
    let dealershipName = parseInt(data.dealershipName);
    let orderDate = data.orderDate;
  
    let queryUpdateOrder = `UPDATE Car_orders SET Car_orders.order_date = "${orderDate}", Car_orders.dealership_id = ${dealershipName} WHERE Car_orders.order_id = ${orderId}`;
    let selectOrder = `SELECT Car_orders.order_id, Car_orders.order_date, Dealerships.dealership_name, Car_orders.dealership_id FROM Car_orders INNER JOIN Dealerships ON Car_orders.dealership_id = Dealerships.dealership_id WHERE Car_orders.order_id = ${orderId}`
  
          // Run the 1st query
          db.pool.query(queryUpdateOrder, [orderId, dealershipName, orderDate], function(error, rows, fields){
            
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the car's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectOrder, [dealershipName, orderId, orderDate], function(error, rows, fields) {

                    // Transform default JS date format into better format. Used code from https://stackoverflow.com/questions/58887820/how-to-display-specific-date-format-on-html
                    for (let i=0; i < rows.length; i++) {
                        var dateStr = rows[i]['order_date']
                        var date = new Date(dateStr);
                        var y = date.getFullYear();
                        var m = date.getMonth();
                        var d = date.getDate();
                        var newDate = y + '-'+m+'-'+d;
                        if (y == 'NaN' || m == 'NaN' || d == 'NaN') {
                            rows[i]['order_date'] = 'NULL'
                        }
                        else {
                            rows[i]['order_date'] = newDate
                        }
                    }

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/* 
********************************ROUTE HANDLING FOR ALL CARPARTS ENTITY QUERIES********************
*/

// Render main cars-page that selects all of the information required for the table.

app.get('/carparts-page', function(req, res)
    {

        let query1;

        if (req.query.model_name === undefined)
        {
            query1 = "SELECT Cars_Parts.car_part_id, Cars.model_name, Parts.part_name FROM Cars_Parts JOIN Cars ON Cars_Parts.car_id = Cars.car_id JOIN Parts ON Cars_Parts.part_id = Parts.part_id;";
        }

        else
        {
            query1 = `SELECT Cars_Parts.car_part_id, Cars.model_name, Parts.part_name FROM Cars_Parts JOIN Cars ON Cars_Parts.car_id = Cars.car_id JOIN Parts ON Cars_Parts.part_id = Parts.part_id AND Cars.model_name LIKE "${req.query.model_name}%";`;
        }

        let query2 = "SELECT * FROM Cars;";
        let query3 = "Select * FROM Parts;";

        db.pool.query(query1, function(error, rows, fields){
            
            let car_parts = rows;

            db.pool.query(query2, (error, rows, fields) =>{

                let cars = rows;

                db.pool.query(query3, (error, rows, fields) =>{

                    let parts = rows;

                    return res.render('carparts-page', {data: car_parts, cars: cars, parts: parts});
                })
                
            })
            
        })
    });
    
// Route handler for INSERT query.

app.post('/add-carpart-ajax', function(req, res) 
    {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let car_id = parseInt(data.car_id);
    let part_id = parseInt(data.part_id);
    if (isNaN(car_id))
    {
        car_id = 'NULL'
    }
    if (isNaN(part_id))
    {
        part_id = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Cars_Parts (car_id, part_id) VALUES (${car_id}, ${part_id})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Cars_Parts
            query2 = "SELECT Cars_Parts.car_part_id, Cars.model_name, Parts.part_name FROM Cars_Parts JOIN Cars ON Cars_Parts.car_id = Cars.car_id JOIN Parts ON Cars_Parts.part_id = Parts.part_id;";
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
    });

//Delete handler for Cars_Parts entity

app.delete('/delete-carpart-ajax/:carPartId', function(req,res,next){
    let data = req.body;
    let carPartId = parseInt(data.id);
    let deleteCarPart = `DELETE FROM Cars_Parts WHERE car_part_id = ${carPartId}`;
  
    db.pool.query(deleteCarPart, [req.params.carPartId], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

//Update handler for Car_Parts entity

app.put('/put-carpart-ajax', function(req,res,next){
    let data = req.body;
    let carPartId = parseInt(data.carPartId);
    let carId = parseInt(data.carId);
    let partId = parseInt(data.partId);
  
    let queryUpdateCarPart = `UPDATE Cars_Parts SET Cars_Parts.car_id = ${carId}, Cars_Parts.part_id = ${partId} WHERE Cars_Parts.car_part_id = ${carPartId}`;
    let selectCarPart = `SELECT Cars_Parts.car_part_id, Cars.model_name, Parts.part_name FROM Cars_Parts JOIN Cars ON Cars_Parts.car_id = Cars.car_id JOIN Parts ON Cars_Parts.part_id = Parts.part_id WHERE Cars_Parts.car_part_id = ${carPartId}`
  
          // Run the 1st query
          db.pool.query(queryUpdateCarPart, [carPartId, carId, partId], function(error, rows, fields){
            
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the car's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectCarPart, [carPartId, carId, partId], function(error, rows, fields) {
                    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/*
***************Routes for Parts entity and data manipulations***************************
*/

// Render main parts-page that selects all of the information required for the table.

app.get('/parts-page', function(req, res)
    {

        let query1;

        if (req.query.part_name === undefined)
        {
            query1 = "SELECT Parts.part_id, Parts.part_name, Parts.supplier_id, Suppliers.supplier_name FROM Parts JOIN Suppliers ON Parts.supplier_id = Suppliers.supplier_id;";
        }

        else
        {
            query1 = `SELECT Parts.part_id, Parts.part_name, Parts.supplier_id, Suppliers.supplier_name FROM Parts JOIN Suppliers ON Parts.supplier_id = Suppliers.supplier_id WHERE Parts.part_name LIKE "${req.query.part_name}%";`;
        }

        let query2 = "SELECT * FROM Suppliers;";

        db.pool.query(query1, function(error, rows, fields) {
            let parts = rows;

            db.pool.query(query2, (error, rows, fields) =>{

                let suppliers = rows;
                return res.render('parts-page', {data: parts, suppliers: suppliers});
            })
        })
    });

// Route handler for INSERT query/automatically updates the table without refresh.

app.post('/add-part-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let supplier_id = parseInt(data.supplier_id);
    if (isNaN(supplier_id))
    {
        supplier_id = 'NULL'
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Parts (part_name, supplier_id) VALUES ('${data.part_name}', ${data.supplier_id})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT Parts.part_id, Parts.part_name, Parts.supplier_id, Suppliers.supplier_name FROM Parts JOIN Suppliers ON Parts.supplier_id = Suppliers.supplier_id;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//Delete handler for Parts entity

app.delete('/delete-part-ajax/:partID', function(req,res,next){
    let data = req.body;
    let partID = parseInt(data.id);
    let deletePart = `DELETE FROM Parts WHERE part_id = ${partID}`;
  
    db.pool.query(deletePart, [req.params.partID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

//Update handler for Parts entity

app.put('/put-part-ajax', function(req,res,next){
    let data = req.body;
  
    let partID = parseInt(data.partID);
    let partName = (data.partName);
    let supplierID = data.supplierID;
  
    let queryUpdatePart = `UPDATE Parts SET Parts.part_name = "${partName}", supplier_id = ${supplierID} WHERE Parts.part_id = ${partID}`;
    let selectPart = `SELECT Parts.part_id, Parts.part_name, Parts.supplier_id, Suppliers.supplier_name FROM Parts JOIN Suppliers ON Parts.supplier_id = Suppliers.supplier_id WHERE Parts.part_id = ${partID}`
  
          // Run the 1st query
          db.pool.query(queryUpdatePart, [partID, partName, supplierID], function(error, rows, fields){
            
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the part's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectPart, [partName, supplierID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/*
***************Routes for Suppliers entity and data manipulations***************************
*/

// Render main suppliers-page that selects all of the information required for the table.

app.get('/suppliers-page', function(req, res)
    {

        let query1;

        if (req.query.supplier_name === undefined)
        {
            query1 = "SELECT Suppliers.supplier_id, Suppliers.supplier_name, Suppliers.supplier_email, Suppliers.supplier_phone FROM Suppliers;";
        }

        else
        {
            query1 = `SELECT Suppliers.supplier_id, Suppliers.supplier_name, Suppliers.supplier_email, Suppliers.supplier_phone FROM Suppliers WHERE Suppliers.supplier_name LIKE "${req.query.supplier_name}%";`;
        }

        db.pool.query(query1, function(error, rows, fields) {
            let suppliers = rows;
            return res.render('suppliers-page', {data: suppliers});
        })
    });

// Route handler for INSERT query/automatically updates the table without refresh.

app.post('/add-supplier-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let supplier_id = parseInt(data.supplier_id);
    if (isNaN(supplier_id))
    {
        supplier_id = 'NULL'
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Suppliers (supplier_name, supplier_email, supplier_phone) VALUES ('${data.supplier_name}', '${data.supplier_email}', '${data.supplier_phone}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT Suppliers.supplier_id, Suppliers.supplier_name, Suppliers.supplier_email, Suppliers.supplier_phone FROM Suppliers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//Delete handler for Suppliers entity

app.delete('/delete-supplier-ajax/:supplierID', function(req,res,next){
    let data = req.body;
    let supplierID = parseInt(data.id);
    let deleteSupplier = `DELETE FROM Suppliers WHERE supplier_id = ${supplierID}`;
  
    db.pool.query(deleteSupplier, [req.params.supplierID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

//Update handler for Suppliers entity

app.put('/put-supplier-ajax', function(req,res,next){
    let data = req.body;
  
    let supplierID = parseInt(data.supplierID);
    let supplierName = (data.supplierName);
    let supplierEmail = (data.supplierEmail);
    let supplierPhone = (data.supplierPhone);
  
    let queryUpdateSupplier = `UPDATE Suppliers SET Suppliers.supplier_name = "${supplierName}", Suppliers.supplier_email = "${supplierEmail}", Suppliers.supplier_phone = "${supplierPhone}" WHERE Suppliers.supplier_id = ${supplierID}`;
    let selectSupplier = `SELECT Suppliers.supplier_id, Suppliers.supplier_name, Suppliers.supplier_email, Suppliers.supplier_phone FROM Suppliers WHERE Suppliers.supplier_id = ${supplierID}`
  
          // Run the 1st query
          db.pool.query(queryUpdateSupplier, [supplierName, supplierEmail, supplierPhone], function(error, rows, fields){
            
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the supplier's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectSupplier, [supplierName, supplierEmail, supplierPhone], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});