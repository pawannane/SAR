let video; //Variable to hold current video stream
let yolo; //Initializing model method with YOLO. A callback needs to be passed
let status; //Status check to determine whthere the model has been loaded
let objects = []; //List of objects returned from YOLO

function setup() {
  createCanvas(500, 500); //Creating a standard canvas of 320x240 pixels
  video = createCapture(VIDEO); //Capturing live video from webcam
  video.size(500, 500);

  // Creating a YOLO method using ml5
  yolo = ml5.YOLO(video, startDetecting);

  // Hide the original video
  video.hide();
  status = select('#status');
}

function draw() {
  image(video, 0, 0, width, height); // Displaying image on a canvas
  for (let i = 0; i < objects.length; i++)  //Iterating through all objects
  {
    noStroke();
    fill(0, 255, 0); //Color of text
    text(objects[i].label, objects[i].x * width, objects[i].y * height - 5); //Displaying the label
    noFill();
    strokeWeight(4);
    stroke(0, 255, 0); //Defining stroke for rectangular outline
    rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
  }
}

function startDetecting() {
  status.html('Model loaded!'); //When the model is loaded
  detect(); //Calling detect method
}

function detect() {
  yolo.detect(function (err, results) {
    objects = results; //Storing results in object
    detect(); //Continuous detection
  });
}

window.onload = () => {
  $("#sendbutton").click(() => {
    imagebox = $("#imagebox");
    link = $("#link");
    input = $("#imageinput")[0];
    if (input.files && input.files[0]) {
      let formData = new FormData();
      formData.append("video", input.files[0]);
      $.ajax({
        url: "/detect", // fix this to your liking
        type: "POST",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        error: function (data) {
          console.log("upload error", data);
          console.log(data.getAllResponseHeaders());
        },
        success: function (data) {
          console.log(data);
          // bytestring = data["status"];
          // image = bytestring.split("'")[1];
          $("#link").css("visibility", "visible");
          $("#download").attr("href", "static/" + data);
          console.log(data);
        },
      });
    }
  });
};

function readUrl(input) {
  imagebox = $("#imagebox");
  console.log(imagebox);
  console.log("evoked readUrl");
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log(e.target);

      imagebox.attr("src", e.target.result);
      //   imagebox.height(500);
      //   imagebox.width(800);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
