import fs from 'fs';
import express from 'express';
import path from 'path';


const app = express();
app.set('json spaces', 2); 
const PORT = 3000;
app.use(express.json());

const dbpath = path.resolve("users.json");

if(!fs.existsSync(dbpath)) {
    fs.writeFileSync(dbpath, JSON.stringify([]));
}

const readUsers = () => JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
const writeUsers = (users) => fs.writeFileSync(dbpath, JSON.stringify(users, null, 2));

// =====================================================================
// Static/Specific routes must come BEFORE dynamic routes (/:id)
// =====================================================================

// 4. GET /user/getByName -> Gets a user by their name (Query param)
app.get('/user/getByName', (req,res) => {
    const { name } = req.query;
    const users = readUsers();

    const user = users.find(u => u.name.toLowerCase() === name?.toLowerCase());

    if(user) {
      res.json(user);
    }
    else {
      res.status(404).json({ error: "User not found" });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/////////////////////////////////////////////////////////////////////////////////

// 6. GET /user/filter -> Filters users by minimum age (Query param)

app.get('/user/filter', (req,res) => {
  const minAge = parseInt(req.query.minAge);
  const users = readUsers();

  const filteredUsers = users.filter(u => u.age >= minAge);

  if(filteredUsers.length > 0) {
    res.json(filteredUsers);
  }
  else {
    res.status(404).json({ error: "No users found" });
  }
});

/////////////////////////////////////////////////////////////////////////////////

// 5. GET /user -> Gets all users

app.get('/user', (req,res) => {
  const users = readUsers();
  res.json(users);
});

//////////////////////////////////////////////////////////////////////////////////

// 7. GET /user/:id -> Gets a user by their ID (Dynamic route)

app.get('/user/:id', (req,res) => {
  const id = Number(req.params.id);
  const users = readUsers();

  const user = users.find(u => u.id === id);

  if(user) {
    res.json(user);
  }
  else {
    res.status(404).json({ error: "User not found" });
  }

})

//////////////////////////////////////////////////////////////////////////////////

// 1. POST /user -> Adds a new user

app.post('/user', (req,res) => {
  const { name, age,email } = req.body;
  const users = readUsers();

  // Ensure email doesn't already exist
  if(users.some(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Generate Auto-incremented ID 

  const id = users.length > 0 ? users[users.length -1].id + 1 : 1;

  const newUser = { id, name, age, email };
  users.push(newUser);

  writeUsers(users);
  res.status(201).json({ message: "User created successfully" });

});

///////////////////////////////////////////////////////////////////////////////////

// 2. PATCH /user/:id -> Updates user name, age, or email

app.patch('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body; 
  
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    
    users[userIndex] = { ...users[userIndex], ...updates };
    writeUsers(users);
    
    // Extract the key that was updated for the dynamic message (e.g., 'age' or 'name')
    const updatedField = Object.keys(updates).length > 0 ? Object.keys(updates).join(', ') : 'data';
    res.json({ message: `User ${updatedField} updated successfully.` });
  } else {
    res.status(404).json({ message: "User ID not found." });
  }
});

///////////////////////////////////////////////////////////////////////////////////

// 3. DELETE /user/:id -> Deletes a user by their ID

app.delete(['/user', '/user/:id'], (req, res) => {
  const id = parseInt(req.params.id || req.body.id);
  
  let users = readUsers();
  const initialLength = users.length;
  
  users = users.filter(u => u.id !== id);
  
  if (users.length < initialLength) {
    writeUsers(users);
    res.json({ message: "User deleted successfully." });
  } else {
    res.status(404).json({ message: "User ID not found." });
  }
});
