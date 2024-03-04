import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'autolinkPipe'
})
export class AutolinkPipePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
     const result = value?.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });

   return this.sanitizer.bypassSecurityTrustHtml(result);
  }

}
