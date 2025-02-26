import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForgotService } from 'src/app/services/forgot.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.component.html',
  styleUrls: ['./otpverification.component.css']
})
export class OtpverificationComponent implements OnInit {

  otp: string[] = ['', '', '', '', '', ''];
  enteredOtp: string = '';
  
  constructor(private router: Router, private forgotservice:ForgotService) { }

  ngOnInit(): void {
  }

  onOtpInput(index: number, event: any) {
    const input = event.target as HTMLInputElement;
    const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
    const prevInput = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;

    // Automatically move to the next input box if there is a character
    if (input.value && nextInput) {
      nextInput.focus();
    }

    // If input is empty and user pressed backspace, move focus to previous box
    if (input.value === '' && event.inputType === 'deleteContentBackward' && prevInput) {
      prevInput.focus();
    }
  }

  verifyOtp() {
    const enteredOtp = this.otp.join('');  // Join the OTP array to form a single string
    const storedOtp = localStorage.getItem('generatedOtp');

    if (enteredOtp === storedOtp) {
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: 'Your OTP is correct. Redirecting to reset password page...'
      }).then(() => {
        localStorage.removeItem('generatedOtp');
        localStorage.setItem('otpverified', 'true');
        this.router.navigate(['/resetpassword']);  // Navigate to reset password page
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid OTP',
        text: 'The OTP you entered is incorrect. Please try again.'
      });
    }
  }


}
