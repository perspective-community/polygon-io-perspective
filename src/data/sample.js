import referenceData from "./sample/reference.json";
import referenceDataAAPL from "./sample/reference-aapl.json";
import referenceDataIBM from "./sample/reference-ibm.json";
import referenceDataMSFT from "./sample/reference-msft.json";
import barsAAPL from "./sample/bars-aapl.json";
import barsIBM from "./sample/bars-ibm.json";
import barsMSFT from "./sample/bars-msft.json";

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
};

export default SampleData;
