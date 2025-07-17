let silabaSelecionada = null;

function arrastar(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function permitirSoltar(ev) {
  ev.preventDefault();
}

function soltar(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const silabaOriginal = document.getElementById(id);

  let alvo = ev.target;

  if (alvo.tagName === "IMG" && alvo.parentElement.classList.contains("dropzone")) {
    alvo = alvo.parentElement;
  }

  if (!alvo.classList.contains("dropzone")) return;

  if (alvo.firstChild) {
    removerSilaba(alvo);
  }

  const clone = silabaOriginal.cloneNode(true);
  clone.removeAttribute("id");
  clone.classList.remove("silaba");
  clone.setAttribute("data-original-id", silabaOriginal.id);
  clone.setAttribute("draggable", "false");
  clone.style.cursor = "pointer";

  clone.onclick = function () {
    removerSilaba(clone.parentElement);
  };

  alvo.appendChild(clone);
  silabaOriginal.style.display = "none";

  validarRespostas();
}

function removerSilaba(dropzone) {
  if (!dropzone.firstChild) return;

  const img = dropzone.querySelector("img");
  if (!img) return;

  const originalId = img.getAttribute("data-original-id");
  if (originalId) {
    const original = document.getElementById(originalId);
    if (original) {
      original.style.display = "inline-block";
    }
  }

  dropzone.innerHTML = "";
}

const respostasCorretas = [
  ["ca"],
  ["la"],
  ["lo", "lo2"],
  ["bra"],
  ["ne"],
  ["lo", "lo2"],
  ["es"],
  ["co"],
  ["sa"],
  ["no"]
];

function resetarSilabas() {
  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach(dz => {
    dz.innerHTML = "";
    dz.classList.remove("correta", "errada");
  });

  const silabas = document.querySelectorAll(".silaba");
  silabas.forEach(silaba => {
    silaba.style.display = "inline-block";
  });
}

function validarRespostas() {
  const dropzones = document.querySelectorAll(".dropzone");
  let todasPreenchidas = true;
  let todasCorretas = true;

  dropzones.forEach((dz, index) => {
    dz.classList.remove("correta", "errada");

    const img = dz.querySelector("img");
    if (!img) {
      todasPreenchidas = false;
      todasCorretas = false;
      return;
    }

    const usada = img.getAttribute("data-original-id");
    const respostasAceitas = respostasCorretas[index];

    if (respostasAceitas.includes(usada)) {
      dz.classList.add("correta");
    } else {
      dz.classList.add("errada");
      todasCorretas = false;
    }
  });

  if (todasPreenchidas && todasCorretas) {
    const popup = document.getElementById("popupParabens");
    const audio = document.getElementById("audioParabens");

    if (popup) popup.style.display = "flex";
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
    iniciarConfetes();
  }

  const totalErradas = Array.from(dropzones).filter(dz => dz.classList.contains("errada")).length;

  if (totalErradas >= 5) {
    setTimeout(() => {
      const audioErro = document.getElementById("audioErro");
      if (audioErro) {
        audioErro.currentTime = 0;
        audioErro.play();
      }

      const popupErro = document.getElementById("popupErro");
      if (popupErro) {
        popupErro.style.display = "flex";
      }

      dropzones.forEach((dz) => {
        if (dz.classList.contains("errada")) {
          removerSilaba(dz);
          dz.classList.remove("errada");
        }
      });
    }, 100);
  }
}

// Event listeners para os botões dos popups
document.addEventListener("DOMContentLoaded", () => {
  const btnFecharParabens = document.getElementById("btnFecharPopup");
  const popupParabens = document.getElementById("popupParabens");
  if (btnFecharParabens && popupParabens) {
    btnFecharParabens.addEventListener("click", () => {
      popupParabens.style.display = "none";
      resetarSilabas();
    });
  }

  const btnFecharErro = document.getElementById("btnFecharErro");
  const popupErro = document.getElementById("popupErro");
  if (btnFecharErro && popupErro) {
    btnFecharErro.addEventListener("click", () => {
      popupErro.style.display = "none";
    });
  }

  // Clique para selecionar sílaba
  document.querySelectorAll(".silaba").forEach(silaba => {
    silaba.addEventListener("click", () => {
      if (silaba.style.display === "none") return;

      if (silabaSelecionada) {
        silabaSelecionada.classList.remove("selecionada");
      }

      silabaSelecionada = silaba;
      silaba.classList.add("selecionada");
    });
  });

  // Clique na dropzone para posicionar a sílaba
  document.querySelectorAll(".dropzone").forEach(dropzone => {
    dropzone.addEventListener("click", () => {
      if (!silabaSelecionada) return;

      // Remove se já tiver algo lá
      removerSilaba(dropzone);

      const clone = silabaSelecionada.cloneNode(true);
      clone.removeAttribute("id");
      clone.classList.remove("silaba", "selecionada");
      clone.setAttribute("data-original-id", silabaSelecionada.id);
      clone.setAttribute("draggable", "false");
      clone.style.cursor = "pointer";

      clone.onclick = function () {
        removerSilaba(clone.parentElement);
      };

      dropzone.appendChild(clone);
      silabaSelecionada.style.display = "none";
      silabaSelecionada.classList.remove("selecionada");
      silabaSelecionada = null;

      validarRespostas();
    });
  });
});