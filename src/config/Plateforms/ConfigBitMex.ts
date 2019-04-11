export const TimeFormatBitmex = {
    "1m": 60000,
    "1h": 60000 * 60,
    "1d": 60000 * 60 * 24
}

export const ConfigBitmex = {
    url: "https://www.bitmex.com",
    apiId: "rtmOa1wh7fQy0qMhfh2_LA2O",
    apiSecret: "ZHNjHi7S5lhbRc3OFZhVSW2bLuzDWrITyuXZ2OwDD1bGwLtK",
    getDataMode: "GET",
    getDataPath: "/api/v1/trade/bucketed",
    columns: "close",
    nbMaxDataByRequest: 750,
    reverse: true,
    wsUrl: "wss://www.bitmex.com/realtime"
}