import { asWebGenComponent, Component, HTMLComponent } from "../components.ts";
import { alwaysRef, Reference } from "../state.ts";

@asWebGenComponent("box")
export class BoxComponent extends HTMLComponent {
    constructor(component: Reference<Component[] | Component> | Component, components: Component[]) {
        super();
        this.shadowRoot?.append(document.createElement("slot"));
        components.forEach(component => this.append(component.draw()));
        const refComponent = alwaysRef(component);
        this.useListener(refComponent, (current, oldValue) => {
            if (Array.isArray(oldValue)) {
                oldValue.forEach(component => component.draw().remove());
            }
            else if (oldValue) {
                oldValue.draw().remove();
            }

            if (Array.isArray(current))
                current.toReversed().map(component => component.draw()).forEach(component => this.prepend(component));
            else
                this.prepend(current.draw());
        });
    }
}

export function Box(component: Reference<Component[] | Component> | Component, ...components: Component[]) {
    return new BoxComponent(component, components).make();
}
