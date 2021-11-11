// import * as my_dongle from 'bleuio'
// import 'regenerator-runtime/runtime'
let port,
    reader,
    inputDone,
    outputDone,
    inputStream,
    outputStream,
    arr = [];
document.getElementById('connect').addEventListener('click', async function(){
    (port = await navigator.serial.requestPort()), await port.open({ baudRate: 9600 });
    const t = new TextEncoderStream();
    (outputDone = t.readable.pipeTo(port.writable)), (outputStream = t.writable);
    let e = new TextDecoderStream();
    (inputDone = port.readable.pipeTo(e.writable)), (inputStream = e.readable.pipeThrough(new TransformStream(new LineBreakTransformer()))), (reader = inputStream.getReader());
})


const readcommand = async () => {
    try {
        const response = await fetch('https://dev.smartsensordevices.com/bleuio_ra_api/api.php/readcommand',{
            method: "GET"
          });
         const data = await response.json();
         let t= (writeCmd(data), readLoop(data))
         return t;
       } catch(error) {
          console.log(error)
         } 
    }
const stopProcess =()=>{
    writeCmd("")
}
const writeResponse = async (res) => {
    try {
        const response = await fetch('https://dev.smartsensordevices.com/bleuio_ra_api/api.php/senddongleresponse', {
            method: 'POST',        
            body: JSON.stringify({
                response: JSON.stringify(res)
                })
            });
            const data = await response.json();
        } catch(error) {
            console.log(error)
            } 
    }
    setInterval(function(){         
        if(port){
            readcommand().then(x=>{
                writeResponse(x)
                console.log(x)
            })
        }
     }, 5000);

function writeCmd(t) {
    const e = outputStream.getWriter();
    e.write(t), "" !== t && e.write("\r"), e.releaseLock();
}
class LineBreakTransformer {
    constructor() {
        this.container = "";
    }
    transform(t, e) {
        this.container += t;
        const r = this.container.split("\r\n");
        (this.container = r.pop()), r.forEach((t) => e.enqueue(t));
    }
    flush(t) {
        t.enqueue(this.container);
    }
}
async function readLoop(t, e) {
    for (arr = []; ; ) {
        const { done: r, value: a } = await reader.read();  
        a && arr.push(a)
        if(t=='ATI'){
            if (arr.includes("Not Advertising") || arr.includes("Advertising")) return arr;
        }
        else if(t=='AT+CENTRAL'){
            return "Central Mode";
        }
        else if(t=='AT+PERIPHERAL'){
            return "Peripheral Mode";
        } 
        else if(t=='AT+DUAL'){
            return "Dual Mode";
        }
        else if(t=='AT+ADVSTART'){
            return "Advertising";
        } 
        else if(t=='AT+ADVSTOP'){
            return "Advertising Stopped";
        }
        else if(t=='AT+GAPSTATUS'){
            if (arr.includes("Not Advertising") || arr.includes("Advertising")) return arr;
        }
        else if(t.includes('AT+GAPSCAN')){
            if(e===true)
                arr.some(function(v){ if (v.indexOf("RSSI")>=0 && a!='') console.log(a) })
            if (arr.includes("SCAN COMPLETE")) return arr;
            
        } 
        
        
        
    }
    
}
