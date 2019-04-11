import { IApiData } from "./IApiData";
import { Point } from "../../core/Point";
import { ConfigBitmex, TimeFormatBitmex } from "../../config/Plateforms/ConfigBitMex";

import * as request from "request";
import * as crypto from "crypto";

export class ApiDataBitMex implements IApiData {

    private url: string;
    private apiId: string;
    private apiSecret: string;
    private getDataMode: string;
    private getDataPath: string;
    private columns: string;
    private nbMaxDataByRequest: number;
    private reverse: boolean;

	constructor() {
		this.url = ConfigBitmex.url;
		this.apiId = ConfigBitmex.apiId;
		this.apiSecret = ConfigBitmex.apiSecret;
		this.getDataMode = ConfigBitmex.getDataMode;
		this.getDataPath = ConfigBitmex.getDataPath;
		this.columns = ConfigBitmex.columns;
		this.nbMaxDataByRequest = ConfigBitmex.nbMaxDataByRequest;
        this.reverse = ConfigBitmex.reverse;
	}

    async getPastData($nbData: number | string, $format: string, $factorTime: number | string, $symbol: string,
            $lastDate: Date | string): Promise<Array<Point>> {

        // OverLoads
        let nbData : number;
        let factorTime : number;
        let lastDate : Date;

        if(!(typeof($nbData) !== "string")){
            nbData = parseInt($nbData);
        } else {
            nbData = $nbData
        }
        if(typeof ($factorTime) === "string") {
            factorTime = parseInt($factorTime);
        } else {
            factorTime = $factorTime
        }
        if(typeof ($lastDate) === "string") {
            lastDate = new Date($lastDate);
        } else {
            lastDate = $lastDate
        }

        // Controles
        if(nbData < 0)
            throw "nbData < 0";
        if(isNaN(nbData))
            throw "Number of data not a number";

        if (!($format in TimeFormatBitmex)){
            throw "Format is incorrect : " + Object.keys(TimeFormatBitmex);
        }

        if(factorTime < 1)
            throw "Time Factor < 1";
        if(isNaN(factorTime))
            throw "Time Factor not a number";

        if($symbol === "")
            throw "Symbol is empty";
        
        
        // Variables
        let expires = new Date().getTime() + (60 * 1000),
            nbRequest = Math.ceil((nbData * factorTime) / this.nbMaxDataByRequest),
            data = {},
            postBody = "",
            headers = {},
            returnData: Array<Point> = [],
            arrayPromises: Array<Promise<Array<Point>>> = [],
            timeBetweenReq = TimeFormatBitmex[$format as keyof typeof TimeFormatBitmex] * this.nbMaxDataByRequest * factorTime;

       

        for (let i = 0; i < nbRequest; i++) {
            
            let endTime = lastDate.getTime() - i * timeBetweenReq;

            //Last request
            if (i === nbRequest - 1 && (nbData * factorTime) % this.nbMaxDataByRequest !== 0){           
                data = {
                    endTime: endTime,
                    count: (nbData * factorTime) % this.nbMaxDataByRequest,
                    symbol: $symbol,
                    binSize: $format,
                    columns: this.columns,
                    reverse: this.reverse
                };
            } else {
                data = {
                    endTime: endTime,
                    count: this.nbMaxDataByRequest,
                    symbol: $symbol,
                    binSize: $format,
                    columns: this.columns,
                    reverse: this.reverse
                };
            }
            
            postBody = JSON.stringify(data);
            headers = {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'api-expires': expires,
                'api-key': this.apiId,
                'api-signature': this.getSignature(postBody, this.getDataMode, this.getDataPath, expires)
            };

            var requestOptions = {
                headers: headers,
                url: this.url + this.getDataPath,
                method: this.getDataMode,
                body: postBody
            };

            arrayPromises.push(new Promise((resolve, reject) => {
                request(requestOptions, (error: any, response: any, body: any) => {

                    if(error){           
                        reject(error);
                        return;
                    }   

                    let data = JSON.parse(body);
                    if (data.error){              
                        reject(data.error);
                        return;
                    }
                    
                    let returnData = [];
                    for (let i = 0; i < data.length; i += factorTime) {
                        returnData.push(
                            new Point(
                                new Date(data[i].timestamp).getTime(),
                                data[i][this.columns]
                                )
                            );
                    }
            
                    resolve(returnData.reverse());
                });
            }));
        }

        await Promise.all(arrayPromises)
            .then(data => {               
                for (let array of data) {
                    //console.log(new Date(array[0].$x), new Date(array[array.length - 1].$x));               
                    returnData = array.concat(returnData);
                }            
            });

        if(returnData.length === 0){
            throw "No data for this values";         
        }
        
        return returnData
    };

    private getSignature(postBody: string, mode: string, path: string, expires: number){
        return crypto.createHmac('sha256', this.apiSecret).update(mode + path + expires + postBody).digest('hex');
    }
}