import {Component, ElementRef, OnInit} from '@angular/core';
import {TokenStorageService} from '../../services/token-storage.service';
import {User} from '../../models/user';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-view-info-user',
  templateUrl: './view-info-user.component.html',
  styleUrls: ['./view-info-user.component.css']
})
export class ViewInfoUserComponent implements OnInit {
  user: User;
  form: FormGroup;
  formChangeEmail: FormGroup;

  validationMessages = {
    name: [
      {type: 'required', message: 'Tên không được để trống.'},
      {type: 'pattern', message: 'Tên không chứa kí tự đặc biệt.'},
      {type: 'maxlength', message: 'Độ dài tên không quá 100 kí tự.'}
    ],
    birthday: [
      {type: 'birthdayGreaterThanCurrentDay', message: 'Ngày sinh không được quá thời gian hiện tại.'}
    ],
    email: [
      {type: 'required', message: 'Email không được để trống.'},
      {type: 'email', message: 'Email không đúng định dạng.'}
    ],
    address: [
      {type: 'maxlength', message: 'Địa chỉ không quá 50 kí tự.'}
    ],
    otp: [
      {type: 'required', message: 'Mã OTP không được để trống.'},
      {type: 'pattern', message: 'OTP phải chứa 6 kí tự số.'}
    ],
    phone: [
      {type: 'pattern', message: 'Số điện thoại không hợp lệ.'}
    ]
  };

  constructor(private storageService: TokenStorageService, private fb: FormBuilder, private userService: UserService,
              private el: ElementRef, private commonService: CommonService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      // tslint:disable-next-line:max-line-length
      name: ['', [Validators.required, Validators.pattern('^[\\s]*[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]+(\\s[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ ]+)*$'),
                  Validators.maxLength(100)]],
      gender: '',
      birthday: ['', [this.checkBirthday]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^\\s*0(3|5|7|8|9)\\s*[0-9]\\s*[0-9]\\s*[0-9]\\s*[0-9]\\s*[0-9]\\s*[0-9]\\s*[0-9]\\s*[0-9]\\s*$')]],
      address: ['', [Validators.maxLength(50)]]
    });
    this.userService.findById(this.storageService.getUser().id).subscribe(
      user => {
        this.form.patchValue(user);
        this.user = user;
      }
    );

    this.formChangeEmail = new FormGroup({
      newEmail: new FormControl('', [Validators.required, Validators.email]),
      otp: new FormControl('', [Validators.required, Validators.pattern('^\\d{6}$')])
    });
  }

  checkBirthday(c: AbstractControl) {
    if (c.value === '') {
      return null;
    }
    const value = new Date(c.value);
    const currentDate = new Date();
    if (value < currentDate) {
      return null;
    }
    return {birthdayGreaterThanCurrentDay: true};
  }

  openModalChangeEmail() {
    const modal = this.el.nativeElement.querySelector('.modal');
    modal.style.display = 'block';
  }

  hiddenModal() {
    const modal = this.el.nativeElement.querySelector('.modal');
    this.formChangeEmail.reset();
    modal.style.display = 'none';
  }

  getOTP() {
    if (this.newEmail.valid) {
      if (this.email.value === this.newEmail.value) {
        this.toastrService.warning('Email vừa nhập trùng với email cũ', 'Thông báo');
        return;
      }
      this.el.nativeElement.querySelector('.loading-container').style.display = 'block';
      if (this.user.provider === 'local') {
        this.commonService.getOtpRegister(this.newEmail.value).subscribe(
          data => {
            this.el.nativeElement.querySelector('.loading-container').style.display = 'none';
            this.toastrService.success('Vui lòng kiểm tra email để lấy mã OTP', 'Thông báo');
          },
          error => {
            this.el.nativeElement.querySelector('.loading-container').style.display = 'none';
            this.toastrService.error(error.error.message, 'Thông báo');
          }
        );
      }
    } else {
      this.toastrService.warning('Email của bạn không hợp lệ !!!', 'Thông báo');
    }
  }
  get name() {
    return this.form.get('name');
  }
  get address() {
    return this.form.get('address');
  }
  get birthday() {
    return this.form.get('birthday');
  }
  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  get otp() {
    return this.formChangeEmail.get('otp');
  }

  get newEmail() {
    return this.formChangeEmail.get('newEmail');
  }

  updateEmail() {
    if (this.email.value === this.newEmail.value) {
      this.toastrService.warning('Email vừa nhập trùng với email cũ', 'Thông báo');
      return;
    } else if (this.newEmail.valid && this.user.provider === 'local') {
      this.userService.updateEmail(this.storageService.getUser().id, this.newEmail.value, this.otp.value).subscribe(
        next => {
          this.hiddenModal();
          this.email.setValue(this.newEmail.value);
          this.toastrService.success('Cập nhật email thành công !!!', 'Thông báo');
          this.newEmail.setValue('');
        },
        error => {
          console.log(error);
          this.toastrService.error(error.error.message, 'Thông báo');
        }
      );
    } else {
      this.toastrService.warning('Email không hợp lệ !!!', 'Thông báo');
    }
  }

  updateInfo() {
    if (this.form.valid) {
      this.userService.updateInfo(this.user.id, this.form.value).subscribe(
        next => {
          this.user.name = this.name.value;
          this.user.birthday = this.birthday.value;
          this.user.gender = this.form.get('gender').value;
          this.user.phone = this.phone.value;
          this.user.address = this.address.value;
          this.toastrService.success(next.message, 'Thông báo');
        },
        error => {
          this.toastrService.error(error.error.message, 'Thông báo');
        }
      );
    } else {
      this.toastrService.warning('Thông tin trong form không hợp lệ !!!', 'Thông báo');
    }
  }
}
