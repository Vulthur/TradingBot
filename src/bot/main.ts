import { BotBitMex } from './Bots/BotBitMex';
import { ApiDataBitMex } from '../server/ApiData/ApiDataBitMex';
import { StrategyBollinger } from '../core/Strategy/StrategyBollinger';

let apiDataBitMex = new ApiDataBitMex();
let strat = new StrategyBollinger('test', 10, 0.1, 2, 20, 2, 0x000000, 0x0000FF);

apiDataBitMex.callApi(
    {
        symbol: "ADAU19",
        side: "Sell",
        orderQty: 1,
        orderType: "Stop",
        stopPx: 0.00000420
    },
    "POST",
    "/api/v1/order",
).then((data: any) => {
    console.log(data);
}).catch((error: any) => {
    console.error(error);
});
apiDataBitMex.callApi(
    {
        symbol: "ADAU19",
        side: "Buy",
        orderQty: 1,
        orderType: "Market",
    },
    "POST",
    "/api/v1/order",
).then((data: any) => {
    console.log(data);
}).catch((error: any) => {
    console.error(error);
});

// let testBot = new BotBitMex('test', strat, apiDataBitMex, "1m", 1, "ETHUSD");
// testBot.init().then(() => {
//     testBot.run();
// }).catch((error: Error) => {
//     console.error(error.toString());
// });