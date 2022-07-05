import React, {useEffect, useRef} from "react";

function Workspace(props) {
  const {tables} = props;
  const {layout, layouts} = props;
  const workspace = useRef(null);

  // restore layout when it changes
  useEffect(() => {
    if (layout && layouts && workspace.current) {
      workspace.current.restore(layouts[layout]);
    }
  }, [layout]);

  // hide the progress bar
  useEffect(async () => {
    if (workspace.current) {
      const progress = document.getElementById("progress");
      progress.setAttribute("style", "display:none;");
    }
  }, [workspace]);

  useEffect(() => {
    if (tables && workspace.current) {
      // load tables into perspective workspace
      Object.keys(tables).forEach((key) => {
        workspace.current.addTable(key, tables[key]);
      });
    }
  }, [tables, workspace]);

  return <perspective-workspace id="workspace" ref={workspace} />;
}

export default Workspace;
