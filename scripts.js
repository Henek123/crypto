//setting starting parameters
let data = [];
let crypto = "BTC";

//calling API
const callAPI = async function(crypto) {
  let url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${crypto}&market=USD&apikey=KIPI8OWFYIA80UQX`;
  try {
      let res = await fetch(url); 
      return await res.json();
  } catch (error) {
      console.log(error);
  }
};
//setting info
const info = async function(crypto, i){
  await drawChart(i);
  const img = document.getElementById("logo");
  const name = document.getElementById("name");
  switch(crypto){
    case "BTC":
      name.textContent = " BitCoin";
      img.src = "./img/btc.webp"
      break;
    case "ETH":
      name.textContent = " Ethereum";
      img.src = "./img/eth.svg"
      break;
    case "XRP":
      name.textContent = " XRP";
      img.src = "./img/xrp.png"
      break;
    case "LUNA":
      name.textContent = " Terra";
      img.src = "./img/luna.webp"
      break;
    case "DOT":
      name.textContent = " PolkaDot";
      img.src = "./img/polka.png"
      break;
  }
};

//filtering data
const filter = async function(i){
  //checking for data in array
  if(data.length < 1){
    data = [await callAPI(crypto)];
  }
  console.log(data);
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
  let graph = document.querySelector(".graph");
  graph.innerHTML = "";
  //reading and setting info
  let max = -1 / 0;
  let min = 1 / 0;
  for (let i = 0; i < arr.length; i++){
    let temp = +arr[i][1];
    if(temp > max) max = temp;
    if(temp < min) min = temp;
  }
  if(arr[0] === undefined){
    graph.style.height = "90%";
    const para = document.createElement("p");
    para.classList.add("error");
    const node = document.createTextNode("Too many API calls in one minute. Please wait.");
    para.appendChild(node);
    graph.appendChild(para);
    graph.classList.add("flex");
  } else if(graph.classList.contains("flex")){
    graph.classList.remove("flex");
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
  let height = width / 2.2;
  let fontSize = "16px";
  let padding = 60;
  if(width < 900)  fontSize = "14px";
  if(width < 650){ 
    padding = 40; 
    height *= 1.3;
    fontSize = "10px";
  }
  //adding svg to container
  d3.select(".graph")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  //setting x scale
  const scaleX = d3.scaleTime()
    .domain(d3.extent(arr, (d) => d[0]))
    .range([padding - 10, width * 0.95])

  const xAxis = d3.axisBottom(scaleX)
    .ticks(5);

  d3.select("svg")
    .append("g")
    .attr("transform", `translate(10, ${height - 25})`)
    .style("font", `${fontSize} times`)
    .call(xAxis);

  //setting y scale
  const scaleY = d3
    .scaleLinear()
    .domain([
      min * 0.95,
      max * 1.05
    ])
    .range([height - 25, 25]);

  const yAxis = d3.axisLeft(scaleY)
    .ticks(5)
    .tickSize(-width * 0.95);

  d3.select("svg")
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .style("font", `${fontSize} times`)
    .call(yAxis)
    .selectAll('.tick line').attr('opacity', 0.25);

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

//adding listeners to range buttons
document.addEventListener("DOMContentLoaded", () => {
  info(crypto, 180);
});
const btn5 = document.getElementById("5day-btn");
btn5.addEventListener("click", () => {
  activeRange(btn5);
  i = 5;
  drawChart(i);
});

const btn30 = document.getElementById("30day-btn")
btn30.addEventListener("click", () => {
  activeRange(btn30);
  i = 30;
  drawChart(i);
});

const btn180 = document.getElementById("6month-btn")
btn180.addEventListener("click", () => {
  activeRange(btn180);
  i = 180;
  drawChart(i);
});

const btn365 = document.getElementById("1year-btn")
btn365.addEventListener("click", () => {
  activeRange(btn365);
  i = 365;
  drawChart(i);
});

const btn730 = document.getElementById("2year-btn")
btn730.addEventListener("click", () => {
  activeRange(btn730);
  i = 730;
  drawChart(i);
});

//adding listeners to crypto buttons
const btc = document.getElementById("btc");
btc.addEventListener("click", () => {
  activeCrypto(btc);
  crypto = "BTC";
  data = [];
  info(crypto, i);
});
const eth = document.getElementById("eth");
eth.addEventListener("click", () => {
  activeCrypto(eth);
  crypto = "ETH";
  data = [];
  info(crypto, i);
});
const xrp = document.getElementById("xrp");
xrp.addEventListener("click", () => {
  activeCrypto(xrp);
  crypto = "XRP";
  data = [];
  info(crypto, i);
});
const terra = document.getElementById("terra");
terra.addEventListener("click", () => {
  activeCrypto(terra);
  crypto = "LUNA";
  data = [];
  info(crypto, i);
});
const polka = document.getElementById("polka");
polka.addEventListener("click", () => {
  activeCrypto(polka);
  crypto = "DOT";
  data = [];
  info(crypto, i);
});
let prevCrypto = btc;
btc.classList.add("active");
const activeCrypto = function(button){
  prevCrypto.classList.remove("active");
  button.classList.add("active");
  prevCrypto = button;
}

//changing the active button
i = 180;
let prevRange = btn180;
prevRange.classList.add("active");
const activeRange = function(button){
  prevRange.classList.remove("active");
  button.classList.add("active");
  prevRange = button;
  return prevRange;
}