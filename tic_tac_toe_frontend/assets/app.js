(function () {
  'use strict';

  const boardEl = document.querySelector('.board');
  const statusText = document.getElementById('statusText');
  const resetBtn = document.getElementById('resetBtn');

  const state = {
    board: Array(9).fill(null),
    player: 'X',
    finished: false
  };

  const wins = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];

  function render() {
    // Ensure cells reflect state
    document.querySelectorAll('.cell').forEach((btn, idx) => {
      btn.textContent = state.board[idx] || '';
      btn.style.color = state.board[idx] === 'X' ? getCSSVar('--color-3c2f2f') : getCSSVar('--color-ef2a39');
    });

    if (state.finished) return;

    statusText.textContent = `Your turn: ${state.player}`;
  }

  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function checkWinner() {
    for (const [a,b,c] of wins) {
      const va = state.board[a], vb = state.board[b], vc = state.board[c];
      if (va && va === vb && vb === vc) {
        state.finished = true;
        statusText.textContent = `${va} wins!`;
        highlight([a,b,c]);
        return true;
      }
    }
    if (state.board.every(Boolean)) {
      state.finished = true;
      statusText.textContent = `It's a draw!`;
      return true;
    }
    return false;
  }

  function highlight(indices) {
    indices.forEach(i => {
      const el = document.querySelector(`.cell[data-pos="${i}"]`);
      if (el) {
        el.style.borderColor = getCSSVar('--color-ff9633');
        el.style.boxShadow = getCSSVar('--shadow-1');
        el.style.backgroundColor = getCSSVar('--color-f5f5f5');
      }
    });
  }

  function handleMove(e) {
    const btn = e.target.closest('.cell');
    if (!btn) return;
    if (state.finished) return;

    const idx = parseInt(btn.getAttribute('data-pos'), 10);
    if (state.board[idx]) return;

    state.board[idx] = state.player;
    render();

    if (!checkWinner()) {
      state.player = state.player === 'X' ? 'O' : 'X';
      render();
    }
  }

  function reset() {
    state.board.fill(null);
    state.player = 'X';
    state.finished = false;

    document.querySelectorAll('.cell').forEach(btn => {
      btn.style.removeProperty('border-color');
      btn.style.removeProperty('box-shadow');
      btn.style.removeProperty('background-color');
    });

    render();
  }

  if (boardEl) boardEl.addEventListener('click', handleMove);
  if (resetBtn) resetBtn.addEventListener('click', reset);

  // Initial render
  render();
})();
