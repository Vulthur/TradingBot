import { ApiDataBitMex } from './ApiData/ApiDataBitMex';
import { Point } from '../core/Point';
import * as http from 'http';
import * as fs from 'fs';

let apiDataBitMex = new ApiDataBitMex();
let server = http.createServer();
server.listen(80);

// Create server
server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(req.url);

    let body: string = "";
    req.on('readable', () => {
        let data: string = req.read();
        if (data) {
            body += data;
        }
    }).on('end', function () {
        let data: { [index: string]: string }  = {}
        if(body){
            data = JSON.parse(body);
        }

        switch (req.url) {
            case "/":
            case "/index.html":
                fs.readFile('./dist/client/index.html', (err: NodeJS.ErrnoException, data: Buffer) => {
                    if(!err){
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.write(data);
                        res.end();
                    }
                });
                break;
            case "/client.js":
                fs.readFile('./dist/client/client.js', (err: NodeJS.ErrnoException, data: Buffer) => {
                    if (!err) {
                        res.writeHead(200, { "Content-Type": "text/javascript" });
                        res.write(data);
                        res.end();
                    }
                });
                break;
            case "/api/getData":
                apiDataBitMex.getPastData(data["nbData"], data["format"], data["factorTime"], data["symbol"], data["lastDate"])
                    .then((data : Point[]) => {
                        res.writeHead(200, { "Content-Type": "text/json" });
                        res.write(JSON.stringify(data));                        
                        res.end();
                    }).catch((error) => {   
                        console.error(error);
                        res.statusCode = 400,
                        res.statusMessage = error;
                        res.end();
                    })
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end();
                break;       
        }
    }); 
});