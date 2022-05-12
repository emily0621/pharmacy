import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectingService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  sendNotFound() {
    this.router.navigate(['/not_found'], {relativeTo: this.route})
  }
}
