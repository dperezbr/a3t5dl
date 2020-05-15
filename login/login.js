const axios = require("axios");
var FormData = require('form-data');
var request = require('request');
var querystring = require('querystring');
var qs = require('qs');

/**
 *    https://github.com/ytdl-org/youtube-dl/issues/16277#issuecomment-542453373
 * 
 *    I can already get the "ATPSESSION" cookie.
 *    It's needed a free account to view the content.
 *
 *    A POST request to https://account.atresmedia.com/api/login with username and password returns a session cookie named "SESSION". But to get the cookie named "ATPSESSION" it's needed another GET request to https://api.atresplayer.com/login with the "SESSION" cookie in header. This last request generate a OAuth flow (authorize, callback, more stuff) and returns the "ATPSESSION" cookie.
 *    payload = {"username": "your_user", "password": "your_password"}
 *    login_url = "https://account.atresmedia.com/api/login"
 *    session.post(login_url, payload)
 *
 *    redirect_url = "https://api.atresplayer.com/login"
 *    session.get(redirect_url)
 *
 *    vod_url = "https://www.atresplayer.com/lasexta/programas/al-rojo-vivo/octubre-2019/15-10-19-grande-marlaska-los-mossos-actuaron-con-proporcionalidad-para-que-los-ciudadanos-ejercieran-su-derecho-a-la-movilidad_5da5b3fe7ed1a8dfd87d1822/"
 *    vod_data = session.get(vod_url).text
 *
 *    regex = r"window\.__PRELOADED_STATE__ = (.*?);"
 *    matches = re.finditer(regex, vod_data, re.MULTILINE)
 *    vod_text = [match for match in matches][0].groups()[0]
 *    vod_info = json.loads(vod_text)
 *    vod_info = [value for k, value in vod_info["links"].items()][0]
 *
 *    id_vod_url = vod_info["href"]
 *    id_vod_info = session.get(id_vod_url).json()
 *
 *    video_url = id_vod_info["urlVideo"]
 *    video_info = session.get(video_url).json()
 *    print(json.dumps(video_info["sources"], indent=4))
 */
const loginForm ="https://api.atresplayer.com/login?redirect="
const login_url = "https://account.atresmedia.com/api/login";
const login_url2= "https://api.atresplayer.com/login "

 function main (user, password){
    console.log("login for "+user,password);

    var form = {
        username: user,
        password: password,
    };
    

    this.doLogin = async () => {
        try {
          //const getLogin = await axios.get(loginForm,{withCredentials: true});
          //console.log(getLogin.headers);
          const response = await axios.post(login_url,qs.stringify(form),{'Content-Type': 'application/x-www-form-urlencoded',withCredentials: true });          
          const data = response.data;
          //console.log(response.headers['set-cookie']);
          const response2 = await axios.get(login_url2,{withCredentials: true, Cookie :response.headers['set-cookie'] });
          const data2 = response2.data;
          console.log(data2);
          console.log(response2.headers);
          //const response3 = await axios.get("https://api.atresplayer.com/player/v1/episode/5a942d0e7ed1a8cd801486fe",{withCredentials: true,Cookie :response.headers['set-cookie']});
          //const data3 = response3.data;
          //console.log("****DATA*****:",data3);
        //   request({
        //     headers: {
        //       'Content-Length': contentLength,
        //       'Content-Type': 'application/x-www-form-urlencoded',
        //       withCredentials:true,
        //     },
        //     uri: login_url,
        //     body: formData,
        //     method: 'POST'
        //   }, function (err, res, body) {
        //     //it works!
        //     if(err){
        //         console.log(err);
        //     }
        //     console.log(res.headers);
        //     console.log(body);
        //   });

        } catch (error) {
          console.log(error);
        }
      };
      
      

    
    
    this.parse = (url)=>{
        
        console.log("parsing...",url);
    }


    return this;
 }

 
 module.exports = main;
