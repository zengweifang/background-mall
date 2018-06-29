import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject,NzNotificationService} from 'ng-zorro-antd';
import { utils } from '../../../../shared/utils/utils';
import { Router } from '@angular/router';
@Component({
  selector: 'app-shopping-cart-modal',
  templateUrl: './shopping-cart-modal.component.html',
  styleUrls: ['./shopping-cart-modal.component.scss']
})
export class ShoppingCartModalComponent implements OnInit {
  @Input()  data
  @Input()  cartNumTotal
  @Input()  switchValue
  constructor(private subject: NzModalSubject,private notificationService: NzNotificationService,private router:Router) {
    
  }

  ngOnInit() {

  }


  delete(item){
    let itemId = item.goodsId;
    this.cartNumTotal -= item.count;
    this.data.forEach((element,i) => {
      if(element.goodsId == itemId){
        this.data.splice(i,1);
      }
    });
    this.subject.next(this.cartNumTotal);
    if(this.data.length <= 0){
      this.handleCancel();
    }
  }

  inputValueChange(e){
    this.cartNumTotal = 0;
    for(let item of this.data){
      let keyCount = item.count;
      this.cartNumTotal += keyCount;
    }
    this.subject.next(this.cartNumTotal);
  }

  emitDataOutside(){
    utils.setSessionStorage('storageObj',this.data)
    this.router.navigate(['/representingOrder/creatOrder'], {queryParams: {isCheck: this.switchValue}});
    this.subject.destroy('onOk');
  }

  handleCancel(){
    this.subject.destroy('onCancel');
  }

  

}
