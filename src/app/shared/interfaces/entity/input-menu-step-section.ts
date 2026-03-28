export interface InputMenuStepSectionStepSection {
    name: string;
    description: string;
    routerLink: string | null;
    component: any;
    text: string | null;
    menu: any | null;
    selected: boolean;
}

export interface InputMenuStepSectionStep {
    name: string;
    key: string;
    component: any;
    text: string | null;
    routerLink: string | null;
    section: InputMenuStepSectionStepSection[];
}