import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import perspective from "@finos/perspective";
import chroma from "chroma-js";

import "@finos/perspective-workspace";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

import "./components/custom_datagrid";
// import "./components/custom_heatmap";
// eslint-disable-next-line import/no-webpack-loader-syntax
import scrollbars from "!raw-loader!./style/scrollbar.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Workspace from "./components/workspace";
import {getClients, schemas, getTickerReferenceData, getBars} from "./data";
import layout1 from "./layouts/layout1.json";
import layout2 from "./layouts/layout2.json";

import "./style/index.css";
import "@finos/perspective-workspace/dist/umd/material.dark.css";

window.chroma = chroma;

const worker = perspective.shared_worker();

const makeTables = async () => {
  const ret = {};
  await Promise.all(
    Object.keys(schemas).map(async (key) => {
      ret[key] = await worker.table(schemas[key]);
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
      const [reference, bars] = await Promise.all([getTickerReferenceData(ticker), getBars(ticker)]);

      // load it if it exists
      if (reference.length > 0) {
        tables.reference.update(reference);
      }

      if (bars.length > 0) {
        tables.bars.update(bars);
      }
    }
  }, [tables, ticker]);

  /**
   * Layout
   */
  // layout
  const [layout, changeLayout] = useState(layout1);
  const [layouts, changeLayouts] = useState({});
  useEffect(() => {
    const startingLayouts = {
      "Layout 1": layout1,
      "Layout 2": layout2,
    };

    // Restore a saved config or default
    const customLayout = window.localStorage.getItem("polygon_io_perspective_workspace_config");
    if (customLayout) {
      changeLayouts({...startingLayouts, "Custom Layout": JSON.parse(customLayout)});
    }
  }, []);

  // restore layout when it changes
  useEffect(() => document.getElementsByTagName("perspective-workspace")[0].restore(layout), [layout]);

  /**
   * Return nodes
   */
  return (
    <div id="main" className="container">
      <Header layout={layout} changeLayout={changeLayout} layouts={layouts} changeApiKey={changeApiKey} ticker={ticker} changeTicker={changeTicker} />
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
