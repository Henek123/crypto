//setting starting parameters
let data = []
let crypto = "BTC"
//let i = 180;

//calling API and setting name
const callAPI = async function(crypto) {
  let url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${crypto}&market=USD&apikey=KIPI8OWFYIA80UQX`;
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}
//setting info
const info = async function(crypto){
  await drawChart("180");
  const name = document.getElementById("name");
  switch(crypto){
    case "BTC":
      name.textContent = " BitCoin";
      break;
    case "ETH":
      name.textContent = " Ethereum";
      break;
    case "DOGE":
      name.textContent = " DogeCoin";
      break;
    case "LUNA":
      name.textContent = " Terra";
      break;
    case "DOT":
      name.textContent = " PolkaDot";
      break;
  }
}

//filtering data
const filter = async function(i){
  //checking for data in array
  if(data.length < 1){
    data = [await callAPI(crypto)]
  }
  //filtering array
  let arr = [];
  for (let key in data[0]["Time Series (Digital Currency Daily)"]) {
    if(i < 1) break;
    let myDate = new Date(key);
    arr.push([myDate, data[0]["Time Series (Digital Currency Daily)"][`${key}`]["1a. open (USD)"],]);
    i--;
  }
  return arr;
}

//setting info values
const setValues = async function(i){
  let arr = await filter(i);
  document.querySelector(".graph").innerHTML = "";
  //reading and setting info
  let max = -1 / 0;
  let min = 1 / 0;
  for (let i = 0; i < arr.length; i++){
    let temp = +arr[i][1];
    if(temp > max) max = temp;
    if(temp < min) min = temp;
  }
  document.getElementById("high-value").textContent =  max + " USD";
  document.getElementById("low-value").textContent =  min + " USD";
  document.getElementById("diffrence").textContent = Math.round(((arr[0][1]- arr[arr.length - 1][1])/ arr[0][1])* 10000) / 100 + "%";
  return [arr, min, max];
}

//drawing chart
const drawChart = async function(i){
  let array = await setValues(i);
  let arr = array[0];
  let min = array[1];
  let max = array[2];
  //reding dimensions of container
  let graph = document.querySelector(".graph");
  let width = graph.offsetWidth;
  let height = graph.offsetHeight;

  //adding svg to container
  d3.select(".graph")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("svg-content-responsive", true)

  //setting x scale
  const scaleX = d3.scaleTime()
    .domain(d3.extent(arr, (d) => d[0]))
.range([50, width * 0.9])
  d3.select("svg")
    .append("g")
    .attr("transform", `translate(10, ${height - 25})`)
    .style("font", "16px times")
    .call(d3.axisBottom(scaleX))
  d3.axisBottom()

  //setting y scale
  const scaleY = d3
    .scaleLinear()
    .domain([
      min * 0.95,
      max * 1.05
    ])
    .range([height - 25, 25]);
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(60, 0)")
    .style("font", "16px times")
    .call(d3.axisLeft(scaleY));

  //drawing line
  d3.select("svg")
    .append("path")
    .datum(arr)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3.line()
        .x((d) => scaleX(d[0]))
        .y((d) => scaleY(d[1]))
    )
    .attr("transform", "translate(10, 0)");
}


//adding listeners
document.addEventListener("DOMContentLoaded", () => info(crypto));
document.getElementById("5day-btn").addEventListener("click", () => drawChart(5));
document.getElementById("30day-btn").addEventListener("click", () => drawChart(30));
document.getElementById("6month-btn").addEventListener("click", () => drawChart(180));
document.getElementById("1year-btn").addEventListener("click", () => drawChart(365));
document.getElementById("2year-btn").addEventListener("click", () => drawChart(730));

document.getElementById("btc").addEventListener("click", () => {
  crypto = "BTC";
  data = [];
  info(crypto);
})
document.getElementById("eth").addEventListener("click", () => {
  crypto = "ETH";
  data = [];
  info(crypto);
})
document.getElementById("doge").addEventListener("click", () => {
  crypto = "DOGE";
  data = [];
  info(crypto);
})
document.getElementById("terra").addEventListener("click", () => {
  crypto = "LUNA";
  data = [];
  info(crypto);
})
document.getElementById("polka").addEventListener("click", () => {
  crypto = "DOT";
  data = [];
  info(crypto);
})