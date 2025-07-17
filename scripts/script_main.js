document.querySelector('form').addEventListener('submit', function(event) {
  const form = this;
  let valido = true;
  let primeiroErro = null;

  // Verifica inputs e textarea (exceto radios e checkbox)
  form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea, select').forEach(el => {
    if (!el.value.trim()) {
      valido = false;
      el.classList.add('erro');
      if (!primeiroErro) primeiroErro = el;
    } else {
      el.classList.remove('erro');
    }
  });

  // Verifica radio buttons (campo "preferencia")
  const radios = form.querySelectorAll('input[name="preferencia"]');
  const radioSelecionado = Array.from(radios).some(radio => radio.checked);
  if (!radioSelecionado) {
    valido = false;
    radios.forEach(r => r.classList.add('erro'));
    if (!primeiroErro) primeiroErro = radios[0];
  } else {
    radios.forEach(r => r.classList.remove('erro'));
  }

  // Verifica checkbox (autorizacao)
  const checkbox = form.querySelector('input[type="checkbox"][name="autorizacao"]');
  if (!checkbox.checked) {
    valido = false;
    checkbox.classList.add('erro');
    if (!primeiroErro) primeiroErro = checkbox;
  } else {
    checkbox.classList.remove('erro');
  }

  if (!valido) {
    event.preventDefault();
    alert('Por favor, preencha ou selecione todos os campos obrigatórios antes de enviar.');
    primeiroErro.focus();
  }
});
