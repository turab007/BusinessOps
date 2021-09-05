import { Directive, Input, ElementRef, OnInit } from '@angular/core';


@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnInit {

  @Input()
  focus: boolean;
  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.element.nativeElement.focus();
  }
}