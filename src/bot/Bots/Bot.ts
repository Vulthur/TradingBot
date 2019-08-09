import { Strategy } from "../../core/Strategy/Strategy";
import { IApiData } from "../../server/ApiData/IApiData";

export abstract class Bot {

    protected name: string;
    protected format: string;
    protected symbol: string;
    protected factorTime: number;
    protected strategy: Strategy;
    protected apiData: IApiData;    

    constructor($name: string, $strategy: Strategy, 
            $apiData: IApiData, $format: string, $factorTime: number, $symbol: string){
        this.name = $name;
        this.strategy = $strategy;
        this.apiData = $apiData;
        this.format = $format;
        this.factorTime = $factorTime;
        this.symbol = $symbol;
    }

    public abstract init(): void;
    public abstract run(): void;
    public abstract stop(): void;

}