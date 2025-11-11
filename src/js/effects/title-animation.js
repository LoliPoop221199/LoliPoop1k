(() => {
  const prefix = '@';
  const fullText = document.title.replace(prefix, '');
  let i = 0;
  let typing = true;
  const speed = 500;
  const pause = 3000;

  const step = () => {
    document.title = prefix + fullText.substring(0, i);
    if (typing) {
      i++;
      if (i > fullText.length) return setTimeout(() => { typing = false; i = fullText.length; step(); }, pause);
    } else {
      i--;
      if (i === 0) return setTimeout(() => { typing = true; step(); }, pause);
    }
    setTimeout(step, speed);
  };

  step();
})();