import { Point } from "../../core/Point";

export interface IApiData {
    
    getPastData(nbData: number | string, format: string, factorTime: number | string, symbol: string, lastDate: Date | string): Promise<Array<Point>>;

}