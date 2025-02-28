/* js/script.js */
document.addEventListener("DOMContentLoaded", function() {
    // Función para obtener valor numérico
    function obtenerValor(id) {
      const valor = document.getElementById(id).value.trim();
      return valor === "" ? 0 : parseFloat(valor);
    }
  
    // Validación: solo números positivos
    function validarValor(valor) {
      return !isNaN(valor) && valor >= 0;
    }
  
    // Convertir cadena separada por comas a array de números
    function convertirCadenaAArray(cadena) {
      return cadena.split(",").map(item => parseFloat(item.trim())).filter(num => validarValor(num));
    }
  
    // Mostrar y limpiar mensajes de error
    function mostrarError(mensaje) {
      document.getElementById("errorMensaje").textContent = mensaje;
    }
    function limpiarError() {
      document.getElementById("errorMensaje").textContent = "";
    }
  
    // Toggle secciones avanzadas según método seleccionado
    function toggleSeccionAvanzada(idSelect, idAdvanced) {
      const selectElem = document.getElementById(idSelect);
      const advancedElem = document.getElementById(idAdvanced);
      if (selectElem.value === "avanzado") {
        advancedElem.classList.remove("oculto");
      } else {
        advancedElem.classList.add("oculto");
      }
    }
    document.getElementById("metodoElectrico").addEventListener("change", function() {
      toggleSeccionAvanzada("metodoElectrico", "advancedElectricidad");
    });
    document.getElementById("metodoAgua").addEventListener("change", function() {
      toggleSeccionAvanzada("metodoAgua", "advancedAgua");
    });
    document.getElementById("metodoOficina").addEventListener("change", function() {
      toggleSeccionAvanzada("metodoOficina", "advancedOficina");
    });
    document.getElementById("metodoLimpieza").addEventListener("change", function() {
      toggleSeccionAvanzada("metodoLimpieza", "advancedLimpieza");
    });
  
    // Funciones de cálculo básico y avanzado
    function calcularBasico(base, factor, meses) {
      return base * factor * meses;
    }
    function calcularAvanzado(arrayDatos, meses) {
      return arrayDatos.slice(0, meses).reduce((acc, val) => acc + val, 0);
    }
  
    // Funciones avanzadas de Electricidad
    function promedioMensual(arrayDatos) {
      return arrayDatos.reduce((acc, val) => acc + val, 0) / arrayDatos.length;
    }
    function consumoTeoricoAnual(arrayDatos) {
      return calcularAvanzado(arrayDatos, 12);
    }
    function consumoRealAnual(arrayDatos, factorVacacional) {
      let total = 0;
      for (let i = 0; i < arrayDatos.length; i++) {
        // Suponemos que el 8º mes (índice 7, agosto) se reduce
        total += (i === 7) ? arrayDatos[i] * factorVacacional : arrayDatos[i];
      }
      return total;
    }
    function produccionFotovoltaicaAnual(produccionDiaria) {
      return produccionDiaria * 365;
    }
    function autoconsumoRealDiario(promedioMensualVal, porcentaje) {
      return (promedioMensualVal / 30) * (porcentaje / 100);
    }
  
    // Almacenamiento en localStorage
    function almacenarResultados(clave, datos) {
      localStorage.setItem(clave, JSON.stringify(datos));
    }
    function obtenerResultados(clave) {
      return JSON.parse(localStorage.getItem(clave));
    }
  
    // Función para generar tabla comparativa para Electricidad (método avanzado)
    function generarTablaComparativaElectricidad(arrayDatos) {
      const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      let tablaHTML = `<h3>Comparativa de Consumo Mensual (Electricidad)</h3>`;
      tablaHTML += `<table><tr><th>Mes</th><th>Consumo (kWh)</th></tr>`;
      arrayDatos.forEach((valor, index) => {
        tablaHTML += `<tr><td>${meses[index]}</td><td>${valor.toFixed(2)}</td></tr>`;
      });
      tablaHTML += `</table>`;
      document.getElementById("tablaComparativaElectrica").innerHTML = tablaHTML;
    }
  
    // Actualizar publicación de datos y gráficas
    function actualizarPublicacionDatos() {
      const datosPublicadosDiv = document.getElementById("datosPublicados");
      let html = "";
      const electricidad = obtenerResultados("resultadosElectricidad");
      const agua = obtenerResultados("resultadosAgua");
      const oficina = obtenerResultados("resultadosOficina");
      const limpieza = obtenerResultados("resultadosLimpieza");
  
      if (electricidad) {
        html += `<h3>Electricidad</h3>
          <table>
            <tr><th>Consumo Anual (kWh)</th><td>${electricidad.anual}</td></tr>
            <tr><th>Consumo para el período (${electricidad.meses} meses)</th><td>${electricidad.periodo}</td></tr>
            <tr><th>Método</th><td>${electricidad.metodo}</td></tr>
          </table>`;
      }
      if (agua) {
        html += `<h3>Agua</h3>
          <table>
            <tr><th>Consumo Anual (litros)</th><td>${agua.anual}</td></tr>
            <tr><th>Consumo para el período (${agua.meses} meses)</th><td>${agua.periodo}</td></tr>
            <tr><th>Método</th><td>${agua.metodo}</td></tr>
          </table>`;
      }
      if (oficina) {
        html += `<h3>Consumibles de Oficina</h3>
          <table>
            <tr><th>Gasto Anual (€)</th><td>${oficina.anual}</td></tr>
            <tr><th>Gasto para el período (${oficina.meses} meses)</th><td>${oficina.periodo}</td></tr>
            <tr><th>Método</th><td>${oficina.metodo}</td></tr>
          </table>`;
      }
      if (limpieza) {
        html += `<h3>Productos de Limpieza</h3>
          <table>
            <tr><th>Gasto Anual (€)</th><td>${limpieza.anual}</td></tr>
            <tr><th>Gasto para el período (${limpieza.meses} meses)</th><td>${limpieza.periodo}</td></tr>
            <tr><th>Método</th><td>${limpieza.metodo}</td></tr>
          </table>`;
      }
      datosPublicadosDiv.innerHTML = html;
      actualizarGraficas(electricidad, agua, oficina, limpieza);
      // Si el método de electricidad es avanzado y se han ingresado 12 valores, genera la tabla comparativa
      if (electricidad && electricidad.metodo.indexOf("Avanzado") !== -1 && window.arrayElectricoDatos && window.arrayElectricoDatos.length === 12) {
        generarTablaComparativaElectricidad(window.arrayElectricoDatos);
      } else {
        document.getElementById("tablaComparativaElectrica").innerHTML = "";
      }
    }
  
    // Función para actualizar gráficas (Chart.js)
    function actualizarGraficas(electricidad, agua, oficina, limpieza) {
      // Gráfica de Electricidad en modo avanzado (consumo mensual)
      if (electricidad && electricidad.metodo.indexOf("Avanzado") !== -1 && window.arrayElectricoDatos && window.arrayElectricoDatos.length === 12) {
        const ctxElec = document.getElementById("graficaElectricidad").getContext("2d");
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        new Chart(ctxElec, {
          type: 'line',
          data: {
            labels: meses,
            datasets: [{
              label: 'Consumo Mensual (kWh)',
              data: window.arrayElectricoDatos,
              backgroundColor: 'rgba(75, 192, 192, 0.4)',
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: true
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
          }
        });
      } else if (electricidad) {
        const ctxElec = document.getElementById("graficaElectricidad").getContext("2d");
        new Chart(ctxElec, {
          type: 'bar',
          data: {
            labels: ["Anual", "Período"],
            datasets: [{
              label: 'Consumo (kWh)',
              data: [parseFloat(electricidad.anual), parseFloat(electricidad.periodo)],
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)']
            }]
          },
          options: { responsive: true, plugins: { legend: { display: true } } }
        });
      }
      // Gráfica para Agua en modo avanzado (si hay datos mensuales)
      if (agua && agua.metodo.indexOf("Avanzado") !== -1 && window.arrayAguaDatos && window.arrayAguaDatos.length === 12) {
        const ctxAgua = document.getElementById("graficaAgua").getContext("2d");
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        new Chart(ctxAgua, {
          type: 'line',
          data: {
            labels: meses,
            datasets: [{
              label: 'Consumo Mensual (litros)',
              data: window.arrayAguaDatos,
              backgroundColor: 'rgba(54, 162, 235, 0.4)',
              borderColor: 'rgba(54, 162, 235, 1)',
              fill: true
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
          }
        });
      } else if (agua) {
        const ctxAgua = document.getElementById("graficaAgua").getContext("2d");
        new Chart(ctxAgua, {
          type: 'line',
          data: {
            labels: ["Anual", "Período"],
            datasets: [{
              label: 'Consumo (litros)',
              data: [parseFloat(agua.anual), parseFloat(agua.periodo)],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              fill: false
            }]
          },
          options: { responsive: true, plugins: { legend: { display: true } } }
        });
      }
      // Se pueden agregar gráficas similares para consumibles y limpieza si se proporcionan datos avanzados.
    }
  
    // Sección Ayuda: botones para mostrar/ocultar
    document.getElementById("btnAyuda").addEventListener("click", function() {
      document.getElementById("seccionAyuda").classList.remove("oculto");
    });
    document.getElementById("cerrarAyuda").addEventListener("click", function() {
      document.getElementById("seccionAyuda").classList.add("oculto");
    });
  
    // Botón Calcular
    document.getElementById("btnCalcular").addEventListener("click", function() {
      limpiarError();
      let errores = [];
  
      // --- Electricidad ---
      const baseElectrica = obtenerValor("baseElectrica");
      const factorElectrico = obtenerValor("factorElectrico");
      const mesesElectrico = obtenerValor("mesesElectrico");
      const metodoElectrico = document.getElementById("metodoElectrico").value;
      const arrayElectricoInput = document.getElementById("arrayElectrico").value.trim();
      const consumoLunesViernes = obtenerValor("consumoLunesViernes");
      const consumoFinSemana = obtenerValor("consumoFinSemana");
  
      if (!validarValor(baseElectrica) || !validarValor(factorElectrico) || !validarValor(mesesElectrico)) {
        errores.push("Los campos de electricidad deben ser números positivos.");
      }
      let consumoElectricoAnual = 0;
      let consumoElectricoPeriodo = 0;
      let arrayElectrico = [];
      if (metodoElectrico === "avanzado" && arrayElectricoInput !== "") {
        arrayElectrico = convertirCadenaAArray(arrayElectricoInput);
        window.arrayElectricoDatos = arrayElectrico.slice(); // Guardar para gráficas y tabla comparativa
        if (arrayElectrico.length !== 12) {
          errores.push("Para electricidad (avanzado), ingrese 12 valores separados por comas.");
        } else {
          consumoElectricoAnual = calcularAvanzado(arrayElectrico, 12);
        }
      } else {
        consumoElectricoAnual = calcularBasico(baseElectrica, factorElectrico, 12);
      }
      consumoElectricoPeriodo = (metodoElectrico === "avanzado" && arrayElectrico.length === 12)
        ? calcularAvanzado(arrayElectrico, mesesElectrico)
        : calcularBasico(baseElectrica, factorElectrico, mesesElectrico);
  
      // Cálculos avanzados de Electricidad (solo si método avanzado y 12 datos)
      let promedioMensualVal = 0, consumoTeoricoAnualVal = 0, consumoRealAnualVal = 0;
      let produccionFotovoltaicaAnualVal = 0, autoconsumoRealDiarioVal = 0;
      const factorVacacionalElectrico = obtenerValor("factorVacacionalElectrico") || 1.0;
      const produccionFotovoltaica = obtenerValor("produccionFotovoltaica");
      const autoconsumo = obtenerValor("autoconsumoElectrico");
      if (metodoElectrico === "avanzado" && arrayElectrico.length === 12) {
        promedioMensualVal = promedioMensual(arrayElectrico);
        consumoTeoricoAnualVal = consumoTeoricoAnual(arrayElectrico);
        consumoRealAnualVal = consumoRealAnual(arrayElectrico, factorVacacionalElectrico);
        if (produccionFotovoltaica > 0) {
          produccionFotovoltaicaAnualVal = produccionFotovoltaicaAnual(produccionFotovoltaica);
        }
        autoconsumoRealDiarioVal = autoconsumoRealDiario(promedioMensualVal, autoconsumo);
      }
  
      // --- Agua ---
      const baseAgua = obtenerValor("baseAgua");
      const factorAgua = obtenerValor("factorAgua");
      const mesesAgua = obtenerValor("mesesAgua");
      const metodoAgua = document.getElementById("metodoAgua").value;
      const arrayAguaInput = document.getElementById("arrayAgua").value.trim();
      if (!validarValor(baseAgua) || !validarValor(factorAgua) || !validarValor(mesesAgua)) {
        errores.push("Los campos de agua deben ser números positivos.");
      }
      let consumoAguaAnual = 0;
      if (metodoAgua === "avanzado" && arrayAguaInput !== "") {
        const arrayAgua = convertirCadenaAArray(arrayAguaInput);
        window.arrayAguaDatos = arrayAgua.slice(); // Guardar para gráficas
        if (arrayAgua.length !== 12) {
          errores.push("Para agua (avanzado), ingrese 12 valores separados por comas.");
        } else {
          consumoAguaAnual = calcularAvanzado(arrayAgua, 12);
        }
      } else {
        consumoAguaAnual = calcularBasico(baseAgua, factorAgua, 12);
      }
      const consumoAguaPeriodo = (metodoAgua === "avanzado" && arrayAguaInput !== "")
        ? calcularAvanzado(convertirCadenaAArray(arrayAguaInput), mesesAgua)
        : calcularBasico(baseAgua, factorAgua, mesesAgua);
  
      // --- Consumibles de Oficina ---
      const baseOficina = obtenerValor("baseOficina");
      const mesesOficina = obtenerValor("mesesOficina");
      const metodoOficina = document.getElementById("metodoOficina").value;
      const arrayOficinaInput = document.getElementById("arrayOficina").value.trim();
      if (!validarValor(baseOficina) || !validarValor(mesesOficina)) {
        errores.push("Los campos de consumibles de oficina deben ser números positivos.");
      }
      let gastoOficinaAnual = 0;
      if (metodoOficina === "avanzado" && arrayOficinaInput !== "") {
        const arrayOficina = convertirCadenaAArray(arrayOficinaInput);
        if (arrayOficina.length !== 12) {
          errores.push("Para consumibles de oficina (avanzado), ingrese 12 valores separados por comas.");
        } else {
          gastoOficinaAnual = calcularAvanzado(arrayOficina, 12);
        }
      } else {
        gastoOficinaAnual = calcularBasico(baseOficina, 1, 12);
      }
      const gastoOficinaPeriodo = (metodoOficina === "avanzado" && arrayOficinaInput !== "")
        ? calcularAvanzado(convertirCadenaAArray(arrayOficinaInput), mesesOficina)
        : calcularBasico(baseOficina, 1, mesesOficina);
  
      // --- Productos de Limpieza ---
      const baseLimpieza = obtenerValor("baseLimpieza");
      const mesesLimpieza = obtenerValor("mesesLimpieza");
      const metodoLimpieza = document.getElementById("metodoLimpieza").value;
      const arrayLimpiezaInput = document.getElementById("arrayLimpieza").value.trim();
      if (!validarValor(baseLimpieza) || !validarValor(mesesLimpieza)) {
        errores.push("Los campos de productos de limpieza deben ser números positivos.");
      }
      let gastoLimpiezaAnual = 0;
      if (metodoLimpieza === "avanzado" && arrayLimpiezaInput !== "") {
        const arrayLimpieza = convertirCadenaAArray(arrayLimpiezaInput);
        if (arrayLimpieza.length !== 12) {
          errores.push("Para productos de limpieza (avanzado), ingrese 12 valores separados por comas.");
        } else {
          gastoLimpiezaAnual = calcularAvanzado(arrayLimpieza, 12);
        }
      } else {
        gastoLimpiezaAnual = calcularBasico(baseLimpieza, 1, 12);
      }
      const gastoLimpiezaPeriodo = (metodoLimpieza === "avanzado" && arrayLimpiezaInput !== "")
        ? calcularAvanzado(convertirCadenaAArray(arrayLimpiezaInput), mesesLimpieza)
        : calcularBasico(baseLimpieza, 1, mesesLimpieza);
  
      if (errores.length > 0) {
        mostrarError(errores.join(" "));
        return;
      }
  
      // Almacenar resultados en localStorage para Electricidad
      const resultadosElectricidad = {
        anual: consumoElectricoAnual.toFixed(2),
        periodo: consumoElectricoPeriodo.toFixed(2),
        meses: mesesElectrico,
        metodo: metodoElectrico === "avanzado" ? "Avanzado (datos mensuales)" : "Básico (factor estacional)",
        promedioMensual: (arrayElectrico.length === 12) ? promedioMensual(arrayElectrico).toFixed(2) : "",
        consumoTeoricoAnual: (arrayElectrico.length === 12) ? consumoTeoricoAnual(arrayElectrico).toFixed(2) : "",
        consumoRealAnual: (arrayElectrico.length === 12) ? consumoRealAnual(arrayElectrico, factorVacacionalElectrico).toFixed(2) : "",
        produccionFotovoltaicaAnual: (produccionFotovoltaica > 0 && arrayElectrico.length === 12) ? produccionFotovoltaicaAnual(produccionFotovoltaica).toFixed(2) : "",
        autoconsumoRealDiario: (arrayElectrico.length === 12) ? autoconsumoRealDiario(promedioMensual(arrayElectrico), autoconsumo).toFixed(2) : "",
        consumoLunesViernes: consumoLunesViernes.toFixed(2),
        consumoFinSemana: consumoFinSemana.toFixed(2)
      };
      almacenarResultados("resultadosElectricidad", resultadosElectricidad);
  
      // Almacenar resultados en localStorage para Agua
      const resultadosAgua = {
        anual: consumoAguaAnual.toFixed(2),
        periodo: consumoAguaPeriodo.toFixed(2),
        meses: mesesAgua,
        metodo: metodoAgua === "avanzado" ? "Avanzado (datos mensuales)" : "Básico (factor estacional)"
      };
      almacenarResultados("resultadosAgua", resultadosAgua);
  
      // Almacenar resultados en localStorage para Consumibles de Oficina
      const resultadosOficina = {
        anual: gastoOficinaAnual.toFixed(2),
        periodo: gastoOficinaPeriodo.toFixed(2),
        meses: mesesOficina,
        metodo: metodoOficina === "avanzado" ? "Avanzado (datos mensuales)" : "Básico (valor fijo)"
      };
      almacenarResultados("resultadosOficina", resultadosOficina);
  
      // Almacenar resultados en localStorage para Productos de Limpieza
      const resultadosLimpieza = {
        anual: gastoLimpiezaAnual.toFixed(2),
        periodo: gastoLimpiezaPeriodo.toFixed(2),
        meses: mesesLimpieza,
        metodo: metodoLimpieza === "avanzado" ? "Avanzado (datos mensuales)" : "Básico (valor fijo)"
      };
      almacenarResultados("resultadosLimpieza", resultadosLimpieza);
  
      // Mostrar resultados en la sección de la calculadora
      document.getElementById("resultadoElectrico").innerHTML = `
        <h3>Electricidad - Cálculos Básicos</h3>
        <p>Consumo anual estimado: ${resultadosElectricidad.anual} kWh</p>
        <p>Consumo para el período (${mesesElectrico} meses): ${resultadosElectricidad.periodo} kWh</p>
        <p><em>Método: ${resultadosElectricidad.metodo}</em></p>
      `;
      if (metodoElectrico === "avanzado" && arrayElectrico.length === 12) {
        document.getElementById("resultadoAvanzadoElectrico").innerHTML = `
          <h3>Electricidad - Cálculos Avanzados</h3>
          <p>Consumo Promedio Mensual: ${resultadosElectricidad.promedioMensual} kWh</p>
          <p>Consumo Teórico Anual: ${resultadosElectricidad.consumoTeoricoAnual} kWh</p>
          <p>Consumo Real Anual (ajustado): ${resultadosElectricidad.consumoRealAnual} kWh</p>
          <p>Producción Fotovoltaica Anual: ${resultadosElectricidad.produccionFotovoltaicaAnual} kWh</p>
          <p>Autoconsumo Real Diario: ${resultadosElectricidad.autoconsumoRealDiario} kWh</p>
          <p>Consumo Total Lunes-Viernes: ${resultadosElectricidad.consumoLunesViernes} kWh</p>
          <p>Consumo Total Fin de Semana: ${resultadosElectricidad.consumoFinSemana} kWh</p>
        `;
      } else {
        document.getElementById("resultadoAvanzadoElectrico").innerHTML = "";
      }
      document.getElementById("resultadoAgua").innerHTML = `
        <h3>Agua</h3>
        <p>Consumo anual estimado: ${resultadosAgua.anual} litros</p>
        <p>Consumo para el período (${mesesAgua} meses): ${resultadosAgua.periodo} litros</p>
        <p><em>Método: ${resultadosAgua.metodo}</em></p>
      `;
      document.getElementById("resultadoOficina").innerHTML = `
        <h3>Consumibles de Oficina</h3>
        <p>Gasto anual estimado: €${resultadosOficina.anual}</p>
        <p>Gasto para el período (${mesesOficina} meses): €${resultadosOficina.periodo}</p>
        <p><em>Método: ${resultadosOficina.metodo}</em></p>
      `;
      document.getElementById("resultadoLimpieza").innerHTML = `
        <h3>Productos de Limpieza</h3>
        <p>Gasto anual estimado: €${resultadosLimpieza.anual}</p>
        <p>Gasto para el período (${mesesLimpieza} meses): €${resultadosLimpieza.periodo}</p>
        <p><em>Método: ${resultadosLimpieza.metodo}</em></p>
      `;
  
      actualizarPublicacionDatos();
    });
  
    // Actualizar publicación de datos al cargar la página
    actualizarPublicacionDatos();
  });
  