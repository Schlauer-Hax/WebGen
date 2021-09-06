import { Component } from "../../types";
import { custom, span } from "../Components";

export const Icon = (icon: string, ...classList: string[]): Component => {
    const webgenIcon: string = (globalThis as any).WEBGEN_ICON;
    if (webgenIcon == "material")
        return custom("span", icon, "material-icons-round", "webgen-icon", ...classList)
    else if (webgenIcon == "bootstrap")
        return custom("span", undefined, "bi", "bi-" + icon, "webgen-icon", ...classList)
    else
        return span("")
};

export const enum CommonIconType {
    ArrowDown,
    Done,
    Close,
    Download,
    Edit,
    Delete
}

export const CommonIcon = (icon: CommonIconType): string => {
    const webgenIcon: string = (globalThis as any).WEBGEN_ICON;
    let mapping: { [ type in CommonIconType ]: [ material: string, bootstrap: string ] } = {
        [ CommonIconType.ArrowDown ]: [ "expand_more", "chevron-down" ],
        [ CommonIconType.Done ]: [ "done", "check2" ],
        [ CommonIconType.Close ]: [ "close", "x-lg" ],
        [ CommonIconType.Download ]: [ "get_app", "cloud-download" ],
        [ CommonIconType.Edit ]: [ "edit", "pencil" ],
        [ CommonIconType.Delete ]: [ "delete", "trash" ]
    };

    return mapping![ icon ][ webgenIcon == "material" ? 0 : 1 ]
}