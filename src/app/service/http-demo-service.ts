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
    const debouncedSearchQuery = debounced(query, 500 );
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
}
