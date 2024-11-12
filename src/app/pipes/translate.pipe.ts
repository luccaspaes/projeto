import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string): Observable<string> {
    // Usa o serviço de tradução para traduzir o valor fornecido
    return this.translateService.get(value);
  }
}