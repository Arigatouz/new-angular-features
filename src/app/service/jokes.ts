import { Service } from '@angular/core';
import { httpResource } from '@angular/common/http';

export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

@Service({
  autoProvided:true,
})
export class JokesService {
  readonly jokes = httpResource<Joke[]>(() => 'https://official-joke-api.appspot.com/random_ten', {
    defaultValue: [],
  });
}
