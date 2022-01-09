/* eslint-disable no-param-reassign */

function make_image(td, metadata) {
  td.style.background = "";
  td.style.border = ``;
  const link = metadata.value;
  const span = document.createElement("span");
  const img = document.createElement("img");
  img.style.maxHeight = "50px";
  img.style.maxWidth = "100px";

  // omit
  // img.setAttribute("crossorigin", "anonymous");
  // set direct
  img.setAttribute("src", link);

  td.textContent = "";
  span.appendChild(img);
  td.appendChild(span);
}

function make_link(td, clean_name) {
  td.textContent = "";
  const link = document.createElement("a");
  link.setAttribute("href", clean_name);
  link.textContent = "Website";
  td.appendChild(link);
}

function make_clear(td) {
  td.style.border = ``;
  td.style.background = "";
  td.style.color = "";
}

class CustomDatagridPlugin extends customElements.get("perspective-viewer-datagrid") {
  get name() {
    return "Custom Datagrid";
  }

  async styleListener() {
    const {datagrid} = this;
    if (this._dirty) {
      await this.refresh_cache();
    }

    datagrid.querySelectorAll("td").forEach((td) => {
      const metadata = datagrid.getMeta(td);

      let column_name;
      if (metadata.x >= 0) {
        const column_path = this._column_paths[metadata.x];
        const column_path_parts = column_path.split("|");
        column_name = column_path_parts[column_path_parts.length - 1];
      } else {
        column_name = this._row_pivots[metadata.row_header_x - 1];
      }
      const clean_name = metadata.value && metadata.value.trim && metadata.value.trim();

      if (column_name === "logo") {
        make_image(td, metadata);
      } else if (column_name === "url") {
        make_link(td, clean_name);
      } else {
        make_clear(td);
      }
    });
  }

  async refresh_cache() {
    const view = this._view;
    this._column_paths = await view.column_paths();
    this._row_pivots = await view.get_config().row_pivots;
    this._schema = await view.schema();
    this._dirty = false;
  }

  async activate(view) {
    await super.activate(view);
    this._view = view;
    this._dirty = true;
    if (!this._custom_initialized) {
      const viewer = this.parentElement;
      const {datagrid} = this;
      this._max = -Infinity;
      await this.refresh_cache(view);
      const table = await viewer.getTable(true);
      this._table_schema = await table.schema();
      viewer.addEventListener("perspective-config-update", async () => {
        this._max = -Infinity;
        this._dirty = true;
      });

      this._custom_initialized = true;
      datagrid.addStyleListener(this.styleListener.bind(this));
    }
  }
}

customElements.define("perspective-viewer-custom-datagrid", CustomDatagridPlugin);

customElements.get("perspective-viewer").registerPlugin("perspective-viewer-custom-datagrid");
