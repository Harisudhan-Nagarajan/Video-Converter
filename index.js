var app = require("electron").app;
var ipc = require("electron").ipcMain;
var BrowserWindow = require("electron").BrowserWindow;//to create window in  application 
var os = require("os");//to find os of device
var { dialog } = require("electron");//used to open dialogbox

//mainWindow value initially null
var mainWindow = null;

//initialize main window when app is ready
app.on("ready", function () {
  mainWindow = new BrowserWindow({
    resizable: true,//we can resize if we want
    height: 600,//default height of app
    width: 800,//default width of app
    webPreferences: {
      nodeIntegration: true, // to use  node modules within application
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  //to load html file
  mainWindow.loadURL("file://" + __dirname + "/main.html");

  //when closed agin mainWindow become null
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
});

//excute when render send "open-folder-dialog" 
ipc.on("open-folder-dialog",function(event){
    //checking system os
    if (os.platform() === "linux" || os.platform() === "win32") {
        dialog//open dialog box
          .showOpenDialog(null, {
            properties: ["openDirectory"],//used to select folder 
          })
          .then((result) => {
            event.sender.send("folder-selected", result.filePaths[0]);//sending "folder-selected" to render
          })
          .catch((err) => console.log(err));
      } else {//for mac
        dialog
          .showOpenDialog(null, {
            properties: ["openDirectory"],
          })
          .then((result) => {
            event.sender.send("folder-selected", result.filePaths[0]);//sending "folder-selected" to render
          })
          .catch((err) => console.log(err));
      }
})

//excute when render send "open-file-dialog-for-file" 
ipc.on("open-file-dialog-for-file", function (event) {
  console.log("button pressed");
  //checking os
  if (os.platform() === "linux" || os.platform() === "win32") {
    dialog//open dialog box
      .showOpenDialog(null, {
        properties: ["openFile"],//select files
      })
      .then((result) => {
        console.log(result.filePaths);
        event.sender.send("file-selected", result.filePaths[0]);//sending "file-selected" to render
      })
      .catch((err) => console.log(err));
  } else {
    dialog
      .showOpenDialog(null, {
        properties: ["openFile"],
      })
      .then((result) => {
        console.log(result.filePaths);
        event.sender.send("file-selected", result.filePaths[0]);
      })
      .catch((err) => console.log(err));
  }
});
