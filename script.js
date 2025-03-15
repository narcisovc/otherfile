// Variables globales para almacenar el último resultado y el modo de visualización
let currentResult = null;
let resultDisplayMode = "fraction"; // Puede ser "fraction" o "decimal"

// Función para agregar contenido a la operación mostrada
function appendToDisplay(value) {
  const operation = document.getElementById('operation');
  operation.textContent += value;
}

// Función para limpiar la operación y el resultado
function clearDisplay() {
  document.getElementById('operation').textContent = '';
  document.getElementById('result').innerHTML = '';
  currentResult = null;
}

// Función para eliminar el último carácter de la operación
function deleteChar() {
  const operation = document.getElementById('operation');
  operation.textContent = operation.textContent.slice(0, -1);
}

/**
 * Función para aproximar un número decimal a una fracción.
 * Si el error de aproximación es menor que 'tolerance' y se encuentra
 * una representación simple (con denominador ≤ maxDenom), se devuelve la fracción.
 * En caso contrario, se retorna null, interpretándose el número como "irracional"
 * para el propósito de visualización.
 */
function decimalToFraction(value, tolerance = 1e-6, maxDenom = 100) {
  if (value === 0) return "0/1";
  
  if (Math.abs(value - Math.round(value)) < tolerance) {
    return Math.round(value) + "/1";
  }
  
  let bestNum = 1;
  let bestDenom = 1;
  let bestError = Math.abs(value - bestNum / bestDenom);
  
  for (let denom = 1; denom <= maxDenom; denom++) {
    let num = Math.round(value * denom);
    let error = Math.abs(value - num / denom);
    if (error < bestError) {
      bestError = error;
      bestNum = num;
      bestDenom = denom;
    }
    if (error < tolerance) {
      break;
    }
  }
  
  if (bestError > tolerance) {
    return null;
  }
  
  return bestNum + "/" + bestDenom;
}

/**
 * Función para mostrar el resultado en la pantalla, de acuerdo al modo actual.
 * Si el modo es "fraction" y se puede representar como fracción, se muestra con estructura HTML.
 * En caso contrario se muestra en formato decimal.
 */
function displayResult(result) {
  const resultContainer = document.getElementById('result');
  if (typeof result === "number") {
    if (resultDisplayMode === "fraction") {
      let fraction = decimalToFraction(result);
      if (fraction !== null) {
        let parts = fraction.split("/");
        resultContainer.innerHTML = `
          <div class="fraction">
            <div class="numerator">${parts[0]}</div>
            <div class="denominator">${parts[1]}</div>
          </div>`;
      } else {
        resultContainer.textContent = result.toFixed(8);
      }
    } else {
      resultContainer.textContent = result.toFixed(8);
    }
  } else {
    resultContainer.textContent = result;
  }
}

// Función para evaluar la operación y mostrar el resultado
function calculate() {
  const operationText = document.getElementById('operation').textContent;
  try {
    let resultado = eval(operationText);
    currentResult = resultado;
    displayResult(currentResult);
  } catch (error) {
    document.getElementById('result').textContent = 'Error';
  }
}

// Función para alternar entre la representación fraccional y decimal del resultado
function toggleResultRepresentation() {
  if (currentResult === null) return;
  resultDisplayMode = (resultDisplayMode === "fraction") ? "decimal" : "fraction";
  displayResult(currentResult);
}