SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
START TRANSACTION;

DROP TABLE IF EXISTS
    Cars,
    Suppliers,
    Parts,
    Cars_Parts,
    Dealerships,
    Car_orders;

CREATE TABLE Cars (
    car_id INT NOT NULL AUTO_INCREMENT,
    model_name varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    order_id INT NOT NULL,
    PRIMARY KEY (car_id),
    FOREIGN KEY(order_id) REFERENCES Car_orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Suppliers (
    supplier_id INT NOT NULL AUTO_INCREMENT,
    supplier_name varchar(255) UNIQUE,
    supplier_email varchar(255) UNIQUE,
    supplier_phone varchar(15) UNIQUE,
    PRIMARY KEY (supplier_id)
);

CREATE TABLE Parts (
    part_id INT NOT NULL AUTO_INCREMENT,
    part_name varchar(255) NOT NULL,
    supplier_id int NOT NULL,
    PRIMARY KEY (part_id),
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Cars_Parts (
    car_part_id INT NOT NULL AUTO_INCREMENT,
    car_id int,
    part_id int,
    PRIMARY KEY (car_part_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (part_id) REFERENCES Parts(part_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Dealerships (
    dealership_id int NOT NULL AUTO_INCREMENT,
    dealership_name varchar(255) NOT NULL UNIQUE,
    dealership_email varchar(255) NOT NULL UNIQUE,
    dealership_phone varchar(15) NOT NULL UNIQUE,
    PRIMARY KEY (dealership_id)
);

CREATE TABLE Car_orders (
    order_id int NOT NULL AUTO_INCREMENT,
    order_date date NOT NULL,
    dealership_id int NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (dealership_id) REFERENCES Dealerships(dealership_id) ON UPDATE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
SET AUTOCOMMIT = 1;

INSERT INTO Suppliers (supplier_id, supplier_name, supplier_email, supplier_phone)
VALUES
    (1, 'Napa', 'vending@napa.com', '(888)894-8888'),
    (2, 'Greggs', 'vending@greggs.com', '(101)100-0110'),
    (3, '123 Build', 'vending@123build.com', '(223)322-2232'),
    (4, "Parts'R'Us", 'vending@partsrus.com', '(666)999-6669');

INSERT INTO Parts (part_name, supplier_id)
VALUES
    ('Piston', 2),
    ('Cam shaft', 2),
    ('Tie Rod', 3),
    ('Engine Block', 4);

INSERT INTO Dealerships (dealership_id, dealership_name, dealership_email, dealership_phone)
VALUES
    (1, 'Toyoyo', 'orders@toyoyo.com', '(506)123-4567'),
    (2, 'Fork', 'orders@fork.com', '(778)765-4321'),
    (3, 'Hyondai', 'procurement@hyondai.com', '(999)999-9999'),
    (4, 'Chevrostand', 'proc@chevrostand.com', '(555)544-5444'),
    (5, 'VolksSedan', 'orders@volkssedan.com', '(654)111-2233');

INSERT INTO Car_orders (order_id, order_date, dealership_id)
VALUES
    (1, '2022-10-20', 1),
    (2, '2022-10-08', 3),
    (3, '2022-01-13', 4);

INSERT INTO Cars (car_id, model_name, color, order_id)
VALUES
    (1, 'Fiesty', 'Red', 1),
    (2, 'Turbulence', 'Blue', 1),
    (3, 'Campry', 'Grey', 2),
    (4, 'Tacome', 'Yellow', 3);

INSERT INTO Cars_Parts (car_id, part_id)
VALUES
    (1, 1),
    (2, 3),
    (3, 4),
    (4, 4);