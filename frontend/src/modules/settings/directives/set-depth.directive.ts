import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[setDepth]'
})
export class SetDepthDirective {

    @Input('setDepth') depth: number;

    constructor(private el: ElementRef) { 

    }

    ngOnInit(){
        console.log(this.depth);
        let myMargin = this.depth * 40;
        this.el.nativeElement.style.marginLeft = myMargin + 'px';
    }

    // private highlight(color: string) {
    //     this.el.nativeElement.style.backgroundColor = color;
    // }
}