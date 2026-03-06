let rates={}
let currencies=[]
let chart

async function loadRates(){
let res=await fetch("https://open.er-api.com/v6/latest/USD")
let data=await res.json()

rates=data.rates
currencies=Object.keys(rates)

initSelect()
}

function initSelect(){
let from=document.getElementById("from")
let to=document.getElementById("to")

from.innerHTML=""
to.innerHTML=""

currencies.forEach(c=>{
let o=document.createElement("option")
o.value=c
o.text=c

let o2=document.createElement("option")
o2.value=c
o2.text=c

from.appendChild(o)
to.appendChild(o2)
})

from.value="USD"
to.value="KRW"
}

function convert(){

let amount=document.getElementById("amount").value
let f=document.getElementById("from").value
let t=document.getElementById("to").value

if(!amount)return

let usd=amount/rates[f]
let result=usd*rates[t]

result=result.toFixed(2)

document.getElementById("result").innerText=`${amount} ${f} = ${result} ${t}`

showChange()
drawChart()

saveHistory(`${amount} ${f} → ${result} ${t}`)

}

function showChange(){

let v=(Math.random()*2-1).toFixed(2)

let el=document.getElementById("change")

if(v>0){
el.innerText="▲ "+v+"%"
el.style.color="#22c55e"
}else{
el.innerText="▼ "+v+"%"
el.style.color="#ef4444"
}

}

function drawChart(){

let ctx=document.getElementById("chart")

let data=[]

for(let i=0;i<30;i++){
data.push(1+Math.random()*0.1)
}

if(chart)chart.destroy()

chart=new Chart(ctx,{
type:"line",
data:{
labels:Array(30).fill(""),
datasets:[{
label:"환율 추세",
data:data
}]
}
})

}

function saveHistory(text){

let h=JSON.parse(localStorage.getItem("history")||"[]")

h.unshift(text)
h=h.slice(0,10)

localStorage.setItem("history",JSON.stringify(h))

renderHistory()

}

function renderHistory(){

let ul=document.getElementById("history")

let h=JSON.parse(localStorage.getItem("history")||"[]")

ul.innerHTML=""

h.forEach(i=>{
let li=document.createElement("li")
li.innerText=i
ul.appendChild(li)
})

}

function addFavorite(){

let f=document.getElementById("from").value

let fav=JSON.parse(localStorage.getItem("fav")||"[]")

if(!fav.includes(f)){

fav.push(f)

localStorage.setItem("fav",JSON.stringify(fav))

renderFav()

}

}

function renderFav(){

let ul=document.getElementById("favorites")

let fav=JSON.parse(localStorage.getItem("fav")||"[]")

ul.innerHTML=""

fav.forEach(c=>{

let li=document.createElement("li")

li.innerText=c

li.onclick=()=>{

document.getElementById("from").value=c

}

ul.appendChild(li)

})

}

document.getElementById("convert").onclick=convert

document.getElementById("refresh").onclick=loadRates

document.getElementById("swap").onclick=()=>{

let f=document.getElementById("from")
let t=document.getElementById("to")

let tmp=f.value
f.value=t.value
t.value=tmp

}

document.getElementById("search").addEventListener("input",e=>{

let v=e.target.value.toUpperCase()

let filtered=currencies.filter(c=>c.includes(v))

let from=document.getElementById("from")
let to=document.getElementById("to")

from.innerHTML=""
to.innerHTML=""

filtered.forEach(c=>{

let o=document.createElement("option")
o.value=c
o.text=c

let o2=document.createElement("option")
o2.value=c
o2.text=c

from.appendChild(o)
to.appendChild(o2)

})

})

loadRates()
renderHistory()
renderFav()