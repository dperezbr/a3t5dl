/**
 * https://telecinco1-vh.akamaihd.net/i/nogeo/BO/tq/BOtq4GoYetY4H9fE1f9XQ4/cksOdDl62SZ0jAG49n1my4.700,,.mp4.csmil/index_0_av.m3u8?null=0&hdntl=exp=1589130609~acl=%2fi%2fnogeo%2fBO%2ftq%2fBOtq4GoYetY4H9fE1f9XQ4%2fcksOdDl62SZ0jAG49n1my4.700,,.mp4.csmil%2f*~data=hdntl~hmac=e1ab36396564acde904bd8e68ccaed2110c890cae3f5ff1871389a59bd2d9f70
 * https://telecinco1-vh.akamaihd.net/i/nogeo/Ui/wN/UiwNwA8SM4TsYy3Ex2Pwd5/WuuvoqR3tD669AHlQVG0M4.700,,.mp4.csmil/index_0_av.m3u8?null=0&hdntl=exp=1589130625~acl=%2fi%2fnogeo%2fUi%2fwN%2fUiwNwA8SM4TsYy3Ex2Pwd5%2fWuuvoqR3tD669AHlQVG0M4.700,,.mp4.csmil%2f*~data=hdntl~hmac=551a1c52e8ad81342cc68ef086392c2f3e18eaaf9dca13fc94099fcfcf4eafcd
 * https://telecinco1-vh.akamaihd.net/i/nogeo/Ah/tC/AhtCJxI0q6cwguZq913JY3/NlYn4EmH3D5xC3LflF56A2.700,,.mp4.csmil/index_0_av.m3u8?null=0&hdntl=exp=1589130647~acl=%2fi%2fnogeo%2fAh%2ftC%2fAhtCJxI0q6cwguZq913JY3%2fNlYn4EmH3D5xC3LflF56A2.700,,.mp4.csmil%2f*~data=hdntl~hmac=d9fba823d22b841a730a4e789bab8ee84be935f25ffbb5eb0f369a4d5fbbbe6d
 * https://telecinco1-vh.akamaihd.net/i/nogeo/L3/bY/L3bYG2eYD1a6PYHTSzlLI2/1OkSLThKCMzborNJ3XO9B5.700,,.mp4.csmil/index_0_av.m3u8?null=0&hdntl=exp=1589126822~acl=%2fi%2fnogeo%2fL3%2fbY%2fL3bYG2eYD1a6PYHTSzlLI2%2f1OkSLThKCMzborNJ3XO9B5.700,,.mp4.csmil%2f*~data=hdntl~hmac=eb179bb05e650c9f77369b9a825ccf825cd830b48bc32f86d9dc5be54cd86094
 */

 /**
  * ffmpeg -i "${URL}" -c copy output3.mp4
  */
 const { exec, spawn } = require('child_process');
 
 function tele5() {
    this.URL = null,
    this.filename = null,
    this.valid = false;
 }

 tele5.prototype.check = function(request,page) { 
    if(request.url().indexOf("index_0_av.m3u8")!=-1){
        console.log("detected!!");
        this.URL = request.url();
        this.valid = true;
        this.download(page);
    }
 }
 tele5.prototype.download = async function(npage){

    var confirmacion = await npage.evaluate(`(()=>{
        return confirm("Video detectado. ¿Descargar?");
    })()`);

    if(!confirmacion){
        return;
    }
    console.log("4 evaluate");
    await npage.evaluate(`(()=>{
        confirm("Descargando video...tardará un rato.");
    })()`);

    var filename = "video"+new Date().getTime();

    var ytdl= spawn('./ffmpeg',["-i",this.URL,'-c','copy',`${filename}.mp4`]);

    ytdl.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    ytdl.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    ytdl.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        npage.evaluate(`(()=>{
            alert("Se supone que ha terminado. Si ha ido muy rápido, mal. ");
        })()`);
    });
 }

module.exports = tele5;