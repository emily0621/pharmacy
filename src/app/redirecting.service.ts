import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export const ORDER_SIZE: number = 6
export const MEDICINE_SIZE: number = 9
export const USER_SIZE: number = 8

@Injectable({
  providedIn: 'root'
})
export class RedirectingService {

  baseUrl: string
  queryParams: any | null = null

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
  }

  getBaseUrl(){
    console.log(this.route.url.subscribe((url: any) => {
      console.log(url)
    }))
    return this.router.url.split('?')[0]
  }

  sendNotFound() {
    this.router.navigate(['/not_found'], {relativeTo: this.route})
  }

  redirect(url: string, params: any){
    this.router.navigate([url], {queryParams: params, relativeTo: this.route})
  }

  redirectWithReload(url: string, params: any){
    this.router.navigate([url], {queryParams: params, relativeTo: this.route}).then(() => {
      window.location.reload()
    })
  }

  hasPrevPage(){
    if (this.page != 1) this.hasPrev = true
    else this.hasPrev = false
  }

  hasNextPage(currentCount: number, totalCount: number, size: number){
    if (currentCount < size || (this.page - 1) * size + currentCount == totalCount) this.hasNext = false
    else this.hasNext = true
  }

  previousPage(){
    this.redirect(this.getBaseUrl().slice(0, this.baseUrl.lastIndexOf('/') + 1).concat((--this.page).toString()), this.queryParams)
  }

  nextPage(){
    this.redirect(this.baseUrl.slice(0, this.getBaseUrl().lastIndexOf('/') + 1).concat((++this.page).toString()), this.queryParams)
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

  getRouter(){
    return this.router
  }

  reload(){
    window.location.reload()
  }
}
