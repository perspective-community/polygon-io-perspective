import React, {useState, useEffect, useCallback} from "react";
import ReactDOM from "react-dom";
import perspective from "@finos/perspective";
import chroma from "chroma-js";

import "@finos/perspective-workspace";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

import "./components/custom_datagrid";
// eslint-disable-next-line import/no-webpack-loader-syntax
import scrollbars from "!raw-loader!./style/scrollbar.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Workspace from "./components/workspace";
import {getClients, schemas, indexes, getTickerReferenceData, getBars, getNews, getDividends, getSplits} from "./data";
import layout1 from "./layouts/layout1.json";
import layout2 from "./layouts/layout2.json";

import "./style/index.css";
import "@finos/perspective-workspace/dist/umd/material-dark.css";

window.chroma = chroma;

const worker = perspective.shared_worker();

const makeTables = async () => {
  const ret = {};
  await Promise.all(
    Object.keys(schemas).map(async (key) => {
      ret[key] = await worker.table(schemas[key], indexes[key]);
    })
  );
  return ret;
};

function App() {
  /**
   * API and clients
   */
  // api key
  const [apiKey, changeApiKey] = useState("");

  // instantiate clients on change
  useEffect(() => getClients(apiKey), [apiKey]);

  /**
   * Ticker
   */
  const [ticker, changeTicker] = useState("");

  /**
   * Tables
   */

  // instantiate base tables from schemas
  const [tables, setTables] = useState(undefined);
  useEffect(async () => setTables(await makeTables()), []);

  // update tables on client/ticker change
  useEffect(async () => {
    if (ticker && tables) {
      // grab reference data
      const [reference, bars, news, dividends, splits] = await Promise.all([getTickerReferenceData(ticker), getBars(ticker), getNews(ticker), getDividends(ticker), getSplits(ticker)]);

      // load it if it exists
      if (reference.length > 0) {
        tables.reference.update(reference);
      }

      if (bars.length > 0) {
        tables.bars.update(bars);
      }

      if (news.length > 0) {
        tables.news.update(news);
      }

      if (dividends.length > 0) {
        tables.dividends.update(dividends);
      }

      if (splits.length > 0) {
        tables.splits.update(splits);
      }
    }
  }, [tables, ticker]);

  /**
   * Layout
   */
  // layout
  const [layout, changeLayout] = useState("Layout 1");
  const [layouts, changeLayouts] = useState({
    "Layout 1": layout1,
    "Layout 2": layout2,
  });

  // restore layout when it changes
  useEffect(() => document.getElementsByTagName("perspective-workspace")[0].restore(layout), [layout]);

  /**
   * Return nodes
   */
  return (
    <div id="main" className="container">
      <Header layout={layout} changeLayout={changeLayout} layouts={layouts} changeLayouts={changeLayouts} changeApiKey={changeApiKey} ticker={ticker} changeTicker={changeTicker} />
      <Workspace tables={tables} layout={layout} layouts={layouts} changeLayouts={changeLayouts} />
      <Footer />
    </div>
  );
}

window.addEventListener("load", () => {
  ReactDOM.render(<App />, document.getElementById("root"));

  // make matching scrollbars
  document.querySelectorAll("perspective-workspace").forEach((workspace) => {
    const style = document.createElement("style");
    style.innerHTML = scrollbars.toString();
    workspace.shadowRoot.appendChild(style);
  });
});
