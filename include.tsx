import * as React from "react";
import CqUtils from "./CqUtils";
import AemComponent from "./component/AemComponent";
import {Sling} from "./store/Sling";

export interface IncludeProps {
    path: string;
    resourceType: string;
    element?: string;
    hidden?: boolean;
}


export class ResourceInclude extends AemComponent<IncludeProps, any> {

    public render(): React.ReactElement<any> {
        let innerHTML: string = null;
        if (true) {
            let sling: Sling = this.context.aemContext.container.get("sling");
            innerHTML = sling.includeResource(this.getPath() + "/" + this.props.path, this.props.resourceType);

        }
        /* else {
         innerHTML = "{{{include-resource \"" + this.props.path + "\" \"" + this.props.resourceType + "\"}}}";
         }*/

        if (this.props.hidden) {
            CqUtils.setVisible(this.props.path, false, false);
        }

        return React.createElement(this.props.element || "div", {
            // "data-always-hidden": this.props.hidden,
            hidden: !!this.props.hidden, dangerouslySetInnerHTML: {__html: innerHTML}
        });
    }


}
