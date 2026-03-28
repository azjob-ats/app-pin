import { List } from "@shared/interfaces/base/pages-total-records";
import { InputMenuStepSectionResponse } from "@shared/interfaces/dto/response/input-menu-step-section";
import { InputMenuStepSectionStep } from "@shared/interfaces/entity/input-menu-step-section";


export class InputMenuStepSectionMap {
    public static toEntity(response: InputMenuStepSectionResponse): List<InputMenuStepSectionStep[]> {
        const data: InputMenuStepSectionStep[] = response.data.map(
            (item): InputMenuStepSectionStep => ({
                name: item.name,
                key: item.key,
                component: item.component,
                text: item.text,
                routerLink: item.routerLink,
                section: item.section,
            })
        );

        return {
            ...response,
            data
        };
    }
}