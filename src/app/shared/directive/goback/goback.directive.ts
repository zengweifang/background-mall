import { Directive, HostListener } from "@angular/core";
import { Location } from "@angular/common";

@Directive({
    selector: '[goback]',
})
export class GoBackDirective{
    private myLocation = null;
    constructor(agLocation: Location) {
        this.myLocation = agLocation;
    }

    @HostListener('click')
    onClick() {
        this.myLocation.back();
    }
}