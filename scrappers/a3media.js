
const { exec, spawn } = require('child_process');
const axios = require("axios");

function a3media(){
    this.URL = null,
    this.filename = null,
    this.valid = false;
    this.data=null;
}
a3media.prototype.check = function(request,page){
    if(request.url().indexOf("/player/v1/episode")!=-1){
        console.log("detected!!");
        this.URL = request.url();
        this.valid = true;
        this.download(page);
    }
}
a3media.prototype.download = async function(npage){
    const currentlocation = await npage.evaluate(`(() => location?location.href:"no location available")()`);
    try {
        const {groups : {display_id, id} } = /https?:\/\/(?:www\.)?atresplayer\.com\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\/(?<display_id>.+?)_(?<id>[0-9a-f]{24})/.exec(currentlocation);
    } catch (error) {
        console.log("No ids detected");
    }
    //posible id
    if(display_id && id){
        console.log("2 evaluate");


        var getting = await npage.cookies();
        //console.log("GEET "+JSON.stringify(getting));
        var Cookies = getting.map((cookie)=>cookie.name+"="+cookie.value).join(";");// await page.evaluate(() => document.cookie);
        console.log("Cookies;"+Cookies);
        const response = await axios.get("https://api.atresplayer.com/player/v1/episode/"+id,{withCredentials: true,headers:{Cookie :Cookies }});
        const data = response.data;
        console.log(data.sources[1]);
        if(!data || !data.sources || !data.sources[1]){
            return;
        }

        
        console.log("3 evaluate");
        var confirmacion = await npage.evaluate(`(()=>{
            return confirm("Video detectado. ¿Descargar?");
        })()`);

        if(!confirmacion){
            return;
        }
        console.log("4 evaluate");
        await npage.evaluate(`(()=>{
            alert("Descargando video...tardará un rato.");
        })()`);

        var filename = data.titulo || "video";
        var url = data.sources[1].src.replace("https://","http://");
        console.log("Descargando: "+url);
        // var child = exec("youtube-dl -f bestvideo+bestaudio "+url,async function (error, stdout, stderr) {
        //     if (error !== null){
        //         console.log("Success "+stdout, stderr);
        //     }
        // });
        var ytdl= spawn('./youtube-dl',["-f bestvideo+bestaudio",url,`-o "${filename}.%(ext)s"`]);

        ytdl.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        ytdl.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        ytdl.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            npage.evaluate(`((url)=>{
                alert("Se supone que ha terminado. Si ha ido muy rápido, mal. El mpd usado es: "+url);
            })(url)`,url);
        });
    }

}

module.exports = a3media;