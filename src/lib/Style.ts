import { blur, dark, light } from '../css/themes';
import { SupportedThemes } from './SupportedThemes';
import { createElement } from "../components/Components";
import { WebGenOptions } from "../webgen";
import { Color } from "./Color";
import { ColorDef } from "../types/Colors";

export class Style {
    private theme: HTMLElement;
    private current: SupportedThemes = SupportedThemes.gray;
    private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    private options: WebGenOptions;

    constructor(options: WebGenOptions) {
        const styleAppendTo = options.defaultElementToHookStylesIn ?? document.documentElement;
        this.options = options;
        if (options.autoLoadFonts ?? true) {
            var roboto = createElement('link') as HTMLLinkElement;
            roboto.rel = "stylesheet";
            roboto.href = "https://fonts.googleapis.com/css?family=Roboto:100,200,300,400,500&display=swap";
            styleAppendTo.append(roboto);
        }
        this.theme = styleAppendTo;
        this.mediaQuery.addEventListener('change', e => {
            if (this.current == SupportedThemes.autoDark || this.current == SupportedThemes.autoLight)
                this.updateTheme(e.matches ? SupportedThemes.autoDark : SupportedThemes.autoLight)
        });
    }

    setImage(src: String) {
        document.body.style.background = `url(${src}) no-repeat center center fixed`;
        document.body.style.backgroundAttachment = "cover";
    }

    clearImage() {
        document.body.style.background = "";
    }
    getTheme = () => this.current
    getColors = (): ColorDef => ({
        [ Color.Critical ]: [ 360, 86, 65, "#333333" ],
        [ Color.Colored ]: [ 227, 85, 65, "#FFFFFF" ],
        [ Color.Grayscaled ]: [ 0, 0, 100, "#333333" ],
        [ Color.Disabled ]: [ 0, 0, 75, "#A0A0A0" ],
    })

    overrideTheme(data: { [ key in string ]: string }) {
        const dataWithDefaults = {
            ...this.getMapping()[ this.current ],
            ...data
        }
        this.applyStyles(dataWithDefaults)
    }

    private mapColorDef(data: ColorDef) {
        const object: { [ key in string ]: string } = {};
        Object.entries(data).forEach(([ color, values ]) => {
            const indexToName = [ "hue", "saturation", "lightness", "font" ];
            values.forEach((value, index) => {
                object[ `--color-${color}-${indexToName[ index ]}` ] = value.toString() + ([ "deg", "%", "%", "" ][ index ]);
            })
        })
        return object;
    }

    private applyStyles(data: { [ x: string ]: string; }) {
        const extendData = {
            ...this.mapColorDef(this.getColors()),
            ...data
        }
        Object.entries(extendData).forEach(([ key, value ]) => this.theme.style.setProperty(key, value))
    }

    updateTheme(theme: SupportedThemes) {
        this.options.events?.themeRefreshed?.(theme, this);
        if (theme === SupportedThemes.auto)
            this.updateTheme(this.mediaQuery.matches ? SupportedThemes.autoDark : SupportedThemes.autoLight);
        else {
            if (this.current == theme) return;
            if (theme === SupportedThemes.gray) this.theme.removeAttribute("style");
            this.applyStyles(this.getMapping()[ theme ]!);
            this.current = theme;
            this.options.events?.themeChanged?.(theme, this);
        }
    }

    private getMapping = (): { [ theme in SupportedThemes ]?: { [ key in string ]: string } } => ({
        [ SupportedThemes.light ]: light,
        [ SupportedThemes.gray ]: {},
        [ SupportedThemes.dark ]: dark,
        [ SupportedThemes.blur ]: blur,
        [ SupportedThemes.autoLight ]: light,
        [ SupportedThemes.autoDark ]: dark,
    });
}