import { string, number, object, array } from 'valibot';

export const JokesSchema = array(
  object({
    id: number(),
    punchline: string(),
    setup: string(),
    type: string(),
  }),
);
