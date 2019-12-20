//P5 :// preload() runs once ,setup() waits until preload() is done
let data, xs, ys;
let model;
let labelsList = [
  "Green-ish",
  "Blue-ish",
  "Red-ish",
  "Yellow-ish",
  "Pink-ish",
  "Brown-ish",
  "Gray-ish",
  "Purple-ish"
]


//Load the data
function preload() {
  data = loadJSON('colorData .json');
  console.log("data loaded");
}

//extract the independent(input-r,g,b) and dependent variable(output-label)
function setup() {
  //console.log(data.entries.length);
  var colors = []; //i/p
  var labels = []; //o/p

  for (let entry of data.entries) {
    let color = [entry.r / 255, entry.g / 255, entry.b / 255];
    colors.push(color);
    labels.push(labelsList.indexOf(entry.label));
  }
  //console.log(colors);
  //turning into tensors
  xs = tf.tensor2d(colors);
  //xs.print();
  //console.log(labels);

  //One hot encoding for the labels
  //so now we have 9 possible ops as labels which is String
  //but (as we want a probablity value ,so convert this output vectors into 0,1)

  //labels must be a tensor(1d)(integer) to be one hot encodded
  let labelsTensor = tf.tensor1d(labels, 'int32');
  //labelsTensor.print();
  ys = tf.oneHot(labelsTensor, 8);

  /* ys.print();
  [[0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    ...,
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0]]

    */
  //What about memory management in tf
  //dispose the tensors which is not needed,as tf does not come with a garbage collector
  labelsTensor.dispose();

  //Create the Architecture of the neural network Model

  model = tf.sequential();

  //2 layers NN model :1 hidden layer and the  o/p layer
  //1st hidden layer also the 1st layer of our network
  let hidden = tf.layers.dense({
    units: 3,
    activation: 'sigmoid',
    inputDim: 3
  });
  //The Output Layer
  let output = tf.layers.dense({
    units: 8,
    activation: 'softmax'
  })

  //conncet the layers to the model

  model.add(hidden);
  model.add(output);

  //Create an optimizer
  //"meanSquaredError"->"catagorical cross entropy"
  const lr = 0.3; //learning rate
  const optimizer = tf.train.sgd(lr);

  //compile the model
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy' //works well for two probablity distribution
  });

  //fit the model with th i/p nodes and o/p nodes
  //model.fit returns a promise where the resuls will be passed in
  //it means once you fit the model then log the resuls
  train();

}

function train() {
  const options = {
    epochs: 80,
    validationSplit: 0.1,
    shuffle: true
  }
  model.fit(xs, ys, options).then(
    (results) => {
      console.log(results.history.loss);
    }
  );
}

function draw() {
  background(0);
}