import { IApiData } from "./IApiData";
import { Point } from "../../core/Point";
import { ConfigBitmex, TimeFormatBitmex } from "../../config/Plateforms/ConfigBitMex";

import * as request from "request";
import * as crypto from "crypto";

export class ApiDataBitMex implements IApiData {

    private url: string;
    private apiId: string;
    private apiSecret: string;

	constructor() {
		this.url = ConfigBitmex.url;
		this.apiId = ConfigBitmex.apiId;
		this.apiSecret = ConfigBitmex.apiSecret;
	}

    public async getPastData($nbData: number | string, $format: string, $factorTime: number | string, $symbol: string,
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
            throw new ApiDataBitMexError("nbData < 0");
        if(isNaN(nbData))
            throw new ApiDataBitMexError("Number of data not a number");

        if (!($format in TimeFormatBitmex)){
            throw new ApiDataBitMexError("Format is incorrect : " + Object.keys(TimeFormatBitmex));
        }

        if(factorTime < 1)
            throw new ApiDataBitMexError("Time Factor < 1");
        if(isNaN(factorTime))
            throw new ApiDataBitMexError("Time Factor not a number");

        if($symbol === "")
            throw new ApiDataBitMexError("Symbol is empty"); 
        
        // Variables
        let expires = new Date().getTime() + (60 * 1000),
            nbRequest = Math.ceil((nbData * factorTime) / ConfigBitmex.nbMaxDataByRequest),
            data = {},
            postBody = "",
            headers = {},
            returnData: Array<Point> = [],
            arrayPromises: Array<Promise<Array<Point>>> = [],
            timeBetweenReq = TimeFormatBitmex[$format as keyof typeof TimeFormatBitmex] * ConfigBitmex.nbMaxDataByRequest 
                    * factorTime;

        for (let i = 0; i < nbRequest; i++) {
            
            let endTime = lastDate.getTime() - i * timeBetweenReq;

            //Last request
            if (i === nbRequest - 1 && (nbData * factorTime) % ConfigBitmex.nbMaxDataByRequest !== 0){           
                data = {
                    endTime: endTime,
                    count: (nbData * factorTime) % ConfigBitmex.nbMaxDataByRequest,
                    symbol: $symbol,
                    binSize: $format,
                    columns: ConfigBitmex.columns,
                    reverse: ConfigBitmex.reverse
                };
            } else {
                data = {
                    endTime: endTime,
                    count: ConfigBitmex.nbMaxDataByRequest,
                    symbol: $symbol,
                    binSize: $format,
                    columns: ConfigBitmex.columns,
                    reverse: ConfigBitmex.reverse
                };
            }
            
            postBody = JSON.stringify(data);
            headers = {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'api-expires': expires,
                'api-key': this.apiId,
                'api-signature': this.getSignature(postBody, ConfigBitmex.getDataMode, ConfigBitmex.getDataPath, expires)
            };

            var requestOptions = {
                headers: headers,
                url: this.url + ConfigBitmex.getDataPath,
                method: ConfigBitmex.getDataMode,
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
                                data[i][ConfigBitmex.columns]
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
                    returnData = array.concat(returnData);
                }            
            }).catch((error: any) => {
                throw new ApiDataBitMexError(`${JSON.stringify(error)}`);
            });
            
        if(returnData.length === 0){
            throw new ApiDataBitMexError("No data for this values");
        }
        
        return returnData
    };

    public async callApi(datas: object, mode: string, path: string): Promise<any> {
        // Variables
        let expires = new Date().getTime() + (60 * 1000),
            postBody = JSON.stringify(datas),
            headers = {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'api-expires': expires,
                'api-key': this.apiId,
                'api-signature': this.getSignature(postBody, mode, path, expires)
            };

        var requestOptions = {
            headers: headers,
            url: this.url + path,
            method: mode,
            body: postBody
        };

        return new Promise((resolve, reject) =>{
            request(requestOptions, (error: any, response: any, body: any) => {
                if (error) {
                    reject(error);
                    return;
                }

                let data = JSON.parse(body);
                if (data.error) {
                    reject(data.error);
                    return;
                }
                resolve(data);
            });
        })
    }

    private getSignature(postBody: string, mode: string, path: string, expires: number){
        return crypto.createHmac('sha256', this.apiSecret)
            .update(mode + path + expires + postBody)
            .digest('hex');
    }
}

// Error Class
class ApiDataBitMexError extends Error {
    constructor(...params: any) {
        // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
        super(...params);
        this.name = 'ApiDataBitMexError';
    }

    public toString(): string {
        return `${this.stack}`
    }
}