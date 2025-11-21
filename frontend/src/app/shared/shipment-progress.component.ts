// src/app/shared/shipment-progress.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipment-progress',
   standalone: true,
   imports: [CommonModule],
  template: `
    <div class="progress-vertical">
      <div class="step" *ngFor="let s of statuses; let i = index" [class.active]="i <= currentIndex">
        <div class="dot"></div>
        <div class="label">{{ labelMap[s] || s }}</div>
      </div>
    </div>
  `,
  styles: [`
    .progress-vertical { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
    .step { position:relative; padding-left:30px; min-height:28px; }
    .dot { position:absolute; left:0; top:4px; width:14px; height:14px; border-radius:50%; background:#ddd; }
    .step.active .dot { background:#2b6cb0; box-shadow:0 0 8px rgba(43,108,176,.25); }
    .label { font-weight:600; color:#333; }
  `]
})
export class ShipmentProgressComponent {
  @Input() status = 'pending';
  statuses = ['pending','dispatched','in_transit','out_for_delivery','delivered'];
  labelMap: any = {
    pending: 'Pending',
    dispatched: 'Dispatched',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered'
  };
  get currentIndex() {
    const i = this.statuses.indexOf(this.status);
    return i === -1 ? 0 : i;
  }
}
