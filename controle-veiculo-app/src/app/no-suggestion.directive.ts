import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input' // aplica a todos os <input>
})
export class NoSuggestionDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setAttribute(this.el.nativeElement, 'autocomplete', 'new-password');
    this.renderer.setAttribute(this.el.nativeElement, 'autocorrect', 'off');
    this.renderer.setAttribute(this.el.nativeElement, 'autocapitalize', 'off');
    this.renderer.setAttribute(this.el.nativeElement, 'spellcheck', 'false');
  }
}
