import { Bot } from "./Bot";
import { Strategy } from "../../core/Strategy/Strategy";
import { IApiData } from "../../server/ApiData/IApiData";
import { ConfigBitmex, TimeFormatBitmex } from "../../config/Plateforms/ConfigBitMex";
import * as WebSocket from "ws";

export class BotBitMex extends Bot {
    
    constructor($name: string, $strategys: Array<Strategy>,
        $apiData: IApiData, $format: string, $factorTime: number, $symbol: string) {
            super($name, $strategys, $apiData, $format, $factorTime, $symbol)
    }

    public init(): void {
        let wss = new WebSocket(ConfigBitmex.wsUrl);
        wss.on('open', function open() {
            wss.send('help');
        });
        wss.on('message', function incoming(data) {
            console.log(data);
        });
    }
    public run(): void {
        
    }
    public stop(): void {
        
    }
    public ping(): void {
        
    }
    public onNewData(): void {
        
    }
    public onError(): void {
        
    }
}