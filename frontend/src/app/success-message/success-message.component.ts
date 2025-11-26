// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-success-message.component',
//   imports: [],
//   templateUrl: './success-message.component.html',
//   styleUrl: './success-message.component.css',
// })
// export class SuccessMessageComponent {

// }

import { Component, AfterViewInit } from "@angular/core";
import { gsap } from "gsap";

@Component({
  selector: "success-message",
  templateUrl: "./success-message.component.html",
  styleUrls: ["./success-message.component.css"],
  standalone: true
})
export class SuccessMessageComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    gsap.to("#successBox", {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    });
  }
}
