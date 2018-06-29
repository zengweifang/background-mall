import { Component, OnInit, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import { TransferItem } from "../Item";

@Component({
  selector: 'custom-transfer-list',
  templateUrl: './custom-transfer-list.component.html',
  styleUrls: ['./custom-transfer-list.component.scss']
})
export class CustomTransferListComponent implements DoCheck {
  constructor() {
  }

  @Input() direction: string = '';
  @Input() titleText: string = '';
  @Input() dataSource: TransferItem[] = [];

  @Input() showSearch: boolean = false;

  @Input() searchPlaceholder: string;
  @Input() notFoundContent: string;

  // events
  @Output() handleSelectAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() handleSelect: EventEmitter<TransferItem> = new EventEmitter();
  @Output() filterChange: EventEmitter<{direction: string, value: string}> = new EventEmitter();


  stat = {
    checkAll: false,
    checkHalf: false,
    checkCount: 0,
    shownCount: 0
  }

  onHandleSelectAll(status: boolean): void {
    this.dataSource.forEach(item => {
      if (!item.disabled && !item._hiden) {
        item.checked = status;
      }
    })
    this.updateCheckStatus()
    this.handleSelectAll.emit(status);
  }

  _handleSelect(item: TransferItem): void {
    if (item.disabled) {
      return;
    }
    item.checked = !item.checked;
    this.updateCheckStatus();
    this.handleSelect.emit(item);
  }

  private updateCheckStatus(): void {
    const validCount = this.dataSource.filter(w => !w.disabled).length;
    this.stat.checkCount = this.dataSource.filter(w => w.checked && !w.disabled).length;
    this.stat.shownCount = this.dataSource.filter(w => !w._hiden).length;
    this.stat.checkAll = validCount > 0 && validCount === this.stat.checkCount;
    this.stat.checkHalf = this.stat.checkCount > 0 && !this.stat.checkAll;
  }

  // region: search
  handleFilter(value: string): void {
    if (this.direction === 'left') {
      this.filterChange.emit({direction: this.direction, value});
      return;
    }
    this.dataSource.forEach(item => {
      item._hiden = value.length > 0 && !this.metchFilter(value, item);
    });
    this.stat.shownCount = this.dataSource.filter(w => !w._hiden).length;
  }

  // endregion

  private metchFilter(text: string, item: TransferItem): boolean {
    return item.title.includes(text);
  }
  
  ngDoCheck(): void {
    this.updateCheckStatus();
  }
}
