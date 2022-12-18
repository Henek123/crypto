let data = []
let crypto = "BTC"
const callAPI = async function(symbol) {
  let url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=KIPI8OWFYIA80UQX`;
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}
const filter = async function(i){
  if(data.length < 1){
    data = [await callAPI(crypto)]
  }
  console.log(data);
  let arr = [];
  for (let key in data[0]["Time Series (Digital Currency Daily)"]) {
    if(i < 1) break;
    let myDate = new Date(key);
    arr.push([myDate, data[0]["Time Series (Digital Currency Daily)"][`${key}`]["1a. open (USD)"],]);
    i--;
  }
  console.log(arr);
  document.querySelector(".graph").innerHTML = "";
  //reding dimensions of container
  let graph = document.querySelector(".graph");
  let width = graph.offsetWidth;
  let height = graph.offsetHeight;

  //adding svg to container
  d3.select(".graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  //setting x scale
  const scaleX = d3.scaleTime()
    .domain(d3.extent(arr, (d) => d[0]))
.range([50, width * 0.9])
  d3.select("svg")
    .append("g")
    .attr("transform", `translate(0, ${height - 25})`)
    .call(d3.axisBottom(scaleX))
  d3.axisBottom()

  //setting y scale
  const scaleY = d3
    .scaleLinear()
    .domain([
      d3.min(arr, (d) => d[1] - d[1] * 0.2),
      d3.max(arr, (d) => parseInt(d[1]) * 1.05),
    ])
    .range([height - 25, 25]);
  d3.select("svg")
    .append("g")
    .attr("transform", "translate(50, 0)")
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
    );

  //setting aspect ration
  // d3.select("svg")
  //   .attr("viewBox", "0 0 760 450")
  //   .attr("preserveAspectRatio", "xMidYMid meet")
}

//adding listeners
document.addEventListener("DOMContentLoaded", () => filter(180));

document.getElementById("5day-btn").addEventListener("click", () => filter(5));
document.getElementById("30day-btn").addEventListener("click", () => filter(30));
document.getElementById("6month-btn").addEventListener("click", () => filter(180));
document.getElementById("1year-btn").addEventListener("click", () => filter(365));
document.getElementById("2year-btn").addEventListener("click", () => filter(730));

document.getElementById("btc").addEventListener("click", () => {
  crypto = "BTC";
  data = [];
  filter(30);
})
document.getElementById("eth").addEventListener("click", () => {
  crypto = "ETH";
  data = [];
  filter(30);
})
document.getElementById("doge").addEventListener("click", () => {
  crypto = "DOGE";
  data = [];
  filter(30);
})
document.getElementById("terra").addEventListener("click", () => {
  crypto = "LUNA";
  data = [];
  filter(30);
})
document.getElementById("polka").addEventListener("click", () => {
  crypto = "DOT";
  data = [];
  filter(30);
})