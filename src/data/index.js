import {restClient, websocketClient} from "@polygon.io/client-js";
import moment from "moment";
import SampleData from "./sample";

let currentApiKey = "";
let currentClients;

export const schemas = {
  reference: {
    logo: "string",
    listdate: "date",
    cik: "string",
    bloomberg: "string",
    figi: "string",
    lei: "string",
    sic: "string",
    country: "string",
    industry: "string",
    sector: "string",
    marketcap: "integer",
    employees: "integer",
    phone: "string",
    ceo: "string",
    url: "string",
    description: "string",
    exchange: "string",
    name: "string",
    symbol: "string",
    exchangeSymbol: "string",
    hq_address: "string",
    hq_state: "string",
    hq_country: "string",
    type: "string",
    updated: "date",
    tags: "string",
    similar: "string",
    active: "boolean",
  },
  bars: {
    symbol: "string",
    datetime: "date",
    open: "float",
    high: "float",
    low: "float",
    close: "float",
    trades: "integer",
    volume: "integer",
    vwap: "float",
  },
};

export const getClients = (apiKey) => {
  console.debug(`instantiating clients with ${apiKey}`);

  if (apiKey !== currentApiKey) {
    currentApiKey = apiKey;

    // new client
    currentClients = {
      rest: restClient(currentApiKey),
      websocket: websocketClient(currentApiKey),
    };
  }
  return currentClients;
};

export const getReferenceData = async (search) => {
  if (currentClients) {
    return (await currentClients.rest.reference.tickers({limit: 50, search})).results;
  }
  return SampleData.reference;
};

export const getTickerReferenceData = async (symbol) => {
  let rawData;
  if (currentClients) {
    rawData = await currentClients.rest.reference.tickerDetails(symbol);
  } else {
    rawData = SampleData.referenceTicker[symbol];
  }

  // if not in our sample data or nonexistent, return nothing
  if (!rawData) return [];

  // flatten
  rawData.tags = rawData.tags.join(",");
  rawData.similar = rawData.similar.join(",");

  // envelop in array
  return [rawData];
};

export const getBars = async (symbol) => {
  let rawData;
  const to = moment().format("YYYY-MM-DD");
  const from = moment(to).subtract(6, "months").format("YYYY-MM-DD");

  if (currentClients) {
    rawData = await currentClients.rest.stocks.aggregates(symbol, 1, "day", from, to);
  } else {
    rawData = SampleData.bars[symbol];
  }

  // if not in our sample data or nonexistent, return nothing
  if (!rawData) return [];

  // flatten
  return rawData.results.map((record) => ({
    volume: record.v,
    vwap: record.vw,
    open: record.o,
    high: record.h,
    low: record.l,
    close: record.c,
    datetime: record.t,
    trades: record.n,
    symbol,
  }));
};
