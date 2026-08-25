import 'svelte/internal/disclose-version';
import * as $ from 'svelte/internal/client';

const root = $.from_html(
  `<div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start"><p style="color:#a0a0a0;font-size:14px;margin:0">Svelte 5 component — mounted via <code style="color:#ff3e00;background:#1a0a00;padding:2px 6px;border-radius:4px">mount</code> inside an Angular host element.</p> <div style="display:flex;align-items:center;gap:16px"><button style="width:40px;height:40px;border-radius:8px;background:#2d2d2d;border:1px solid #3d3d3d;color:white;font-size:18px;cursor:pointer">−</button> <span style="font-size:32px;font-weight:700;color:#ff3e00;min-width:60px;text-align:center"> </span> <button style="width:40px;height:40px;border-radius:8px;background:#2d2d2d;border:1px solid #3d3d3d;color:white;font-size:18px;cursor:pointer">+</button></div> <button style="padding:6px 14px;border-radius:6px;background:transparent;border:1px solid #3d3d3d;color:#a0a0a0;font-size:13px;cursor:pointer">Reset</button></div>`,
);

export default function SvelteCounter($$anchor) {
  let count = $.state(0);
  const div = root();
  const div_1 = $.sibling($.child(div), 2);
  const button = $.child(div_1);
  const span = $.sibling(button, 2);
  const text = $.child(span, true);

  $.reset(span);

  const button_1 = $.sibling(span, 2);

  $.reset(div_1);

  const button_2 = $.sibling(div_1, 2);

  $.reset(div);
  $.template_effect(() => $.set_text(text, $.get(count)));
  $.delegated('click', button, () => $.update(count, -1));
  $.delegated('click', button_1, () => $.update(count));
  $.delegated('click', button_2, () => $.set(count, 0));
  $.append($$anchor, div);
}

$.delegate(['click']);
