import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { __values } from 'tslib';
import { Ipost } from '../model/data';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  baseurl : string = 'https://http1-cbf66-default-rtdb.firebaseio.com/';
  getPostsUrl : string = `${this.baseurl}/posts.json`;
  
  constructor(private _http : HttpClient) { }

fetchPosts(): Observable<Ipost[]>{
  
  return this._http.get<{[k : string] : Ipost}>(this.getPostsUrl)  //returns observable data type will get <{[k : string] : Ipost}>  // data in Obj Obj format ,Convert into Array form
                          .pipe( //data manipulated in pipe using map method from Rxjs
                            map(res => {
                              let arr : Ipost[] =[];
                              if(res){
                                Object.entries(res).forEach(([key, value]) => {
                                  arr.push({...value, id : key})
                                })
                              }
                              return arr;
                            })
                          )
}
createPost(post : Ipost): Observable<{name : string}>{
  return this._http.post<{name : string}>(this.getPostsUrl, post)
}
deletePost(p:Ipost): Observable<null>{
  let editDeleteUrl : string = `${this.baseurl}/${p.id}.json`
  return this._http.delete<null>(editDeleteUrl);
}
updatePost(p : Ipost, id: string){
  let updateUrl = `${this.baseurl}/${id}.json`;
  return this._http.patch(updateUrl, p);
}

}


