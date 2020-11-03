import { Injectable, ViewChild, AfterViewInit, Renderer2, ElementRef, RendererFactory2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { from } from 'rxjs';

import { CustomerComponent } from '../customer/customer.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements AfterViewInit {

  @ViewChild('btnText', {static: false}) customerCom: ElementRef;
  btnText:string = 'Submit';
  successMesg: string;

  constructor(private firebase: AngularFireDatabase, private renderer: RendererFactory2) { }
  customerList: AngularFireList<any>;

  ngAfterViewInit() {
    this.customerCom.nativeElement.text = 'Update';
  }

  form = new FormGroup({
    $key: new FormControl(null),
    fullName : new FormControl('', Validators.required),
    email : new FormControl('', Validators.email),
    mobile : new FormControl('', [Validators.required, Validators.minLength(8)]),
    location : new FormControl('')
  });

  getCustomers(){
    this.customerList = this.firebase.list('customers');
    return this.customerList.snapshotChanges();
  }

  insertCustomer(customer){
    this.customerList.push({
      fullName: customer.fullName,
      email: customer.email,
      mobile: customer.mobile,
      location: customer.location
    });
    this.successMesg = 'Data Submitted Successfully';
  }

  populateForm(customer, btnTxt){
    this.btnText = btnTxt;
    this.form.setValue(customer);
  }

  updateCustomer(customer){
    this.customerList.update(customer.$key,
      {
        fullName: customer.fullName,
        email: customer.email,
        mobile: customer.mobile,
        location: customer.location,
      });
      this.successMesg = 'Data Updated Successfully';
  }

  deleteCustomer($key : string){
    this.customerList.remove($key);
  }
}
