import React, {useState, useEffect, useRef} from "react";
import Autosuggest from "react-autosuggest";

import {getReferenceData} from "../data";
import layout1 from "../layouts/layout1.json";

function Header(props) {
  // set API Key
  const {changeApiKey, apiClients} = props;

  // layout
  const [layout, changeLayout] = useState(layout1);

  // search bar state
  const [value, changeValue] = useState("");
  const [suggestions, changeSuggestions] = useState([]);

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

  // restore layout when it changes
  useEffect(() => {
    const workspace = document.getElementsByTagName("perspective-workspace")[0];
    workspace.restore(layout);
  }, [layout]);

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
          getSuggestionValue={(suggestion) => suggestion.ticker}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
      <select className="layout_config" onChange={(e) => changeLayout(e.target.value)}>
        <option value={layout1}>Layout 1</option>
        <option value={layout1}>Layout 2</option>
        <option value={layout1}>Layout 3</option>
      </select>
    </div>
  );
}

export default Header;
