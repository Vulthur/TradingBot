export const TimeFormatBitmex = {
    "1m": 60000,
    "1h": 60000 * 60,
    "1d": 60000 * 60 * 24
}

export const ConfigBitmex = {
    //url: "https://www.bitmex.com",
    //apiId: "rtmOa1wh7fQy0qMhfh2_LA2O",
    //apiSecret: "ZHNjHi7S5lhbRc3OFZhVSW2bLuzDWrITyuXZ2OwDD1bGwLtK",
    url: "https://testnet.bitmex.com",
    apiId: "TFbKu9t7SzpEw5gHzaree93x",
    apiSecret: "35TpDwZcpchy9WmlFO1E1KDeqOBbEL3lrIX-434BUsSPqsHP",
    getDataMode: "GET",
    getDataPath: "/api/v1/trade/bucketed",
    sendOrderMode: "POST",
    sendOrderPath: "/api/v1/order",
    columns: "close",
    nbMaxDataByRequest: 750,
    reverse: true,
}

export const ConfigBitmexBot = {
    wsUrl: "wss://www.bitmex.com/realtime",
}