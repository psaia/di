import * as React from "react";
import Events from "./events";
import { BorderType } from "./types";
import State from "./state";
import Lifecycle from "./lifecycle";
import RectLifecycle from "./rect-lifecycle";

export interface UtilityProps {
  globalState: State;
  events: Events;
}
const lineTypes = [
  {
    value: BorderType.Light,
    label: "Light"
  },
  {
    value: BorderType.Heavy,
    label: "Heavy"
  },
  {
    value: BorderType.Double,
    label: "Double"
  },
  {
    value: BorderType.Dashed,
    label: "Dashed"
  },
  {
    value: BorderType.None,
    label: "No Border"
  }
];

export default class UtilityDrawer extends React.Component<UtilityProps> {
  state = {
    component: React.Component
  };
  componentWillMount() {
    this.props.events.subscribe("stateChange", () => this.forceUpdate());
  }
  singleSelectedItem(): Lifecycle | null {
    const all = this.props.globalState.selected();

    // We only care about if there's exactly one selected for now.
    if (all.size !== 1) {
      return null;
    }

    return all.values().next().value;
  }
  render() {
    const selected = this.singleSelectedItem();
    const props = {
      style: {
        background: this.props.globalState.colors.utilityBg
      }
    };

    if (selected === null) {
      return <div className="utility-drawer" {...props} />;
    } else if (selected instanceof RectLifecycle) {
      return (
        <div {...props} className="utility-drawer">
          <select
            defaultValue={selected.shape.options.border}
            onChange={e => {
              const border = lineTypes.filter(
                t => t.value === e.target.value
              )[0].value;
              selected.shape.options.border = border;
            }}
          >
            {lineTypes.map(v => {
              const props = {
                key: v.value,
                value: v.value
              };
              return <option {...props}>{v.label}</option>;
            })}
          </select>
          <input
            type="text"
            autoFocus
            defaultValue={selected.shape.options.text}
            placeholder="Inner Text"
            onChange={e => {
              selected.shape.options.text = e.target.value;
            }}
          />
        </div>
      );
    }
    return <div {...props} className="utility-drawer" />;
  }
}
