var r, g, b;
var database;
const colorBG = () => {
  createCanvas(840, 480).parent('SketchHolder');
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  background(r, g, b);
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