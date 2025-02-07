import {Pipe, PipeTransform} from '@angular/core';
import {baseUrl} from "@tt/globals";

@Pipe({
  name: 'imgUrl',
  standalone: true,
})
export class ImgUrlPipe implements PipeTransform {
  transform(value: string | null | undefined): string | null {
    if (!value) return null;
    return `${baseUrl}${value}`;
  }
}
