/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {useState} from "react";
import Autosuggest from "react-autosuggest";

import {getReferenceData} from "../data";

function Header(props) {
  // store ticker and layouts in parent element state
  const {layout, layouts} = props;

  // pass state modifiers in
  const {changeTicker, changeLayout, changeLayouts, changeApiKey} = props;

  // search bar state
  const [suggestions, changeSuggestions] = useState([]);
  const [value, changeValue] = useState("");

  // Autosuggest will call this function every time you need to update suggestions.
  const onSuggestionsFetchRequested = async ({value: searchValue}) => {
    if (searchValue) changeSuggestions(await getReferenceData(searchValue));
  };

  // render a search result
  const renderSuggestion = (suggestion) => (
    <div className="ticker_input_results_container">
      <span className="monospace bold">{suggestion.ticker}</span>
      <span className="pl10">{suggestion.name}</span>
      <span className="pl10">{suggestion.locale.toUpperCase()}</span>
      <span className="pl10">{suggestion.primary_exchange}</span>
    </div>
  );

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Search tickers...",
    value,
    onChange: (event, {newValue}) => changeValue(newValue),
    className: "ticker_input",
  };

  return (
    <div className="header">
      <input className="text_input" type="password" placeholder="Input your API Key" onChange={(e) => changeApiKey(e.target.value)} />
      <div className="ticker_input_container">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={() => changeSuggestions([])}
          onSuggestionSelected={() => changeTicker(value)}
          getSuggestionValue={(suggestion) => suggestion.ticker}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
      <div>
        <select
          className="layout_config"
          onChange={(e) => {
            changeLayout(e.target.value);
          }}
          value={layout}
        >
          {Object.keys(layouts).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <button
          className="text_button"
          type="button"
          onClick={async () => {
            const workspace = document.getElementById("workspace");
            const modifiedConfig = await workspace.save();

            window.localStorage.setItem("polygon_io_perspective_workspace_config", JSON.stringify(modifiedConfig));

            changeLayouts({...layouts, "Custom Layout": modifiedConfig});
            changeLayout("Custom Layout");
          }}
        >
          Save Layout
        </button>
      </div>
    </div>
  );
}

export default Header;
