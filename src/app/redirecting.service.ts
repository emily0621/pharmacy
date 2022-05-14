import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export const ORDER_SIZE: number = 6
export const MEDICINE_SIZE: number = 9

@Injectable({
  providedIn: 'root'
})
export class RedirectingService {

  baseUrl: string
  queryParams: any | null

  hasPages: boolean = false

  page: number
  hasPrev: boolean
  hasNext: boolean

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.baseUrl = this.router.url.split('?')[0]
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params
    })
  }

  sendNotFound() {
    this.router.navigate(['/not_found'], {relativeTo: this.route})
  }

  redirect(url: string, params: any){
    this.router.navigate([url], {queryParams: params, relativeTo: this.route}).then(() => {
      window.location.reload()
    })
  }

  hasPrevPage(){
    if (this.page != 1) this.hasPrev = true
    else this.hasPrev = false
  }

  hasNextPage(currentCount: number, totalCount: number, size: number){
    if ((this.page - 1) * size + currentCount == totalCount) this.hasNext = false
    else this.hasNext = true
  }

  previousPage(){
    this.redirect(this.baseUrl.slice(0, this.baseUrl.lastIndexOf('/') + 1).concat((--this.page).toString()), this.queryParams)
  }

  nextPage(){
    this.redirect(this.baseUrl.slice(0, this.baseUrl.lastIndexOf('/') + 1).concat((++this.page).toString()), this.queryParams)
  }

  initPages(page: number){
    this.page = page
    console.log(this.page)
    this.hasPages = true
  }

  checkPagesExists(currentCount: number, totalCount: number, size: number){
    this.hasPrevPage()
    this.hasNextPage(currentCount, totalCount, size)
  }

  getRoute(){
    return this.route
  }
}
