import { Fragment } from "react";
import SearchBar from "../SearchBar/SearchBar.jsx";
import "./FilterToolbar.css";

export function FilterToolbar({
  as: Component = "div",
  className = "",
  items = [],
  actions = [],
  onSubmit,
  
}) {
  const wrapperClass = ["filters-toolbar", className].filter(Boolean).join(" ");
  const content = (
    <>
      {items.map((item, idx) => {
        const key = item.key || `${item.type || "item"}-${idx}`;
        const label = item.label;
        const labelNode = label ? (
          <label className={item.labelClassName || ""}>{label}</label>
        ) : null;

        let control = null;
        if (item.type === "search") {
          control = (
            <SearchBar
              value={item.value}
              onChange={item.onChange}
              placeholder={item.placeholder}
              wrapperClassName={item.wrapperClassName || ""}
              inputClassName={item.inputClassName || ""}
              height={item.height}
              width={item.width}
            />
          );
        } else if (item.type === "select") {
          control = (
            <select
              className={item.className || ""}
              value={item.value}
              onChange={item.onChange}
              aria-label={item.ariaLabel || item.label || "Filtre"}
            >
              {(item.options || []).map((opt) => (
                <option key={opt.value ?? opt.label} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        } else if (item.type === "input") {
          control = (
            <input
              className={item.className || ""}
              type={item.inputType || "text"}
              value={item.value}
              onChange={item.onChange}
              placeholder={item.placeholder}
            />
          );
        } 

        if (item.type === "search") {
          return <Fragment key={key}>{control}</Fragment>;
        }

        if (item.wrapperClassName) {
          return (
            <div key={key} className={item.wrapperClassName}>
              {labelNode}
              {control}
            </div>
          );
        }

        return (
          <Fragment key={key}>
            {labelNode}
            {control}
          </Fragment>
        );
      })}
      {actions.map((node, idx) => (
        <Fragment key={`action-${idx}`}>{node}</Fragment>
      ))}
    </>
  );


  return (
    <Component className={wrapperClass}>
      {content}
    </Component>
  );
}
