//P5 :// preload() runs once ,setup() waits until preload() is done
let data, xs, ys;
let model;
let rSlider, gSlider, bSlider;
var lossP, graphP, predictP;
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
  data = loadJSON('colorData-1.json');
  console.log("data loaded");
}

//extract the independent(input-r,g,b) and dependent variable(output-label)
function setup() {
  //create 3 sliders to adjust the color
  //createSlider(min, max, [value], [step])
  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 0);
  bSlider = createSlider(0, 255, 0);
  predictP = createP('color');
  lossP = createP('loss');
  graphP = createP('make a graph of loss against ip batch or epoch');
  console.log("length", data.entries.length);
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
    units: 16, //* 16
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
  train().then(
    (results) => {
      console.log(results.history.loss);
    }
  );

}

async function train() {
  const options = {
    epochs: 80,
    validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      onTrainBegin: () => console.log("Training starts"),
      onTrainEnd: () => console.log("Traing complete"),
      onBatchEnd: async (num, logs) => {
        await tf.nextFrame();
      },
      onEpochEnd: async (num, logs) => {
        //console.log('Epoch: ', num);
        lossP.html("Epoch : " + num + ", Loss: " + logs.loss);
      }
    }
  }

  return await model.fit(xs, ys, options);
}

function draw() {
  let rVal = rSlider.value();
  let gVal = gSlider.value();
  let bVal = bSlider.value();

  background(rVal, gVal, bVal);

  //memory management in tensor flow
  tf.tidy(() => {
    const xs = tf.tensor2d([
      [rVal / 255, gVal / 255, bVal / 255]
    ]);
    let result = model.predict(xs);
    let index = result.argMax(1).dataSync()[0]; //pull out the max prob value
    //console.log(index);
    //label.print();
    predictP.html(labelsList[index]);
  })

  //stroke(255);
  //strokeWeight(5);
  //line(frameCount % width, 0, frameCount % width, height);


}