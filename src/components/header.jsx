import React from "react";
import layout1 from "../layouts/layout1.json";

function Header() {
  const resetLayout = () => {
    const workspace = document.getElementsByTagName("perspective-workspace")[0];
    workspace.restore(layout1);
  };

  return (
    <div className="header">
      <button type="button" id="reset_config" onClick={resetLayout}>
        Reset to Default Layout
      </button>
    </div>
  );
}

export default Header;
