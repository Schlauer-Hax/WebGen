import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement, mIcon } from "../Components";
import '../../css/checkbox.webgen.static.css';
import { conditionalCSSClass } from "../Helper";

export const Checkbox = ({ color, selected, toggledOn }: {
    color?: Color,
    selected?: boolean,
    toggledOn?: (value: boolean) => void,
}): Component => {
    let button = createElement("div") as HTMLDivElement;
    button.classList.add("wcheckbox", color ?? Color.Grayscaled)
    if (selected) button.classList.add("selected");

    button.append(mIcon("done"))

    button.onclick = () => {
        if (button.classList.contains(Color.Disabled)) return;
        conditionalCSSClass(button, !button.classList.contains("selected"), "selected");

        setTimeout(() => toggledOn?.(button.classList.contains("selected")), 300)
    }
    return button;
}