import { Strategy } from "../../core/Strategy/Strategy";
import { IApiData } from "../../server/ApiData/IApiData";

export abstract class Bot {

    private name: string;
    private format: string;
    private symbol: string;
    private factorTime: number;
    private strategys: Array<Strategy>;
    private apiData: IApiData;

    constructor($name: string, $strategys: Array<Strategy>, 
            $apiData: IApiData, $format: string, $factorTime: number, $symbol: string){
        this.name = $name;
        this.strategys = $strategys;
        this.apiData = $apiData;
        this.format = $format;
        this.factorTime = $factorTime;
        this.symbol = $symbol;
    }

    public abstract init() : void;
    public abstract run() : void;
    public abstract stop() : void;
    public abstract ping() : void;
    public abstract onNewData() : void;
    public abstract onError() : void;

}