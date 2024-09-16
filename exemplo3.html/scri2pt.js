document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("start-button");
  const introScreen = document.getElementById("intro-screen");
  const mainContent = document.getElementById("main-content");

  startButton.addEventListener("click", function () {
    introScreen.style.display = "none";
    mainContent.style.display = "block";
  });

  // Aqui você pode adicionar a lógica existente de filtragem e exibição dos recintos
  const recintos = [
    {
      numero: 1,
      bioma: "savana",
      tamanhoTotal: 10,
      animais: { macaco: 3 },
    },
    { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: {} },
    {
      numero: 3,
      bioma: "savana e rio",
      tamanhoTotal: 7,
      animais: { gazela: 1 },
    },
    { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: {} },
    { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: { leão: 1 } },
  ];

  const animais = {
    LEAO: { tamanho: 3, bioma: "savana", quantidade: 1 },
    LEOPARDO: { tamanho: 2, bioma: "savana", quantidade: 2 },
    CROCODILO: { tamanho: 3, bioma: "rio", quantidade: 1 },
    MACACO: { tamanho: 1, bioma: "savana ou floresta", quantidade: 4 },
    GAZELA: { tamanho: 2, bioma: "savana", quantidade: 2 },
    HIPOPOTAMO: { tamanho: 4, bioma: "savana ou rio", quantidade: 1 },
  };

  function filtraRecintos(tipoAnimal, quantidade, deveSerViavel) {
    const tipoAnimalUpper = tipoAnimal.toUpperCase();
    if (!animais[tipoAnimalUpper]) return { erro: "Animal inválido" };
    if (isNaN(quantidade) || quantidade <= 0)
      return { erro: "Quantidade inválida" };

    const animal = animais[tipoAnimalUpper];
    const { bioma: biomaAnimal, tamanho: tamanhoAnimal } = animal;

    const recintosFiltrados = recintos
      .map((recinto) => {
        const tamanhoOcupado = Object.keys(recinto.animais).reduce(
          (acc, chave) =>
            acc +
            (animais[chave.toUpperCase()]?.tamanho || 0) *
              (recinto.animais[chave] || 0),
          0
        );

        const espacoLivre = recinto.tamanhoTotal - tamanhoOcupado;
        const espacoNecessario = quantidade * tamanhoAnimal;

        const podeAcomodar = biomaAnimal
          .split(" ou ")
          .some((bioma) => recinto.bioma.includes(bioma));
        const tamanhoSuficiente =
          espacoLivre >=
          espacoNecessario + (Object.keys(recinto.animais).length > 0 ? 1 : 0);

        return {
          numero: recinto.numero,
          espacoLivre,
          tamanhoTotal: recinto.tamanhoTotal,
          podeAcomodar: podeAcomodar && tamanhoSuficiente,
        };
      })
      .filter((recinto) =>
        deveSerViavel ? recinto.podeAcomodar : !recinto.podeAcomodar
      )
      .map(
        (recinto) =>
          `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`
      );

    return recintosFiltrados.length > 0
      ? { recintos: recintosFiltrados }
      : {
          erro: deveSerViavel
            ? "Não há recinto viável"
            : "Todos os recintos são viáveis",
        };
  }

  function populateAnimalOptions() {
    const select = document.getElementById("tipoAnimal");
    for (const [key, { quantidade }] of Object.entries(animais)) {
      const option = document.createElement("option");
      option.value = key.toLowerCase();
      option.textContent = `${
        key.charAt(0).toUpperCase() + key.slice(1)
      } (${quantidade})`;
      select.appendChild(option);
    }
  }

  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const tipoAnimal = document.getElementById("tipoAnimal").value;
    const quantidade = parseInt(
      document.getElementById("quantidade").value,
      10
    );

    const resultadoViaveis = filtraRecintos(tipoAnimal, quantidade, true);
    const resultadoNaoViaveis = filtraRecintos(tipoAnimal, quantidade, false);
    const resultsP = document.getElementById("results");

    let resultadoHtml = "";

    if (resultadoViaveis.erro) {
      resultadoHtml += `<span class="error">${resultadoViaveis.erro}</span>`;
    } else {
      resultadoHtml += `<strong>Recintos viáveis:</strong><ul>${resultadoViaveis.recintos
        .map((recinto) => `<li>${recinto}</li>`)
        .join("")}</ul>`;
    }

    if (resultadoNaoViaveis.erro) {
      resultadoHtml += `<strong><br>${resultadoNaoViaveis.erro}</strong>`;
    } else {
      resultadoHtml += `<strong><br>Recintos não viáveis:</strong><ul>${resultadoNaoViaveis.recintos
        .map((recinto) => `<li>${recinto}</li>`)
        .join("")}</ul>`;
    }

    resultsP.innerHTML = resultadoHtml;
  });

  populateAnimalOptions();
});
