import React from "react";
import QueryItem from "../QueryItem/QueryItem";
import "./QueryList.css";

function QueryList(props) {
  if (props.items.length === 0)
    return <h2 className="query-list__fallback">No queries yet</h2>;

console.log(props.items)
  return (
    <ul className="query-list">
      {props.items.map((query, idx) => (
        <QueryItem date={query.date} key={idx} id={idx} />
      ))}
    </ul>
  );
}

export default QueryList;
