import { Point } from "../../core/Point";

export interface IApiData {
    
    getPastData(nbData: number | string, format: string, factorTime: number | string, symbol: string, lastDate: Date | string): Promise<Array<Point>>;
    callApi(datas: object, mode: string, path: string): Promise<any>;
}