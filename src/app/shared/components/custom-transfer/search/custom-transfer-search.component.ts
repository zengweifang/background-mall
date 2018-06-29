import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'custom-transfer-search',
  templateUrl: './custom-transfer-search.component.html',
  styleUrls: ['./custom-transfer-search.component.scss']
})
export class CustomTransferSearchComponent {
  // region: fields
  @Input() placeholder: string;
  @Input() value: string;

  @Output() valueChanged = new EventEmitter<string>();
  @Output() valueClear = new EventEmitter();

  // endregion

  _handle(): void {
    this.valueChanged.emit(this.value);
  }

  _clear(): void {
    this.value = '';
    this.valueClear.emit();
  }
}
