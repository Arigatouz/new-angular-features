import { debounced, Service, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { parse } from 'valibot';
import { Joke } from './jokes';
import { JokesSchema } from './schema/jokes.schema';
const MAIN_API = 'https://official-joke-api.appspot.com';
export const JOKES_API = {
  JOKE_API_10_JOKES: `${MAIN_API}/random_ten`,
  GET_JOKES_WITH_DYNAMIC_NUMBERS: (jokesNumber: number) =>
    `${MAIN_API}/jokes/random/${jokesNumber}`,
  GET_CHUCK_NORRIS_WITH_SEARCH: (query: string) =>
    `https://api.chucknorris.io/jokes/search?query=${encodeURIComponent(query)}`,
};

export interface ChuckNorrisJoke {
  id: string;
  value: string;
  url: string;
  icon_url: string;
  categories: string[];
}

export interface ChuckNorrisSearchResult {
  total: number;
  result: ChuckNorrisJoke[];
}

@Service()
export class HttpDemoService {
  httpResourceGetJokesWithoutParams = httpResource<Joke[]>(() => `${JOKES_API.JOKE_API_10_JOKES}`, {
    debugName: 'JokeWithParamsResource',
    parse: (Response) => parse(JokesSchema, Response),
  });

  httpResourceGetJokesWithParams = (jokesNumber: Signal<number>) => {
    return httpResource<Joke[]>(
      () => `${JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(jokesNumber())}`,
      {
        defaultValue: [],
        parse: (Response) => parse(JokesSchema, Response),
      },
    );
  };

  httpResourceGetJokesWithOtherOverloadAndQueryParams = (jokesNumber: Signal<number>) => {
    return httpResource<Joke[]>(() => ({
      url: `${MAIN_API}/jokes/random`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      params: { limit: jokesNumber() },
    }));
  };

  httpResourceGetJokesWithCondition = (jokesNumber: Signal<number | null>) => {
    return httpResource<Joke[]>(() => {
      const jokeParam = jokesNumber();
      return jokeParam ? `${JOKES_API.GET_JOKES_WITH_DYNAMIC_NUMBERS(jokeParam)}` : undefined;
    });
  };

  httpResourceGetChuckNorrisWithSearch = (query: Signal<string>) => {
    const debouncedSearchQuery = debounced(query, 500);
    return httpResource<ChuckNorrisSearchResult>(
      () => {
        const trimmed = debouncedSearchQuery.value().trim();
        // chucknorris.io/jokes/search 400s on queries under 3 chars — stay idle instead.
        return trimmed.length >= 3 ? JOKES_API.GET_CHUCK_NORRIS_WITH_SEARCH(trimmed) : undefined;
      },
      {
        defaultValue: { total: 0, result: [] },
      },
    );
  };

  // picsum.photos only sends Access-Control-Allow-Origin when an Origin header
  // is present (conditional CORS) - curl without one looks like it's missing,
  // but browsers always send Origin cross-origin, so this works from the app.
  // width/height signals drive reactive refetching when dimensions change.
  httpResourceWithBlob = (width: Signal<number>, height: Signal<number>) =>
    httpResource.blob(() => `https://picsum.photos/${width()}/${height()}`);

  // baconipsum returns real text/plain with Access-Control-Allow-Origin: *
  // type and paragraphs signals let the user change the content reactively.
  httpResourceWithText = (type: Signal<'meat-and-filler' | 'all-meat'>, paragraphs: Signal<number>) =>
    httpResource.text(
      () =>
        `https://baconipsum.com/api/?type=${type()}&paras=${paragraphs()}&format=text`,
    );

  // arrayBuffer earns its keep here: AudioContext.decodeAudioData() takes a
  // BufferSource and refuses a Blob, so raw bytes are exactly what we want.
  // The audioUrl signal lets the user switch sounds and refetches automatically.
  httpResourceWithArrayBuffer = (audioUrl: Signal<string>) =>
    httpResource.arrayBuffer(() => audioUrl());
}
