import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs';
import { Ipost } from 'src/app/shared/model/data';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  @ViewChild('postForm') postForm! : NgForm;
  baseurl : string = 'https://http1-cbf66-default-rtdb.firebaseio.com/';
  postsArr : Ipost[] =[];
  isUpdating : boolean = false;
  constructor(private _http : HttpClient,
              private _postsService : PostsService) { }

  ngOnInit(): void {
    this.fetchData();
  }
  onSubmit(post : Ipost){
    console.log(post);
    this._postsService.createPost(post)
                        .subscribe(res => console.log(res)                        )
    this.postForm.reset();
    // this.fetchData();
  }

  // createPosts(post : Ipost){
  //   let postUrl = `${this.baseurl}/posts.json`;
  //   this._http.post(postUrl, post)
  //               .subscribe(data => console.log(data)
  //                )
  // }
  fetchData(){
    this._postsService.fetchPosts()
                        .subscribe(res => {
                          console.log(res);
                          this.postsArr = res;                          
                        })
  }
  onPostDelete(p:Ipost){
    this._postsService.deletePost(p)
                        .subscribe(res => {
                          console.log(res)
                        this.postsArr = this.postsArr.filter(ele => ele.id != p.id)
                        }
                        )
  }
  // onPostDelete(id : string | undefined){
  //   let deleteUrl :string = `${this.baseurl}/posts/${id}.json`;
  //   this._http.delete(deleteUrl)
  //                     .subscribe(data => {
  //                       this.postsArr = this.postsArr.filter(ele => ele.id != id)
  //                       console.log(this.postsArr);
                        
  //                     }
  //                     )
          
  // }
  editpost(p: Ipost){
    console.log(p);
    if(p.id){
      localStorage.setItem('setId', p.id);
    }
    this.isUpdating =! this.isUpdating;
    this.postForm.setValue({
      title : p.title,
      content : p.content
    })
  }
  onupdatePost(){
    console.log('update');
    let getId = localStorage.getItem('setId');
    this.isUpdating =! this.isUpdating;
    let obj : Ipost = {
      title : this.postForm.value.title,
      content : this.postForm.value.content
    }
    if(getId){
      this._postsService.updatePost(obj, getId)
                                .subscribe(data => {
                                  console.log(data);
                                  this.postsArr.forEach( ele =>{
                                    if(ele.id === getId){
                                      ele.title = obj.title,
                                      ele.content = obj.content
                                    }
                                  })
                                }
                                
                                )
    }
  }


}
