import React, {useEffect, useRef} from "react";
import layout1 from "../layouts/layout1.json";

function Workspace(props) {
  const {table} = props;
  const workspace = useRef(null);

  useEffect(() => {
    if (workspace.current) {
      // Restore a saved config or default
      const config = window.localStorage.getItem("polygon_io_perspective_workspace_config");

      const layout = config ? JSON.parse(config) : layout1;

      (async () => {
        await workspace.current.restore(layout);
        await workspace.current.flush();
      })();

      workspace.current.addTable("asset_events", table);
      const progress = document.getElementById("progress");
      progress?.setAttribute("style", "display:none;");

      workspace.current.addEventListener("workspace-layout-update", async () => {
        const modifiedConfig = await workspace.current.save();
        // eslint-disable-next-line no-console
        console.debug("Saving to localStorage:", modifiedConfig);
        window.localStorage.setItem("polygon_io_perspective_workspace_config", JSON.stringify(modifiedConfig));
      });
    }
  });

  return <perspective-workspace ref={workspace} />;
}

export default Workspace;
