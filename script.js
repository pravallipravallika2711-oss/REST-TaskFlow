(function(){
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const listEl = document.getElementById('todo-list');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const clearAllBtn = document.getElementById('clear-all');

  let todos = JSON.parse(localStorage.getItem('todos') || '[]');

  function save(){ localStorage.setItem('todos', JSON.stringify(todos)); }

  function render(){
    listEl.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = !!todo.done;
      chk.addEventListener('change', ()=>{ todo.done = chk.checked; save(); render(); });

      const span = document.createElement('span');
      span.className = 'text' + (todo.done ? ' done' : '');
      span.textContent = todo.text;
      span.contentEditable = true;
      span.addEventListener('blur', ()=>{ todo.text = span.textContent.trim() || todo.text; save(); render(); });
      span.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); span.blur(); } });

      const del = document.createElement('button');
      del.className = 'action';
      del.textContent = 'Delete';
      del.addEventListener('click', ()=>{ todos = todos.filter(t => t.id !== todo.id); save(); render(); });

      li.appendChild(chk);
      li.appendChild(span);
      li.appendChild(del);
      listEl.appendChild(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    todos.push({ id: Date.now(), text, done: false });
    input.value = '';
    save(); render();
  });

  clearCompletedBtn.addEventListener('click', ()=>{ todos = todos.filter(t => !t.done); save(); render(); });
  clearAllBtn.addEventListener('click', ()=>{ if(confirm('Clear all tasks?')){ todos = []; save(); render(); } });

  render();
})();
