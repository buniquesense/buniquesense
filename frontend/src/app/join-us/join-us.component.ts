import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-join-us',
  standalone: true,
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class JoinUsComponent {

  registrationForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;

  paymentOptions = [
    { value: 'razorpay', label: 'Razorpay', icon: '💳' },
    // { value: 'upi', label: 'UPI', icon: '📱' },
    // { value: 'bank', label: 'Bank Transfer', icon: '🏦' }
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private orderSvc: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      paymentOption: ['razorpay', Validators.required]
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  async onSubmit(): Promise<void> {
    if (!this.registrationForm.valid) {
      Object.values(this.registrationForm.controls).forEach(c => c.markAsTouched());
      return;
    }

    this.isLoading = true;
    const payload = this.registrationForm.value;

    try {
      // STEP 1 — Register user
      const reg: any = await this.auth.register(payload).toPromise();

      // Save token from register response (admin backend returns token on register)
      if (reg.token) {
        localStorage.setItem('auth_token', reg.token);
        localStorage.setItem('auth_role', reg.user?.role || 'student');
      }
      if (reg.token) {
        localStorage.setItem('auth_token', reg.token);
        localStorage.setItem('auth_role', reg.user?.role || 'student');
        localStorage.setItem('auth_user', JSON.stringify(reg.user));  // <-- FIX
      }

      // STEP 2 — Confirm login
      const loginResp: any = await this.auth.login({
        email: payload.email,
        password: payload.password
      }).toPromise();

      // Store correct login token
      localStorage.setItem('auth_token', loginResp.token);
      localStorage.setItem('auth_role', loginResp.user.role);
      localStorage.setItem('auth_user', JSON.stringify(loginResp.user));
      
      const paymentOption = this.f['paymentOption'].value;

      // STEP 3 — Razorpay flow
      if (paymentOption === 'razorpay') {
        const resp: any = await this.orderSvc.createOrder('', 1).toPromise();
        const razorOrder = resp.razorOrder;
        const localOrderId = resp.orderId;

        const options: any = {
          key: environment.razorKeyId,
          amount: razorOrder.amount,
          currency: razorOrder.currency,
          name: 'B Unique Sense',
          description: 'Gita Writing Program Kit',
          order_id: razorOrder.id,

          handler: async (razorResp: any) => {
            try {
              // Step 1: verify payment on backend
              const verifyRes: any = await this.orderSvc.verifyPayment({
                razorpay_order_id: razorResp.razorpay_order_id,
                razorpay_payment_id: razorResp.razorpay_payment_id,
                razorpay_signature: razorResp.razorpay_signature,
                localOrderId
              }).toPromise();

              // ⭐️ Save token + student data so dashboard works
              if (verifyRes?.student) {
                localStorage.setItem('auth_token', verifyRes.token);
                localStorage.setItem('auth_role', verifyRes.student.role);
                localStorage.setItem('student', JSON.stringify(verifyRes.student));
              }

              // Step 2: success message
              this.isSubmitted = true;
              window.scrollTo({ top: 0, behavior: 'smooth' });

              // Step 3: redirect
              setTimeout(() => {
                window.location.href = '/student/dashboard';
              }, 1500);

            } catch (err) {
              console.error('verification failed', err);
              alert('Payment verification failed. Contact support.');
            } finally {
              this.isLoading = false;
            }
          },

          prefill: {
            name: payload.fullName,
            email: payload.email,
            contact: payload.phoneNumber
          },
          theme: { color: '#F37A26' }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } 
      
      // STEP 4 — Offline UPI–Bank
      else {
        this.isSubmitted = true;

        setTimeout(() => {
          this.router.navigate(['/student/dashboard']);
        }, 1500);
      }

    } catch (err: any) {
      console.error(err);
      alert(err?.error?.message || 'Registration/payment error');
    } finally {
      this.isLoading = false;
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.registrationForm.reset({ paymentOption: 'razorpay' });
  }
}
