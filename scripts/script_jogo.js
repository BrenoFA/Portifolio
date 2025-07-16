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
});
function iniciarConfetes() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";

  const confetes = [];

  for (let i = 0; i < 150; i++) {
    confetes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncrement: Math.random() * 0.1 + 0.05
    });
  }

  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetes.forEach(c => {
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt, c.y);
      ctx.lineTo(c.x, c.y + c.tilt + c.r);
      ctx.stroke();
    });

    atualizar();
    requestAnimationFrame(desenhar);
  }

  function atualizar() {
    confetes.forEach(c => {
      c.y += Math.cos(c.d) + 2;
      c.tiltAngle += c.tiltAngleIncrement;
      c.tilt = Math.sin(c.tiltAngle) * 15;

      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  desenhar();

  // Parar após 5 segundos
  setTimeout(() => {
    canvas.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}
