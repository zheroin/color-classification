//create a separate file for cloring in rectangle
var jsonData = {
  entries: []
}
document.getElementById("ReColorBgButton").style.display = "none";
const colorByLabel = {

  "Green-ish": [],
  "Blue-ish": [],
  'Red-ish': [],
  "Yellow-ish": [],
  "Pink-ish": [],
  "Brown-ish": [],
  "Gray-ish": [],
  "Purple-ish": []
}

var r, g, b;
var database;
const colorBG = () => {

  const visible = document.getElementById("ReColorBgButton").style.display = "none";


  createCanvas(400, 340).parent('SketchHolder');
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  background(r, g, b);
  document.getElementById('SketchHolder').style.backgroundColor = "rgba(" + r + "," + g + "," + b + "," + "0.8)";

}

function setup() {
  //initialize the firebase
  var firebaseConfig = {
    apiKey: "AIzaSyCoXKzIkG9dLWz3VMsoIuudmIqbrM7wI0w",
    authDomain: "color-classification-44e72.firebaseapp.com",
    databaseURL: "https://color-classification-44e72.firebaseio.com",
    projectId: "color-classification-44e72",
    storageBucket: "color-classification-44e72.appspot.com",
    messagingSenderId: "646410998301",
    appId: "1:646410998301:web:42542173f1fcf33e852cf4",
    measurementId: "G-H6JP958G6D"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.firestore();
  colorBG();


}
//function for the buttons

//this will be a multimethods button which will fire giveColor() function
//if it works

const giveColor = (id) => {
  const colorData = document.getElementById(id).innerText;

  console.log(colorData, r, g, b);
  //Send data to firebase
  //create a collection named "color-storage" manually in firebase datanase
  database.collection("colors-storage").add({
      r: r,
      g: g,
      b: b,
      label: colorData
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

  //color the canvas again
  colorBG();

}

const getData = () => {
  database.collection("colors-storage").get().then(

    (querySnapshot) => {
      //console.log(querySnapshot.docs);

      let setOfData = querySnapshot.docs;

      //convert all keys of object to array
      keys = Object.keys(setOfData);
      //console.log(keys.length);

      for (key in keys) {
        //const id=setOfData[key].id;
        const data = setOfData[key].data();

        //store all the datas in a object for downloading
        jsonData.entries.push(data);

        const dataLabel = data.label;
        //console.log(dataLabel);

        let colorBox = color(data.r, data.g, data.b);
        colorByLabel[dataLabel].push(colorBox);
      }
      //console.log(colorByLabel);
      //console.log(querySnapshot);
    });
}


var x = 0,
  y = 0,
  ish = [];

//Visualize in shape of rectangle
const colorData = () => {
  document.getElementById('ReColorBgButton').style.display = "block";
  createCanvas(400, 400).parent('Colors-holder');

  ish = colorByLabel['Yellow-ish'];

  for (let i = 0; i < ish.length; i++) {
    rect(x, y, 40, 40);
    fill(ish[i]);
    noStroke();
    x += 40;
    if (x > width) {
      x = 0;
      y += 40;
    }
  }
}

//Downlaod the data (ColorByLable object)
var downloadData = () => {
  saveJSON(jsonData, 'colorData.json');
}