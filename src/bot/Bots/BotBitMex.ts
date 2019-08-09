import { Bot } from "./Bot";
import { Strategy } from "../../core/Strategy/Strategy";
import { Point } from "../../core/Point";
import { Graph } from "../../core/Graph";
import { Action } from "../../core/Action/Action";
import { IApiData } from "../../server/ApiData/IApiData";
import { ConfigBitmex, ConfigBitmexBot, TimeFormatBitmex } from "../../config/Plateforms/ConfigBitMex";
import * as WebSocket from "ws";

export class BotBitMex extends Bot {

    private datas: Graph;
    private wss!: WebSocket;
    private pingInterval!: NodeJS.Timeout;
    private isAlive: boolean;
    
    constructor($name: string, $strategy: Strategy, 
            $apiData: IApiData, $format: string, $factorTime: number, $symbol: string) {

        if (!($format in TimeFormatBitmex)) {
            throw new BotBitMexError("Format is incorrect : " + Object.keys(TimeFormatBitmex));
        }

        super($name, $strategy, $apiData, $format, $factorTime, $symbol)
        this.datas = new Graph("BollingerBot", new Array<Point>(), 0x000000, 0);
        this.isAlive = false;
    }

    public async init(): Promise<void> {

        // Get previous Data
        await this.apiData.getPastData(this.strategy.$minData, this.format, this.factorTime, this.symbol, new Date)
            .then((datas: Point[]) => {
                this.datas.$points = datas;
            }).catch((error) => {
                console.error(error.toString());
                throw new BotBitMexError("Init getData");
            });
        
        // https://www.bitmex.com/app/wsAPI
        // https://www.npmjs.com/package/ws
        // https://github.com/typeorm/typeorm

        try {
            this.wss = new WebSocket(ConfigBitmexBot.wsUrl);
            this.wss.on('error', (error: any) => {
                console.error(error);
                throw new BotBitMexError("WS: " + error);
            });
            this.wss.on('open', () => {
                this.isAlive = true;
                this.wss.send(JSON.stringify({
                    op: "subscribe",
                    args: ["tradeBin1m:" + this.symbol]
                }));
            });
            this.wss.on('close', () => {
                clearInterval(this.pingInterval);
                console.log('WS: Socket Close');
            }); 
            this.wss.on('pong', () => {
                this.isAlive = true;              
            });
        } catch (error) {
            console.error(error);
            throw new BotBitMexError("Bot: Error Init WS");
        }
    }

    public run(): void {
        // Start timer to check the connectin
        this.pingInterval = setInterval(() => {
            if (this.isAlive === false) {
                return this.wss.terminate();
            }

            this.isAlive = false;
            this.wss.ping(() => {});
        }, 5000);

        this.wss.on('message', (dataString: string) => {
            console.log("WS: New Datas");

            let dataJson = JSON.parse(dataString);
            if(!dataJson.table){
                return;
            }

            for (let i = 0; i < dataJson.data.length; i++) {
                let time = new Date(dataJson.data[i].timestamp).getTime();
                let value = dataJson.data[i].close;
                // Add point to the global data of the bot
                this.datas.$points.push(new Point(time, value));       
            }

            // Send data to strat
            let newAction = this.strategy.calculate(this.datas.$points, dataJson.data.length);

            // Do the actions returned !
            // -- Store result of a the trade
        });
    }
    
    public stop(): void {
        clearInterval(this.pingInterval);
        this.wss.terminate();
    }
}

// Error Class
class BotBitMexError extends Error {
    constructor(...params: any) {
        // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
        super(...params);
        this.name = 'BotBitMexError';
    }

    public toString(): string {
        return `${this.stack}`
    }
}