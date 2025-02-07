import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommentCreateDto, Post, PostComment, PostCreateDto,} from '../interfaces/post.interface';
import {map, Observable, switchMap, tap} from 'rxjs';
import {baseUrl} from "@tt/globals";

@Injectable({
  providedIn: 'root',
})
export class PostService {
  posts: WritableSignal<Post[]> = signal<Post[]>([]);
  #http = inject(HttpClient);

  fetchPosts(userId: number): Observable<Post[]> {
    return this.#http.get<Post[]>(`${baseUrl}post/?user_id=${userId}`).pipe(
      tap((posts) => {
        posts = this.#sortById(posts, false);
        for (const post of posts) {
          post.comments = this.#sortById(post.comments, true);
        }
        this.posts.set(posts);
      })
    );
  }

  createPost(payload: PostCreateDto): Observable<Post[]> {
    return this.#http.post<Post>(`${baseUrl}post/`, payload).pipe(
      switchMap(() => {
        return this.fetchPosts(payload.authorId);
      })
    );
  }

  createComment(payload: CommentCreateDto) {
    return this.#http
      .post<PostComment>(`${baseUrl}comment/`, payload)
      .pipe(switchMap(() => this.fetchPosts(payload.authorId)));
  }

  getCommentsByPostId(postId: number) {
    return this.#http
      .get<Post>(`${baseUrl}post/${postId}`)
      .pipe(map((post) => this.#sortById(post.comments, true)));
  }

  #sortById<T extends { id: number }>(t: T[], forward: boolean) {
    return t.sort((a, b) => (forward ? a['id'] - b['id'] : a['id'] + b['id']));
  }
}
