import { inject, Injectable, resource, Signal, signal } from '@angular/core';
import { Joke } from '../component/examples/http-demo/http-demo';
import { HttpClient, httpResource } from '@angular/common/http';

const JOKES_API = 'https://official-joke-api.appspot.com';

type params = {
  search: string;
  pageSize: number;
  currentPage: number;
};

@Injectable({
  providedIn: 'root',
})
export class HttpDemoService {
  getJokes(params: Signal<params>) {
    return httpResource<Joke[]>(() => `${JOKES_API}/jokes/ten?${params()}`);
  }
}
