import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';

type EditorCommand =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'code'
  | 'h1'
  | 'h2'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock';

interface CommandConfig {
  label: string;
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

@Component({
  selector: 'app-form-builder',
  imports: [],
  templateUrl: './form-builder.html',
  styleUrl: './form-builder.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormBuilder implements OnDestroy {
  editor = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  private editorInstance?: Editor;

  readonly commands = new Map<EditorCommand, CommandConfig>([
    [
      'bold',
      {
        label: 'Bold',
        action: (e) => e.chain().focus().toggleBold().run(),
        isActive: (e) => e.isActive('bold'),
      },
    ],
    [
      'italic',
      {
        label: 'Italic',
        action: (e) => e.chain().focus().toggleItalic().run(),
        isActive: (e) => e.isActive('italic'),
      },
    ],
    [
      'strike',
      {
        label: 'Strike',
        action: (e) => e.chain().focus().toggleStrike().run(),
        isActive: (e) => e.isActive('strike'),
      },
    ],
    [
      'code',
      {
        label: 'Code',
        action: (e) => e.chain().focus().toggleCode().run(),
        isActive: (e) => e.isActive('code'),
      },
    ],
    [
      'h1',
      {
        label: 'H1',
        action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (e) => e.isActive('heading', { level: 1 }),
      },
    ],
    [
      'h2',
      {
        label: 'H2',
        action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (e) => e.isActive('heading', { level: 2 }),
      },
    ],
    [
      'bulletList',
      {
        label: 'Bullet List',
        action: (e) => e.chain().focus().toggleBulletList().run(),
        isActive: (e) => e.isActive('bulletList'),
      },
    ],
    [
      'orderedList',
      {
        label: 'Ordered List',
        action: (e) => e.chain().focus().toggleOrderedList().run(),
        isActive: (e) => e.isActive('orderedList'),
      },
    ],
    [
      'blockquote',
      {
        label: 'Blockquote',
        action: (e) => e.chain().focus().toggleBlockquote().run(),
        isActive: (e) => e.isActive('blockquote'),
      },
    ],
    [
      'codeBlock',
      {
        label: 'Code Block',
        action: (e) => e.chain().focus().toggleCodeBlock().run(),
        isActive: (e) => e.isActive('codeBlock'),
      },
    ],
  ]);

  readonly commandEntries = Array.from(this.commands.entries());
  readonly activeCommands = signal<Set<EditorCommand>>(new Set());

  constructor() {
    afterNextRender({
      write: () => {
        this.editorInstance = new Editor({
          element: this.editor().nativeElement,
          extensions: [
            StarterKit,
            Placeholder.configure({
              placeholder: 'Start typing here...',
              emptyEditorClass: 'is-editor-empty',
              emptyNodeClass: 'is-node-empty',
            }),
          ],
          content: '<h1>Hello World!</h1>',
          onUpdate: () => this.updateActiveCommands(),
          onSelectionUpdate: () => this.updateActiveCommands(),
        });
        this.updateActiveCommands();
      },
    });
  }

  runCommand(command: EditorCommand): void {
    const config = this.commands.get(command);
    if (config && this.editorInstance) {
      config.action(this.editorInstance);
    }
  }

  private updateActiveCommands(): void {
    if (!this.editorInstance) return;

    const active = new Set<EditorCommand>();
    for (const [command, config] of this.commands) {
      if (config.isActive(this.editorInstance)) {
        active.add(command);
      }
    }
    this.activeCommands.set(active);
  }

  ngOnDestroy(): void {
    this.editorInstance?.destroy();
  }
}
