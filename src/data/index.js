import { restClient, websocketClient } from "@polygon.io/client-js";
import moment from "moment";
import SampleData from "./sample";

let currentApiKey = "";
let currentClients;

export const schemas = {
  reference: {
    ticker: "string",
    name: "string",
    market: "string",
    locale: "string",
    primary_exchange: "string",
    type: "string",
    active: "boolean",
    currency_name: "string",
    cik: "string",
    composite_figi: "string",
    share_class_figi: "string",
    market_cap: "integer",
    phone_number: "string",
    address: "string",
    description: "string",
    sic_code: "string",
    sic_description: "string",
    ticker_root: "string",
    homepage_url: "string",
    total_employees: "integer",
    list_date: "date",
    logo_url: "string",
    icon_url: "string",
    share_class_shares_outstanding: "integer",
    weighted_shares_outstanding: "integer",
  },
  bars: {
    ticker: "string",
    datetime: "date",
    open: "float",
    high: "float",
    low: "float",
    close: "float",
    trades: "integer",
    volume: "integer",
    vwap: "float",
  },
  news: {
    id: "string",
    ticker: "string",
    publisher_name: "string",
    publisher_url: "string",
    publisher_logo: "string",
    title: "string",
    author: "string",
    published_utc: "datetime",
    article_url: "string",
    tickers: "string",
    image_url: "string",
    description: "string",
  },
  dividends: {
    ticker: "string",
    exDate: "date",
    paymentDate: "date",
    recordDate: "date",
    amount: "float",
  },
  splits: {
    ticker: "string",
    exDate: "date",
    paymentDate: "date",
    declaredDate: "date",
    ratio: "float",
    tofactor: "float",
    forfactor: "float",
  },
  snapshot: {
    "day-close": "float",
    "day-high": "float",
    "day-low": "float",
    "day-open": "float",
    "day-volume": "integer",
    "day-avpx": "float",
    "last-price": "float",
    "last-size": "float",
    "last-exchange": "string",
    "prev-close": "float",
    "prev-high": "float",
    "prev-low": "float",
    "prev-open": "float",
    "prev-volume": "integer",
    "prev-avpx": "float",
    ticker: "string",
    todaysChange: "float",
    todaysChangePerc: "float",
    updated: "datetime",
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
    return (await currentClients.rest.reference.tickers({ limit: 50, search }))
      .results;
  }
  return SampleData.reference;
};

export const getTickerReferenceData = async (symbol) => {
  let rawData;
  if (currentClients) {
    rawData = (await currentClients.rest.reference.tickerDetails(symbol)).results;
  } else {
    rawData = SampleData.referenceTicker[symbol];
  }

  // if not in our sample data or nonexistent, return nothing
  if (!rawData) return [];

  // flatten
  if (typeof rawData.address === "object") {
    rawData.address = `${rawData.address.adress1}, ${rawData.address.city}, ${rawData.address.state} ${rawData.address.postal_code}`;
  }

  rawData.logo_url = rawData.branding.logo_url;
  rawData.icon_url = rawData.branding.icon_url;

  // envelop in array
  return [rawData];
};

export const getBars = async (symbol) => {
  let rawData;
  const to = moment().format("YYYY-MM-DD");
  const from = moment(to).subtract(6, "months").format("YYYY-MM-DD");

  if (currentClients) {
    rawData = (
      await currentClients.rest.stocks.aggregates(symbol, 1, "day", from, to)
    ).results;
  } else {
    rawData = SampleData.bars[symbol];
  }

  // if not in our sample data or nonexistent, return nothing
  if (!rawData) return [];

  // flatten
  return rawData.map((record) => ({
    volume: record.v,
    vwap: record.vw,
    open: record.o,
    high: record.h,
    low: record.l,
    close: record.c,
    datetime: record.t,
    trades: record.n,
    ticker: symbol,
  }));
};

export const getNews = async (symbol) => {
  let rawData;

  if (currentClients) {
    rawData = (
      await currentClients.rest.reference.tickerNews({ ticker: symbol })
    ).results;
  } else {
    rawData = SampleData.news[symbol];
  }

  // if not in our sample data or nonexistent, return nothing
  if (!rawData) return [];

  // flatten
  return rawData.map((record) => ({
    id: record.id,
    ticker: symbol,
    publisher_name: record.publisher.name,
    publisher_url: record.publisher.homepage_url,
    publisher_logo: record.publisher.logo_url,
    title: record.title,
    author: record.author,
    published_utc: record.published_utc,
    article_url: record.article_url,
    tickers: record.tickers.join(","),
    image_url: record.image_url,
    description: record.description,
  }));
};

export const getDividends = async (symbol) => {
  let rawData;

  if (currentClients) {
    rawData = (await currentClients.rest.reference.stockDividends(symbol))
      .results;
  } else {
    rawData = SampleData.dividends[symbol];
  }

  // if not in our sample data or nonexistent, return nothing
  if (!rawData) return [];

  return rawData;
};

export const getSplits = async (symbol) => {
  let rawData;

  if (currentClients) {
    rawData = (await currentClients.rest.reference.stockSplits(symbol)).results;
  } else {
    rawData = SampleData.splits[symbol];
  }

  // if not in our sample data or nonexistent, return nothing
  if (!rawData) return [];

  return rawData.map((record) => ({
    ticker: record.ticker,
    exDate: record.exDate,
    paymentDate: record.paymentDate,
    declaredDate: record.declaredDate,
    ratio: record.ratio,
    tofactor: record.tofactor || null,
    forfactor: record.forfactor || null,
  }));
};
