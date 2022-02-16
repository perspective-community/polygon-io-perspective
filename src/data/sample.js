import referenceData from "./sample/reference.json";

import referenceDataAAPL from "./sample/reference-aapl.json";
import referenceDataIBM from "./sample/reference-ibm.json";
import referenceDataMSFT from "./sample/reference-msft.json";

import barsAAPL from "./sample/bars-aapl.json";
import barsIBM from "./sample/bars-ibm.json";
import barsMSFT from "./sample/bars-msft.json";

import newsAAPL from "./sample/news-aapl.json";
import newsIBM from "./sample/news-ibm.json";
import newsMSFT from "./sample/news-msft.json";

import dividendsAAPL from "./sample/dividends-aapl.json";
import dividendsIBM from "./sample/dividends-ibm.json";
import dividendsMSFT from "./sample/dividends-msft.json";

import splitsAAPL from "./sample/splits-aapl.json";
import splitsIBM from "./sample/splits-ibm.json";
import splitsMSFT from "./sample/splits-msft.json";

const SampleData = {
  reference: referenceData,
  referenceTicker: {
    AAPL: referenceDataAAPL,
    IBM: referenceDataIBM,
    MSFT: referenceDataMSFT,
  },
  bars: {
    AAPL: barsAAPL,
    IBM: barsIBM,
    MSFT: barsMSFT,
  },
  news: {
    AAPL: newsAAPL,
    IBM: newsIBM,
    MSFT: newsMSFT,
  },
  dividends: {
    AAPL: dividendsAAPL,
    IBM: dividendsIBM,
    MSFT: dividendsMSFT,
  },
  splits: {
    AAPL: splitsAAPL,
    IBM: splitsIBM,
    MSFT: splitsMSFT,
  },
};

export default SampleData;
