import mysql from 'mysql2/promise';

async function runDatabaseTasks() {
  // Connect to MySQL (Update user/password to match your local XAMPP/MySQL setup)
  // We don't specify a database yet because we might need to create it.
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', 
  });

  try {
    console.log("Connected to MySQL successfully!");

    // Create a database for this assignment and use it
    await connection.query(`CREATE DATABASE IF NOT EXISTS retail_db;`);
    await connection.query(`USE retail_db;`);

    // =====================================================================
    // 1- Create the required tables (Must be in order: Suppliers -> Products -> Sales)
    // =====================================================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT PRIMARY KEY AUTO_INCREMENT,
        SupplierName TEXT,
        ContactNumber TEXT
      );
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INT PRIMARY KEY AUTO_INCREMENT,
        ProductName TEXT,
        Price DECIMAL(10, 2),
        StockQuantity INT,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID) ON DELETE SET NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT PRIMARY KEY AUTO_INCREMENT,
        ProductID INT,
        QuantitySold INT,
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
      );
    `);
    console.log("Task 1: Tables created.");

    // =====================================================================
    // Tasks 2 to 5: Altering Tables
    // =====================================================================
    
    // 2- Add a column “Category” to the Products table.
    await connection.query(`ALTER TABLE Products ADD COLUMN Category VARCHAR(255);`);
    console.log("Task 2: Category column added.");

    // 3- Remove the “Category” column from Products.
    await connection.query(`ALTER TABLE Products DROP COLUMN Category;`);
    console.log("Task 3: Category column removed.");

    // 4- Change “ContactNumber” column in Suppliers to VARCHAR (15).
    await connection.query(`ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15);`);
    console.log("Task 4: ContactNumber changed to VARCHAR(15).");

    // 5- Add a NOT NULL constraint to ProductName.
    await connection.query(`ALTER TABLE Products MODIFY COLUMN ProductName TEXT NOT NULL;`);
    console.log("Task 5: NOT NULL constraint added to ProductName.");

    // =====================================================================
    // 6- Perform Basic Inserts
    // =====================================================================
    
    // a. Add a supplier
    await connection.query(`
      INSERT INTO Suppliers (SupplierName, ContactNumber) 
      VALUES ('FreshFoods', '01001234567');
    `);
    
    // b. Insert three products (Assuming 'FreshFoods' got SupplierID = 1)
    await connection.query(`
      INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) 
      VALUES 
        ('Milk', 15.00, 50, 1),
        ('Bread', 10.00, 30, 1),
        ('Eggs', 20.00, 40, 1);
    `);

    // c. Add a record for the sale of 2 units of 'Milk' (Assuming 'Milk' got ProductID = 1)
    await connection.query(`
      INSERT INTO Sales (ProductID, QuantitySold, SaleDate) 
      VALUES (1, 2, '2025-05-20');
    `);
    console.log("Task 6: Basic Inserts completed.");

    // =====================================================================
    // Tasks 7 to 13: Updates, Deletes, and Selects
    // =====================================================================

    // 7- Update the price of 'Bread' to 25.00.
    await connection.query(`UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread';`);
    console.log("Task 7: Bread price updated.");

    // 8- Delete the product 'Eggs'.
    await connection.query(`DELETE FROM Products WHERE ProductName = 'Eggs';`);
    console.log("Task 8: Eggs deleted.");

    // 9- Retrieve the total quantity sold for each product.
    const [task9] = await connection.query(`
      SELECT ProductID, SUM(QuantitySold) AS TotalSold 
      FROM Sales 
      GROUP BY ProductID;
    `);
    console.log("Task 9: Total sold per product:", task9);

    // 10- Get the product with the highest stock.
    const [task10] = await connection.query(`
      SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1;
    `);
    console.log("Task 10: Highest stock product:", task10);

    // 11- Find suppliers with names starting with 'F'.
    const [task11] = await connection.query(`
      SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%';
    `);
    console.log("Task 11: Suppliers starting with F:", task11);

    // 12- Show all products that have never been sold.
    const[task12] = await connection.query(`
      SELECT * FROM Products 
      WHERE ProductID NOT IN (SELECT ProductID FROM Sales);
    `);
    console.log("Task 12: Products never sold:", task12);

    // 13- Get all sales along with product name and sale date.
    const [task13] = await connection.query(`
      SELECT s.SaleID, p.ProductName, s.SaleDate, s.QuantitySold 
      FROM Sales s
      JOIN Products p ON s.ProductID = p.ProductID;
    `);
    console.log("Task 13: Sales with product names:", task13);

    // =====================================================================
    // Tasks 14 to 16: User Management & Permissions
    // =====================================================================

    // 14- Create user "store_manager" and give SELECT, INSERT, UPDATE permissions.
    await connection.query(`CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'pass1234';`);
    await connection.query(`GRANT SELECT, INSERT, UPDATE ON retail_db.* TO 'store_manager'@'localhost';`);
    console.log("Task 14: User created with basic permissions.");

    // 15- Revoke UPDATE permission from "store_manager".
    await connection.query(`REVOKE UPDATE ON retail_db.* FROM 'store_manager'@'localhost';`);
    console.log("Task 15: UPDATE permission revoked.");

    // 16- Grant DELETE permission to "store_manager" only on the Sales table.
    await connection.query(`GRANT DELETE ON retail_db.Sales TO 'store_manager'@'localhost';`);
    // Flush privileges to apply changes
    await connection.query(`FLUSH PRIVILEGES;`);
    console.log("Task 16: DELETE permission granted on Sales table.");

  } catch (error) {
    console.error("Database Error: ", error);
  } finally {
    // Close the connection
    await connection.end();
    console.log("Connection closed.");
  }
}

runDatabaseTasks();