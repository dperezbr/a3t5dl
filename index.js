//const puppeteer = require('puppeteer');
var path = require('path');
const { exec, spawn } = require('child_process');
const tele5 = require ('./scrappers/tele5');
const a3 = require ('./scrappers/a3media'); 
const Foo = require('./utils/chrome');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const puppeteer = require('puppeteer-extra')

// var path = require('path');
// if (process.pkg) {
//   var puppeteer = require(path.resolve(process.cwd(), 'puppeteer'));
// } else {
//   var puppeteer = require('puppeteer');
// }



async function main(){

    var isWin = process.platform === "win32";
    // Support for pkg
    const executablePath = isWin ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    // process.env.PUPPETEER_EXECUTABLE_PATH ||
    // (process.pkg
    //   ? path.join(
    //       path.dirname(process.execPath),
    //       'puppeteer',
    //       ...puppeteer
    //         .executablePath()
    //         .split(path.sep)
    //         .slice(6), // /snapshot/project/node_modules/puppeteer/.local-chromium
    //     )
    //   : puppeteer.executablePath());

    console.log(executablePath);

    console.log("start");


    var c = new Foo();
    var t5 = new tele5();
    var a3m = new a3();

    try {
        puppeteer.use(AdblockerPlugin());
        const browser = await puppeteer.launch({
            executablePath,
            headless: false,
            defaultViewport: null,
            userDataDir: 'test-profile-dir',
            args: [
              //'--incognito'
            ],
          });
      
          const pages = await browser.pages();

          const page = pages[0];
          const page1 = await browser.newPage();
      
          await page.goto('https://www.atresplayer.com');
          await page1.goto('https://www.telecinco.es/acorralados/acorralados-2011/galas-integras/4011208/');
          await page1.waitFor(4000);
          await page.waitFor(4000);
          await page1.addStyleTag({content: 'div[class*="adsInfo__"]{display: none !important}'})



          await page.setRequestInterception(true);
          await page1.setRequestInterception(true);

          page.on('request', interceptedRequest => {
              //console.log("evaluating request: "+interceptedRequest.url());
              a3m.check(interceptedRequest,page);
              interceptedRequest.continue();
          });

          page1.on('request', interceptedRequest => {
            //console.log("evaluating request: "+interceptedRequest.url());
            t5.check(interceptedRequest,page1);
            interceptedRequest.continue();
        });
      
        //   page.on('domcontentloaded',async function(a,b,c){
        //       console.log(await page.evaluate(() => location.href));
        //   });
      
        //   await page.waitFor(4000);
      

          browser.on('targetchanged', async function (target){
            await page1.addStyleTag({content: 'div[class*="adsInfo__"]{display: none !important}'})
          });
        //     const npage = await target.page();
        //     //console.log(npage);
        //     if(!npage) return;
        //     console.log("npage exists");
        //     checkLocation(npage);
        //   });

        //   browser.on('targetcreated', async function (target){
        //     console.log("targetcreated");
        //     const npage = await target.page();
        //     console.log(npage);
        //     // if(!npage) await npage.waitFor(1000);
        //     // console.log("wait end");
        //     if(!npage) return;

        //     console.log("npage exists");
            
        //     checkLocation(npage);
        //   });

        //   checkLocation = async (npage)=>{
        //     const currentlocation = await npage.evaluate(`(() => location?location.href:"no location available")()`)
        //     console.log(currentlocation);
        //     console.log('https://account.atresmedia.com/edit');


        //     //https://api.atresplayer.com/player/v1/episode/5a9423767ed1a8cd77b5aebe
        //     //var regex = currentlocation.match(/https\:\/\/api.atresplayer.com\/player\/v1\/episode\/([a-zA-Z0-9]*)/);

        //     const {groups : {display_id, id} } = /https?:\/\/(?:www\.)?atresplayer\.com\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\/(?<display_id>.+?)_(?<id>[0-9a-f]{24})/.exec(currentlocation);

        //     console.log(display_id,id);

            
        //   }

    } catch (error) {
        console.log(error);
    }



}

function ff(){
    
}

if (require.main === module){
    main();
}

module.exports = main;
