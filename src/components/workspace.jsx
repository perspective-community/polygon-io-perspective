import React, {useEffect, useRef} from "react";
import {uniqBy} from "lodash";

function Workspace(props) {
  const {tables, layout} = props;
  const {layouts, changeLayouts} = props;
  const workspace = useRef(null);

  useEffect(() => {
    if (tables && workspace.current) {
      // set layout
      (async () => {
        await workspace.current.restore(layout);
        await workspace.current.flush();

        // hide the progress bar
        const progress = document.getElementById("progress");
        progress.setAttribute("style", "display:none;");
      })();

      // load tables into perspective workspace
      Object.keys(tables).forEach((key) => {
        workspace.current.addTable(key, tables[key]);
      });

      // add a listener to update layouts on change
      workspace.current.addEventListener("workspace-layout-update", async () => {
        const modifiedConfig = await workspace.current.save();

        // eslint-disable-next-line no-console
        console.debug("Saving to localStorage:", modifiedConfig);
        window.localStorage.setItem("polygon_io_perspective_workspace_config", JSON.stringify(modifiedConfig));

        // update layouts state overriding the custom one
        if (layouts.length > 0) {
          changeLayouts(uniqBy([{name: "Custom Layout", layout: modifiedConfig}, ...layouts], (datum) => datum.name));
        }
      });
    }
  }, [tables, workspace]);

  return <perspective-workspace ref={workspace} />;
}

export default Workspace;
