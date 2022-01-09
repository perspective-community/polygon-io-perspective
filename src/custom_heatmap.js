import {} from "@finos/perspective-viewer-d3fc";

function create_custom(name) {
    const D3fcHeatmap = customElements.get(`perspective-viewer-d3fc-${name}`);

    class CustomHeatmap extends D3fcHeatmap {
        _style;

        constructor() {
            super();
            this._style = document.createElement("style");
            this._style.innerHTML = `
                line {
                    stroke: rgba(9, 33, 50) !important;
                    stroke-dasharray: 4,4 !important;
                }
            `;
        }

        async draw(view) {
            await super.draw(view);
            if (!this._style.isConnected) {
                this.shadowRoot?.appendChild(this._style);
            }
        }

        get name() {
            return `Custom ${name.slice(0, 1).toUpperCase() + name.slice(1)}`;
        }
    }

    customElements.define(`custom-${name}`, CustomHeatmap);
    customElements.get("perspective-viewer").registerPlugin(`custom-${name}`);
}

create_custom("heatmap");
create_custom("yline");
create_custom("ybar");