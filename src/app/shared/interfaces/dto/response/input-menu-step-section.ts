import { List } from "../../base/pages-total-records";

export interface StepSectionResponse {
    name: string;
    description: string;
    routerLink: string | null;
    component: any;
    text: string | null;
    menu: any | null;
    selected: boolean;
}

export interface StepResponse {
    name: string;
    key: string;
    component: any;
    text: string | null;
    routerLink: string | null;
    section: StepSectionResponse[];
}

export interface InputMenuStepSectionResponse extends List {
    data: StepResponse[];
}