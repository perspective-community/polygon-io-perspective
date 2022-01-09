import React from "react";
import ReactDOM from "react-dom";
import perspective from "@finos/perspective";
import chroma from "chroma-js";

import "@finos/perspective-workspace";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

import "./components/custom_heatmap";
import "./components/custom_datagrid";
import Header from "./components/header";
import Footer from "./components/footer";
import Workspace from "./components/workspace";

import "./style/index.css";
import "@finos/perspective-workspace/dist/umd/material.dark.css";

window.chroma = chroma;

const worker = perspective.shared_worker();

const getTable = async () => {
  const req = fetch("./cleaned.arrow");
  const resp = await req;
  const buffer = await resp.arrayBuffer();
  // eslint-disable-next-line no-return-await
  return await worker.table(buffer);
};

function App() {
  return (
    <div id="main" className="container">
      <Header />
      <Workspace table={getTable()} />
      <Footer />
    </div>
  );
}

window.addEventListener("load", () => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
