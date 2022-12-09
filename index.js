const http=require('http');
const fs=require('fs');
const requests=require('requests');

const homeFile=fs.readFileSync("main.html","utf-8");
const homeFilecss=fs.readFileSync("style.css","utf-8");
const homeFilejs=fs.readFileSync("script.js","utf-8");

const replaceval=(tempval,orgval)=>{
    let temparature=tempval.replace("{%tempval%}",(orgval.main.temp-273.15).toFixed(2));
    temparature=temparature.replace("{%tempmin%}",(orgval.main.temp_min-273.15).toFixed(2));
    temparature=temparature.replace("{%tempmax%}",(orgval.main.temp_max-273.15).toFixed(2));
    temparature=temparature.replace("{%location%}",orgval.name);
    temparature=temparature.replace("{%country%}",orgval.sys.country);
    temparature=temparature.replace("{%tempstatus}",orgval.weather[0].main);
    return temparature;
};

const server=http.createServer((req,res)=>{
    if(req.url=='/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=jalpaiguri&appid=b7c72353b1ff02ddecc6da5e0a4944f1"
        )
        .on("data",(chunk)=>{
            const value=JSON.parse(chunk);
            const arrData=[value];
            const rtd=arrData.map(val=>replaceval(homeFile,val)).join("");
            res.write(rtd);
        })
        .on("end",(err)=>{
            if(err){
                return console.log("connection closed due to errors",err);
            }
            res.end();
        })
    }
})

server.listen(8000,"127.0.0.1")