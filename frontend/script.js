function toggleDark() {
    document.body.classList.toggle("dark");
  }
let categoriaAtual = 1;

fetch("/categorias")
  .then(res => res.json())
  .then(categorias => {
    categorias.forEach(cat => {
      const btn = document.createElement("button");
      btn.innerText = cat.nome;
      btn.onclick = () => carregar(cat.id);
      abas.appendChild(btn);
    });
    carregar(1);
  });

  function carregar(categoria) {
    categoriaAtual = categoria;
    fetch("/tarefas/" + categoria)
      .then(res => res.json())
      .then(tarefas => {
        lista.innerHTML = "";
        tarefas.forEach(t => {
          const li = document.createElement("li");
  
          li.innerHTML = `
            <span contenteditable="true" onblur="editar(${t.id}, this)">
              ${t.texto}
            </span>
            <button onclick="apagar(${t.id})">🗑</button>
          `;
  
          lista.appendChild(li);
        });
      });
  }

function adicionar() {
  fetch("/tarefas", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ texto: nova.value, categoria: categoriaAtual })
  }).then(() => {
    nova.value = "";
    carregar(categoriaAtual);
  });
}

function apagar(id) {
  fetch("/tarefas/" + id, { method: "DELETE" })
    .then(() => carregar(categoriaAtual));
}
function editar(id, elemento) {
    fetch("/tarefas/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: elemento.innerText })
    });
  }