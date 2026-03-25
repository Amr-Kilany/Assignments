import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { pipeline } from 'stream';
import http from 'http';

// ===================================================================================
// PART 1: Core Modules
// ===================================================================================

// 1) Use a readable stream to read a file in chunks and log each chunk.
function readInChunks(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  
  stream.on('data', (chunk) => {
    console.log('--- Chunk Received ---');
    console.log(chunk);
  });
  
  stream.on('end', () => {
    console.log('Finished reading file.');
  });
}

// fs.writeFileSync('./big.txt', 'This is a test file for chunking data.'.repeat(100));
// readInChunks('./big.txt');

///////////////////////////////////////////////////////////////////////////////////

// 2) Use readable and writable streams to copy content from one file to another.
function copyFileUsingStreams(srcPath, destPath) {
  const readStream = fs.createReadStream(srcPath);
  const writeStream = fs.createWriteStream(destPath);
  
  readStream.pipe(writeStream);
  
  writeStream.on('finish', () => {
    console.log('File copied using streams');
  });
}


// fs.writeFileSync('./source.txt', 'Data to be copied.');
// copyFileUsingStreams('./source.txt', './dest.txt');

///////////////////////////////////////////////////////////////////////////////////

// 3) Create a pipeline that reads a file, compresses it, and writes it to another file.
function compressFile(srcPath, destPath) {
  const gzip = zlib.createGzip();
  const source = fs.createReadStream(srcPath);
  const destination = fs.createWriteStream(destPath);
  
  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred:', err);
    } else {
      console.log('File successfully compressed');
    }
  });
}


// fs.writeFileSync('./data.txt', 'Data to be compressed');
// compressFile('./data.txt', './data.txt.gz');

// ===================================================================================
// PART 2: Simple CRUD Operations Using HTTP
// ===================================================================================


const dbPath = './users.json';
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '[]'); 
}


const readUsers = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));


const writeUsers = (users) => fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

const server = http.createServer((req, res) => {
  
  const sendRes = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  
  const getBody = () => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
    req.on('error', reject);
  });

  
  const userRouteWithId = req.url.match(/^\/user\/(\d+)$/);

  // 4) GET /user -> Gets all users
  if (req.url === '/user' && req.method === 'GET') {
    const users = readUsers();
    return sendRes(200, users);
  }

  // 1) POST /user -> Add new user (ensure email doesn't exist)
  if (req.url === '/user' && req.method === 'POST') {
    return getBody().then(data => {
      const users = readUsers();
      
      const emailExists = users.some(u => u.email === data.email);
      if (emailExists) {
        return sendRes(400, { message: "Email already exists." });
      }

      const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
      const newUser = { id: newId, ...data };
      users.push(newUser);
      writeUsers(users);

      return sendRes(201, { message: "User added successfully." });
    });
  }

  // 5) GET /user/:id -> Get User by ID
  if (userRouteWithId && req.method === 'GET') {
    const id = parseInt(userRouteWithId[1]);
    const users = readUsers();
    const user = users.find(u => u.id === id);

    if (user) {
      return sendRes(200, user);
    } else {
      return sendRes(404, { message: "User not found." });
    }
  }

  // 2) PATCH /user/:id -> Update user details
  if (userRouteWithId && req.method === 'PATCH') {
    const id = parseInt(userRouteWithId[1]);
    return getBody().then(data => {
      const users = readUsers();
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex !== -1) {
        // Update user values
        users[userIndex] = { ...users[userIndex], ...data };
        writeUsers(users);

        
        const updatedKey = Object.keys(data)[0] || 'details';
        return sendRes(200, { message: `User ${updatedKey} updated successfully.` });
      } else {
        return sendRes(404, { message: "User ID not found." });
      }
    });
  }

  // 3) DELETE /user/:id -> Delete user by ID
  if (userRouteWithId && req.method === 'DELETE') {
    const id = parseInt(userRouteWithId[1]);
    let users = readUsers();
    const initialLength = users.length;
    
    users = users.filter(u => u.id !== id);

    if (users.length < initialLength) {
      writeUsers(users);
      return sendRes(200, { message: "User deleted successfully." });
    } else {
      return sendRes(404, { message: "User ID not found." });
    }
  }

  // Handle Unknown Routes
  sendRes(404, { message: "Route not found" });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// ===================================================================================
// PART 3: Node Internals (Answers to theoretical questions)
// ===================================================================================

/*
1. What is the Node.js Event Loop?
The Event Loop is what allows Node.js to perform non-blocking I/O operations (despite JS being single-threaded) by offloading operations to the system kernel whenever possible. It continually monitors the Call Stack and the Callback Queue.

2. What is Libuv and What Role Does It Play in Node.js?
Libuv is a multi-platform C library that provides Node.js with its async I/O capabilities. It manages the Event Loop, the OS-level polling, and maintains the Thread Pool for handling heavy tasks like File System operations.

3. How Does Node.js Handle Asynchronous Operations Under the Hood?
Node.js passes async tasks to Libuv. Libuv delegates them to the OS (like network requests) or to its Thread Pool (like fs modules). Once completed, the callback is pushed to the appropriate Event Queue, which the Event Loop eventually pushes back to the Call Stack.

4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
- Call Stack: Where synchronous code is executed (LIFO).
- Event Queue: Where callbacks wait to be executed after their async task is done (FIFO).
- Event Loop: The manager that looks at the Call Stack; if empty, it takes the first callback from the Event Queue and pushes it to the Stack.

5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?
The Thread Pool is a set of threads managed by Libuv used for heavy tasks that cannot be offloaded to the OS (like crypto, zlib, fs). By default, it has 4 threads. You can set it by changing the environment variable: `process.env.UV_THREADPOOL_SIZE = 4;` (can go up to 1024).

6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?
- Blocking code executes synchronously on the main thread (Call Stack), forcing everything else to wait until it finishes (e.g., readFileSync).
- Non-Blocking code delegates the heavy work to Libuv and immediately registers a callback. The main thread continues running the rest of the script (e.g., readFile).
*/