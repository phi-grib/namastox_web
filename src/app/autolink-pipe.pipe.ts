import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'autolinkPipe'
})
export class AutolinkPipePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
     // Reemplaza los enlaces con la etiqueta de anclaje HTML
     const result = value.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });

   // Sanitiza el resultado para permitir HTML
   return this.sanitizer.bypassSecurityTrustHtml(result);
  }

}
