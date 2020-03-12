

// (https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

const tagText = Array.from($$('tr'))
  .map(tr => ({ tag: tr.children[0].innerText, description: tr.children[1].innerText }))
  .filter(item => item.tag && item.tag.startsWith('<'))
  .map(item => `'${item.tag.slice(1, -1).replace(/\>, \</g, '\',\n\t\'')}', // ${item.description}`)
  .join('\n\t');

function clipborad(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  // textarea.style.display = 'none';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

clipborad(`const tags = <const>[
${tagText}
];`);
