import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-opper-ai',
  imports: [],
  templateUrl: './opper-ai.html',
  styleUrl: './opper-ai.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpperAi {
  readonly message =
    'The Opper SDK uses Node runtime APIs and cannot run in the browser bundle. Move this integration to a server endpoint.';
}
