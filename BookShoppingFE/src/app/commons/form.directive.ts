import { Directive, ElementRef } from '@angular/core';


@Directive({
  selector: '[appFocusInvalidInput]',
  exportAs: 'focusInvalidInput'
})

export class FormDirective {

  constructor(private el: ElementRef) { }

  public focus(): void {
    const invalidControl = this.el.nativeElement.querySelectorAll('input.ng-invalid');
    if (invalidControl.length > 0) {
      invalidControl[0].focus();
    }
  }
}
