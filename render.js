//requirements
const ipc = require("electron").ipcRenderer; //using ipc, render.js and index.js are comunicating
const randomString = require("random-string"); //used to create random string
const fs = require("fs"); //used to access file system
const process = require("child_process");

//default format
const format = "m3u8";
//global variables for paths
let file_path = null;
let folderr_path = null;

const newproject = document.getElementById("newproject");
const mains = document.getElementById("main");
const alert = document.getElementById("alert");

//onclick on New project button
//send "open-folder-dialog" to index.js
newproject.addEventListener("click", function (event) {
  ipc.send("open-folder-dialog");
  console.log("button clicked");
});

//excute when index.js send "folder-selected"
ipc.on("folder-selected", function (event, paths) {
  let count = null;
  fs.readdir(paths, function (err, files) {
    if (err) console.log(err, "err");

    if (files.length === 0) {
      console.log("h1");
      folderr_path = paths;
      mains.innerHTML = `<h3>Folder Path:${folderr_path}</h3>
      <br/><br/>
      <button class="btn btn-success btn-lg"  id="btnup" onclick={selectfile(event)}>
            Select File
        </button>
        <small><b>Select Only .mp4 file</b></small>
          <div id="hi"></div>`;
    } else {
      console.log("h2");
      alert.innerHTML = `<h2>Please Select Empty folder</h2>`;
    }
  });
});

// onclick  Select File & Convert button
//send "open-file-dialog-for-file" to index.js
const selectfile = (event) => {
  ipc.send("open-file-dialog-for-file");
  console.log("button clicked");
};

//excute when index.js send "file-selected"
ipc.on("file-selected", function (event, paths) {
  file_path = paths;
  if (paths.toLowerCase().includes(".mp4")) {
    mains.innerHTML = `<h3>Folder Path:${folderr_path}</h3><br/>
    <h3>File Path:${file_path}</h3>
    <br/><br/>
    <button class="btn btn-success btn-lg"  id="btnup" onclick={convert()}>
         Convert to HLS
      </button>
      <div ></div>`;
  } else {
    ipc.send("open-file-dialog-for-file");
  }
});
//on clicking  convert video will convert
const convert = () => {
  process.exec(
    `ffmpeg -i "${file_path}" ${folderr_path}/${randomString()}_video.${format}`,
    function (err, stdout, stderr) {
      console.log(stdout);

      Notification.requestPermission().then(function (result) {
        var myNotification = new Notification("Conversion Completed", {
          body: "Your file was successfully converted",
        });
      });
      if (error !== null) {
        console.log("exec error: " + error);
      }
    }
  );
};
