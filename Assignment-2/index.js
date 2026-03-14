import path from 'path';
import fs from 'fs';
// 1) Write a function that logs the current file path and directory.

function logPaths() {
  const __filename = path.resolve();
  const __dirname = path.dirname(__filename);

  const pathInfo = {
    File: __filename,
    Dir: __dirname
  };

  console.log(pathInfo);
}

logPaths();
///////////////////////////////////////////////////////////////////////////////////

// 2) Write a function that takes a file path and returns its file name.
function getFileName(filePath) {
  return path.basename(filePath);
}

const filePath = '/user/files/report.pdf';
console.log(getFileName(filePath));
///////////////////////////////////////////////////////////////////////////////////

// 3) Write a function that builds a path from an object
function buildPath(pathObj) {
  return path.join(pathObj.dir, pathObj.name + pathObj.ext);
}

const pathObj = {
  dir: '/folder',
  name: 'app',
  ext: '.js'
};

console.log(buildPath(pathObj));  
///////////////////////////////////////////////////////////////////////////////////

// 4) Write a function that returns the file extension from a given file path.
function getFileExtension(filePath) {
  return path.extname(filePath);
}

const filePath2 = '/docs/readme.md';
console.log(getFileExtension(filePath2));
///////////////////////////////////////////////////////////////////////////////////

// 5) Write a function that parses a given path and returns its name and ext.
function parsePath(filePath) {
  return {
    name: path.basename(filePath, path.extname(filePath)),
    ext: path.extname(filePath)
  };
}

const filePath3 = '/home/app/main.js';
console.log(parsePath(filePath3));
///////////////////////////////////////////////////////////////////////////////////

// 6) Write a function that checks whether a given path is absolute.
function isAbsolute(filePath) {
  return path.isAbsolute(filePath);
}

const filePath4 = '/home/user/file.txt';
const filePath5 = 'home/user/file.txt';

console.log(isAbsolute(filePath4)); 
console.log(isAbsolute(filePath5)); 
///////////////////////////////////////////////////////////////////////////////////

// 7) Write a function that joins multiple segments
function joinSegments(...segments) {
  return path.join(...segments);
}

const segment1 = 'src';
const segment2 = 'components';
const segment3 = 'App.js';

console.log(joinSegments(segment1, segment2, segment3)); 
///////////////////////////////////////////////////////////////////////////////////

// 8) Write a function that resolves a relative path to an absolute one.
function resolvePath(relativePath) {
  return path.resolve(relativePath);
}

const relativePath = './src/index.js';
console.log(resolvePath(relativePath)); 
///////////////////////////////////////////////////////////////////////////////////

// 9) Write a function that joins two paths.
function joinTwoPaths(path1, path2) {
  return path.join(path1, path2);
}

const pathA = '/folder1';
const pathB = 'folder2/file.txt';

console.log(joinTwoPaths(pathA, pathB)); 
///////////////////////////////////////////////////////////////////////////////////

// 10) Write a function that deletes a file asynchronously.

function deleteFileAsync(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`File deleted successfully: ${filePath}`);
    }
  });
}

const fileToDelete = './path/to/file.txt';
deleteFileAsync(fileToDelete);  

//////////////////////////////////////////////////////////////////////////////

// 11) Write a function that creates a folder synchronously.
function createFolderSync(folderPath) {
  try {
    fs.mkdirSync(folderPath);
    console.log(`Folder created successfully: ${folderPath}`);
  } catch (err) {
    console.error(`Error creating folder: ${err}`);
  }
}

const newFolderPath = './newFolder';
createFolderSync(newFolderPath);  
///////////////////////////////////////////////////////////////////////////////////

// 12) Create an event emitter that listens for a "start" event and logs a welcome message.
import EventEmitter from 'events';

const emitter = new EventEmitter();

emitter.on('start', () => {
  console.log('Welcome event triggered!');
});

emitter.emit('start');
///////////////////////////////////////////////////////////////////////////////////

// 13) Emit a custom "login" event with a username parameter.
emitter.on('login', (username) => {
  console.log(`User ${username} has logged in.`);
});

emitter.emit('login', 'Ahmed');
///////////////////////////////////////////////////////////////////////////////////

// 14) Read a file synchronously and log its contents.
function readFileSync(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    console.log(`File contents:\n${data}`);
  } catch (err) {
    console.error(`Error reading file: ${err}`);
  }
}

const fileToRead = './notes.txt';
readFileSync(fileToRead);
///////////////////////////////////////////////////////////////////////////////////

// 15) Write asynchronously to a file.
function writeFileSync(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, 'utf-8');
    console.log(`File written successfully: ${filePath}`);
  } catch (err) {
    console.error(`Error writing file: ${err}`);
  }
}

const fileToWrite = './async.txt';
const content = 'Async save';
writeFileSync(fileToWrite, content);  
///////////////////////////////////////////////////////////////////////////////////

// 16) Check if a directory exists.

// هنا المود fs.constants.F_OK ده optional لما دورت عليه تقريبا هو بتاع security permissions بس مش ضروري في كل الحالات

function checkDirectoryExists(dirPath) {
  try {
    fs.accessSync(dirPath, fs.constants.F_OK);
    console.log(`Directory exists: ${dirPath}`);
  } catch (err) {
    console.error(`Directory does not exist: ${dirPath}`);
  }
}

const directoryToCheck = './notes.txt';
checkDirectoryExists(directoryToCheck);  
///////////////////////////////////////////////////////////////////////////////////

// 17) Write a function that returns the OS platform and CPU architecture.
import os from 'os';

function getOSInfo() {
  return {
    platform: os.platform(),
    arch: os.arch()
  };
}

console.log(getOSInfo()); 