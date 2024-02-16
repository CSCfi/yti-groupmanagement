import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <ng-template ngbModalContainer></ng-template>
    <app-navigation-bar></app-navigation-bar>
    <div class="container-fluid">
      <app-breadcrumb [location]="location"></app-breadcrumb>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {

  constructor(private locationService: LocationService,
              private router: Router) {
  }

  get location() {
    return this.locationService.location;
  }

  navigateToInformation() {
    this.router.navigate(['/information']);
  }
}
