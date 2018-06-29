import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { utils } from '../../utils/utils';
import { config, service } from '../../../core/core.config';
import { TransferItem } from "./Item";


export interface TransferChange {
  from: string;
  to: string;
  list: TransferItem[];
}

export interface TransferSearchChange {
  direction: string;
  value: string;
}

@Component({
  selector: 'custom-transfer',
  templateUrl: './custom-transfer.component.html',
  styleUrls: ['./custom-transfer.component.scss']
})
export class CustomTransferComponent implements OnChanges {
  constructor() {
  }

  // input
  @Input() nzDataSource: TransferItem[] = [];
  @Input() nzRightDataSource: TransferItem[] = [];
  @Input() nzShowSearch: boolean = false;
  @Input() nzOperations: string[] = [];
  @Input() nzListStyle: object;
  @Input() nzSearchPlaceholder = '请输入';
  @Input() nzNotFoundContent = '无匹配结果';

  // events
  @Output() nzChange: EventEmitter<TransferChange> = new EventEmitter();
  @Output() nzSearchChange: EventEmitter<TransferSearchChange> = new EventEmitter();
  

  // region: process data
  // left
  leftDataSource: TransferItem[] = [];
  // right
  rightDataSource: TransferItem[] = [];

  private splitDataSource(): void {
    this.leftDataSource = this.nzDataSource;
    if (this.nzRightDataSource.length) {
      this.rightDataSource = this.nzRightDataSource;
    }
  }

  private getCheckedData(direction: string): TransferItem[] {
    return this[direction === 'left' ? 'leftDataSource' : 'rightDataSource'].filter(w => w.checked);
  }

  handleLeftSelectAll = (checked: boolean) => this.handleSelect('left', checked);
  handleRightSelectAll = (checked: boolean) => this.handleSelect('right', checked);

  handleLeftSelect = (item: TransferItem) => this.handleSelect('left', item.checked, item);
  handleRightSelect = (item: TransferItem) => this.handleSelect('right', item.checked, item);

  handleSelect(direction: 'left' | 'right', checked: boolean, item?: TransferItem): void {
    const list = this.getCheckedData(direction);
    this.updateOperationStatus(direction, list.length);
  }

  handleFilterChange(ret: {direction: string, value: string}): void {
    this.nzSearchChange.emit(ret);
  }

  // endregion

  // region: operaition

  leftActive = false;
  rightActive = false;


  private updateOperationStatus(direction: string, count?: number): void {
    this[direction === 'right' ? 'leftActive' : 'rightActive'] = (typeof count === 'undefined' ? this.getCheckedData(direction).filter(w => !w.disabled).length : count) > 0;
  }

  moveToLeft = () => this.moveTo('left');
  moveToRight = () => this.moveTo('right');

  moveTo(direction: string): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    this.updateOperationStatus(oppositeDirection, 0);
    const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const moveList = datasource.filter(item => item.checked === true && !item.disabled)
    this.truthMoveTo(direction, moveList.filter(i => !!i))
  }

  private truthMoveTo(direction: string, list: TransferItem[]): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const targetDatasource = direction === 'left' ? this.leftDataSource : this.rightDataSource;
    for (const item of list) {
      const idx = datasource.indexOf(item);
      if (idx === -1) continue;
      item.checked = false;
      targetDatasource.push(item);
      datasource.splice(idx, 1); 
    }
    this.updateOperationStatus(oppositeDirection);
    this.nzChange.emit({
      from: oppositeDirection,
      to: direction,
      list
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('nzDataSource' in changes || 'nzTargetKeys' in changes || 'nzRightDataSource' in changes) {
      this.splitDataSource()
      this.updateOperationStatus('left');
      this.updateOperationStatus('right');
    }
  }
}
