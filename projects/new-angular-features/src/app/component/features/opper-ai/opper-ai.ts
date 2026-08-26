import { Component, resource, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-opper-ai',
  imports: [],
  templateUrl: './opper-ai.html',
  styleUrl: './opper-ai.css',
})
export class OpperAi {
  readonly message =
    'The Opper SDK uses Node runtime APIs and cannot run in the browser bundle. Move this integration to a server endpoint.';

  checkAPIHealth = httpResource(() => 'http://localhost:3000/api/health');

  aiStreamResource = resource<string, Record<never, never>>({
    defaultValue: '',
    stream: ({ abortSignal }) => {
      const streamSignal = signal<{ value: string } | { error: Error }>({ value: '' });

      (async () => {
        try {
          const response = await fetch('http://localhost:3000/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'how to integrate with opper and control the request ?' }),
            signal: abortSignal,
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
          if (!reader) return;

          let accumulated = '';
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            accumulated += value;
            streamSignal.set({ value: accumulated });
          }
        } catch (err) {
          if (!abortSignal.aborted) {
            streamSignal.set({ error: err instanceof Error ? err : new Error(String(err)) });
          }
        }
      })();

      return streamSignal;
    },
  });
}
