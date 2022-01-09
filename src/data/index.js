import {restClient, websocketClient} from "@polygon.io/client-js";
import SampleData from "./sample";

let currentApiKey = "";
let currentClients;

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
