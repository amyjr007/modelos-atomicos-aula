# Modelos Atômicos — app de slides interativos

Arquivo único e autossuficiente: **`index.html`**. Abre com duplo-clique (offline) ou hospedado. Otimizado para telas de toque (tablets / Chromebooks), mouse e **passadores / canetas Bluetooth**.

## Como usar em aula
- **Capa** → botão **Iniciar**.
- **Baralho**: arraste as cartas (dedo/mouse) e toque em **Entrar** para abrir o capítulo.
- Dentro do capítulo:
  - **Avançar**: toque na tela · deslizar para a esquerda · `→` `Espaço` `PageDown` (passador/caneta).
  - **Voltar**: deslizar para a direita · `←` `PageUp`.
  - **Sair**: `Esc` ou botão **← Capítulos**.
- Botão **?** no canto mostra os controles.

## Atalhos para montar os slides
Abra direto onde você está trabalhando, sem passar pela capa:
- `index.html?deck` → abre no baralho.
- `index.html?cap=3` → abre direto a **página inicial do Capítulo III** (use 1 a 6).

## Como criar os slides de um capítulo
Cada capítulo é uma `<section class="chapter" id="cap-N">`. Dentro dela há **1 slide** (a capa).
Para criar mais, adicione `<article class="slide">` logo após a capa. Há um **BLOCO MODELO** comentado dentro do Capítulo I.

### 1) Evento NÃO interativo (revelado pelo passador/seta/toque)
Cada elemento com a classe `fragment` aparece a cada "avançar":
```html
<article class="slide">
  <div>
    <h3 class="fragment">Aparece no 1º clique</h3>
    <p  class="fragment" data-anim="left">Aparece no 2º clique</p>
    <img class="fragment" data-anim="zoom" src="figura.png" alt="">
  </div>
</article>
```
`data-anim`: omitido = sobe · `zoom` · `left` · `right`.

### 2) Evento INTERATIVO (o aluno toca / arrasta — o passador NÃO dispara)
```html
<button data-interactive onclick="Slides.done(this)">Toque para revelar</button>
```
- O elemento recebe um destaque tracejado até ser tocado.
- Chame `Slides.done(elemento)` quando a interação terminar.
- Para **travar o avanço** até o aluno interagir, marque o passo como `fragment ... data-gate`:
```html
<div class="fragment" data-interactive data-gate id="arrasta">arraste-me</div>
<script>/* quando concluir: */ Slides.done(document.getElementById('arrasta'));</script>
```

### Mover e redimensionar qualquer elemento (toque)
Qualquer elemento pode ser **arrastado (1 dedo)** e **redimensionado por pinça (2 dedos)**:
- Marque com `data-manip` (aplicado automaticamente ao entrar no slide):
```html
<img class="fragment" data-manip src="figura.png" alt="">
<h3 data-manip>Texto que o aluno pode mover e ampliar</h3>
<video data-manip src="video.mp4" controls></video>
```
- Ou via JS: `Slides.manip(elemento, { minScale:.4, maxScale:5 })`.

### API JS disponível
`Slides.done(el)` · `Slides.next()` · `Slides.prev()` · `Slides.goto(n)` · `Slides.manip(el, opts)`

## Temas / cores
Cada capítulo usa uma paleta via classe `theme-1` … `theme-6` (definidas no topo do `<style>`).
Use `var(--accent)` e `var(--accent-2)` no conteúdo dos slides para herdar a cor do capítulo.
