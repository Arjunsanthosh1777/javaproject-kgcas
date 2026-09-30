let expression = "";

let answer =
  Number(localStorage.getItem("calculatorAns")) || 0;

let memory =
  Number(localStorage.getItem("calculatorMemory")) || 0;

let angleMode =
  localStorage.getItem("calculatorAngle") || "DEG";

let history =
  JSON.parse(
    localStorage.getItem("calculatorHistory") || "[]"
  );


const expressionDisplay =
  document.getElementById("expression");

const resultDisplay =
  document.getElementById("result");

const angleDisplay =
  document.getElementById("angleMode");

const memoryIndicator =
  document.getElementById("memoryIndicator");

const historyList =
  document.getElementById("historyList");



/* =========================
   DISPLAY
========================= */

function updateDisplay() {

  expressionDisplay.textContent =
    expression || "0";

  resultDisplay.textContent =
    expression
      ? "…"
      : formatNumber(answer);

  angleDisplay.textContent =
    angleMode;

  memoryIndicator.textContent =
    memory !== 0 ? "M" : "";

  renderHistory();
}



/* =========================
   NUMBER FORMAT
========================= */

function formatNumber(number) {

  if (!Number.isFinite(number)) {

    throw new Error("Invalid result");

  }

  if (Math.abs(number) < 1e-12) {

    number = 0;

  }

  return Number(
    number.toPrecision(12)
  ).toString();

}



/* =========================
   LOCAL STORAGE
========================= */

function saveData() {

  localStorage.setItem(
    "calculatorAns",
    answer
  );

  localStorage.setItem(
    "calculatorMemory",
    memory
  );

  localStorage.setItem(
    "calculatorAngle",
    angleMode
  );

  localStorage.setItem(
    "calculatorHistory",
    JSON.stringify(history)
  );

}



/* =========================
   HISTORY
========================= */

function renderHistory() {

  if (!history.length) {

    historyList.innerHTML =
      `<div class="empty-history">
        No calculations yet.
      </div>`;

    return;

  }


  historyList.innerHTML =
    history
      .map(
        (item, index) => `

          <button
            class="history-item"
            data-history="${index}"
          >

            <div class="history-expression">
              ${escapeHTML(item.expression)}
            </div>

            <div class="history-result">
              = ${escapeHTML(item.result)}
            </div>

          </button>

        `
      )
      .join("");


  document
    .querySelectorAll(".history-item")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          expression =
            history[
              Number(button.dataset.history)
            ].expression;

          updateDisplay();

        }
      );

    });

}



/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

  return String(value)
    .replace(
      /[&<>"']/g,
      character => {

        const map = {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"

        };

        return map[character];

      }
    );

}



/* =========================
   TOKENIZER
========================= */

function tokenize(input) {

  const normalized =
    input

      .replaceAll("×", "*")
      .replaceAll("÷", "/")
      .replaceAll("−", "-")
      .replaceAll("π", "PI")
      .replaceAll(" ", "");


  const tokens = [];

  let index = 0;


  while (index < normalized.length) {

    const character =
      normalized[index];


    /* NUMBER */

    if (
      /[0-9.]/.test(character)
    ) {

      let number = character;

      index++;


      while (
        index < normalized.length &&
        /[0-9.]/.test(
          normalized[index]
        )
      ) {

        number +=
          normalized[index];

        index++;

      }


      if (
        (number.match(/\./g) || [])
          .length > 1
      ) {

        throw new Error(
          "Invalid number"
        );

      }


      tokens.push({

        type: "number",

        value: Number(number)

      });

      continue;

    }


    /* WORD */

    if (
      /[A-Za-z]/.test(character)
    ) {

      let word = character;

      index++;


      while (
        index < normalized.length &&
        /[A-Za-z]/.test(
          normalized[index]
        )
      ) {

        word +=
          normalized[index];

        index++;

      }


      tokens.push({

        type: "name",

        value: word.toUpperCase()

      });

      continue;

    }


    /* OPERATORS */

    if (
      "+-*/%^!()".includes(character)
    ) {

      tokens.push({

        type: "operator",

        value: character

      });

      index++;

      continue;

    }


    throw new Error(
      "Invalid character"
    );

  }


  return addImplicitMultiplication(
    tokens
  );

}



/* =========================
   IMPLICIT MULTIPLICATION
========================= */

function addImplicitMultiplication(
  tokens
) {

  const output = [];


  function canEnd(token) {

    return (
      token &&
      (
        token.type === "number" ||
        token.value === ")" ||
        token.value === "PI" ||
        token.value === "E" ||
        token.value === "ANS"
      )
    );

  }


  function canStart(token) {

    return (
      token &&
      (
        token.type === "number" ||
        token.type === "name" ||
        token.value === "("
      )
    );

  }


  for (
    let i = 0;
    i < tokens.length;
    i++
  ) {

    const previous =
      output[output.length - 1];

    const current =
      tokens[i];


    if (
      canEnd(previous) &&
      canStart(current)
    ) {

      output.push({

        type: "operator",

        value: "*"

      });

    }


    output.push(current);

  }


  return output;

}



/* =========================
   SHUNTING YARD
========================= */

const precedence = {

  "u-": 5,

  "!": 6,

  "^": 5,

  "*": 4,

  "/": 4,

  "%": 4,

  "+": 2,

  "-": 2

};


const rightAssociative =
  new Set(["^", "u-"]);


const functions =
  new Set([

    "SIN",
    "COS",
    "TAN",

    "ASIN",
    "ACOS",
    "ATAN",

    "LN",
    "LOG",

    "SQRT",
    "CBRT",

    "ABS"

  ]);



function convertToRPN(tokens) {

  const output = [];

  const operators = [];

  let expectingValue = true;


  for (const token of tokens) {


    /* NUMBER / CONSTANT */

    if (
      token.type === "number" ||
      (
        token.type === "name" &&
        !functions.has(token.value)
      )
    ) {

      output.push(token);

      expectingValue = false;

      continue;

    }


    /* FUNCTION */

    if (
      token.type === "name" &&
      functions.has(token.value)
    ) {

      operators.push(token);

      expectingValue = true;

      continue;

    }


    /* OPEN BRACKET */

    if (
      token.value === "("
    ) {

      operators.push(token);

      expectingValue = true;

      continue;

    }


    /* CLOSE BRACKET */

    if (
      token.value === ")"
    ) {

      while (
        operators.length &&
        operators.at(-1).value !== "("
      ) {

        output.push(
          operators.pop()
        );

      }


      if (!operators.length) {

        throw new Error(
          "Mismatched parentheses"
        );

      }


      operators.pop();


      if (
        operators.length &&
        operators.at(-1).type === "name"
      ) {

        output.push(
          operators.pop()
        );

      }


      expectingValue = false;

      continue;

    }


    let operator =
      token.value;


    /* UNARY MINUS */

    if (
      operator === "-" &&
      expectingValue
    ) {

      operator = "u-";

    }


    /* UNARY PLUS */

    if (
      operator === "+" &&
      expectingValue
    ) {

      continue;

    }


    if (
      operator === "!" &&
      expectingValue
    ) {

      throw new Error(
        "Invalid factorial"
      );

    }


    while (

      operators.length &&

      operators.at(-1).type ===
        "operator" &&

      operators.at(-1).value !== "(" &&

      (
        precedence[
          operators.at(-1).value
        ]
        >
        precedence[operator]

        ||

        (
          precedence[
            operators.at(-1).value
          ]
          ===
          precedence[operator]

          &&

          !rightAssociative.has(
            operator
          )
        )
      )

    ) {

      output.push(
        operators.pop()
      );

    }


    operators.push({

      type: "operator",

      value: operator

    });


    expectingValue = true;

  }


  while (operators.length) {

    const operator =
      operators.pop();


    if (
      operator.value === "("
    ) {

      throw new Error(
        "Mismatched parentheses"
      );

    }


    output.push(operator);

  }


  return output;

}



/* =========================
   MATH FUNCTIONS
========================= */

function toRadians(
  degrees
) {

  return degrees *
    Math.PI / 180;

}


function toDegrees(
  radians
) {

  return radians *
    180 / Math.PI;

}


function factorial(number) {

  if (
    !Number.isInteger(number) ||
    number < 0 ||
    number > 170
  ) {

    throw new Error(
      "Invalid factorial"
    );

  }


  let result = 1;


  for (
    let i = 2;
    i <= number;
    i++
  ) {

    result *= i;

  }


  return result;

}



/* =========================
   FUNCTION EVALUATION
========================= */

function applyFunction(
  name,
  value
) {

  switch (name) {

    case "SIN":

      return Math.sin(
        angleMode === "DEG"
          ? toRadians(value)
          : value
      );


    case "COS":

      return Math.cos(
        angleMode === "DEG"
          ? toRadians(value)
          : value
      );


    case "TAN":

      return Math.tan(
        angleMode === "DEG"
          ? toRadians(value)
          : value
      );


    case "ASIN":

      return toDegrees(
        Math.asin(value)
      );


    case "ACOS":

      return toDegrees(
        Math.acos(value)
      );


    case "ATAN":

      return toDegrees(
        Math.atan(value)
      );


    case "LN":

      if (value <= 0)

        throw new Error(
          "Invalid logarithm"
        );

      return Math.log(value);


    case "LOG":

      if (value <= 0)

        throw new Error(
          "Invalid logarithm"
        );

      return Math.log10(value);


    case "SQRT":

      if (value < 0)

        throw new Error(
          "Invalid square root"
        );

      return Math.sqrt(value);


    case "CBRT":

      return Math.cbrt(value);


    case "ABS":

      return Math.abs(value);


    default:

      throw new Error(
        "Unknown function"
      );

  }

}



/* =========================
   EVALUATOR
========================= */

function evaluate(
  input
) {

  const tokens =
    tokenize(input);


  const rpn =
    convertToRPN(tokens);


  const stack = [];


  for (const token of rpn) {


    /* NUMBER */

    if (
      token.type === "number"
    ) {

      stack.push(
        token.value
      );

      continue;

    }


    /* CONSTANTS */

    if (
      token.type === "name"
    ) {

      if (
        token.value === "PI"
      ) {

        stack.push(Math.PI);

      }

      else if (
        token.value === "E"
      ) {

        stack.push(Math.E);

      }

      else if (
        token.value === "ANS"
      ) {

        stack.push(answer);

      }

      else {

        const value =
          stack.pop();

        stack.push(
          applyFunction(
            token.value,
            value
          )
        );

      }

      continue;

    }


    const operator =
      token.value;


    /* NEGATIVE */

    if (
      operator === "u-"
    ) {

      const value =
        stack.pop();

      stack.push(-value);

      continue;

    }


    /* FACTORIAL */

    if (
      operator === "!"
    ) {

      const value =
        stack.pop();

      stack.push(
        factorial(value)
      );

      continue;

    }


    const right =
      stack.pop();

    const left =
      stack.pop();


    if (
      left === undefined ||
      right === undefined
    ) {

      throw new Error(
        "Invalid expression"
      );

    }


    switch (operator) {

      case "+":

        stack.push(
          left + right
        );

        break;


      case "-":

        stack.push(
          left - right
        );

        break;


      case "*":

        stack.push(
          left * right
        );

        break;


      case "/":

        if (right === 0)

          throw new Error(
            "Division by zero"
          );

        stack.push(
          left / right
        );

        break;


      case "%":

        stack.push(
          left * right / 100
        );

        break;


      case "^":

        stack.push(
          left ** right
        );

        break;


      default:

        throw new Error(
          "Unknown operator"
        );

    }

  }


  if (
    stack.length !== 1 ||
    !Number.isFinite(stack[0])
  ) {

    throw new Error(
      "Invalid expression"
    );

  }


  return stack[0];

}



/* =========================
   CALCULATE
========================= */

function calculate() {

  if (!expression)
    return;


  try {

    const value =
      evaluate(expression);


    const formatted =
      formatNumber(value);


    answer = value;


    history.unshift({

      expression:
        expression,

      result:
        formatted

    });


    history =
      history.slice(0, 30);


    expression = "";


    saveData();

    updateDisplay();

  }


  catch (error) {

    resultDisplay.textContent =
      "Error";


    setTimeout(
      updateDisplay,
      900
    );

  }

}



/* =========================
   INPUT
========================= */

function insertValue(
  value
) {

  expression += value;

  updateDisplay();

}



/* =========================
   SCIENTIFIC FUNCTIONS
========================= */

function scientificFunction(
  functionName
) {

  if (!expression) {

    expression = "ANS";

  }


  expression =
    `${functionName}(${expression})`;


  updateDisplay();

}



/* =========================
   BUTTON EVENTS
========================= */

document
  .querySelectorAll(
    "[data-value]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        insertValue(
          button.dataset.value
        );

      }
    );

  });



document
  .querySelectorAll(
    "[data-function]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        scientificFunction(
          button.dataset.function
            .toUpperCase()
        );

      }
    );

  });



document
  .querySelectorAll(
    "[data-action]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const action =
          button.dataset.action;


        /* CALCULATE */

        if (
          action === "calculate"
        ) {

          calculate();

        }


        /* CLEAR */

        else if (
          action === "clear"
        ) {

          expression = "";

          updateDisplay();

        }


        /* DELETE */

        else if (
          action === "delete"
        ) {

          expression =
            expression.slice(
              0,
              -1
            );

          updateDisplay();

        }


        /* ANSWER */

        else if (
          action === "answer"
        ) {

          insertValue("ANS");

        }


        /* SIGN */

        else if (
          action === "sign"
        ) {

          if (expression) {

            expression =
              `-(${expression})`;

          }

          else {

            expression = "-";

          }

          updateDisplay();

        }


        /* MEMORY CLEAR */

        else if (
          action ===
          "memory-clear"
        ) {

          memory = 0;

          saveData();

          updateDisplay();

        }


        /* MEMORY RECALL */

        else if (
          action ===
          "memory-recall"
        ) {

          insertValue(
            formatNumber(memory)
          );

        }


        /* MEMORY ADD */

        else if (
          action ===
          "memory-add"
        ) {

          try {

            memory +=
              evaluate(
                expression || "ANS"
              );

            saveData();

            updateDisplay();

          }

          catch {}

        }


        /* MEMORY SUBTRACT */

        else if (
          action ===
          "memory-subtract"
        ) {

          try {

            memory -=
              evaluate(
                expression || "ANS"
              );

            saveData();

            updateDisplay();

          }

          catch {}

        }

      }
    );

  });



/* =========================
   DEG / RAD
========================= */

document
  .getElementById("angleBtn")
  .addEventListener(
    "click",
    () => {

      angleMode =
        angleMode === "DEG"
          ? "RAD"
          : "DEG";


      saveData();

      updateDisplay();

    }
  );



/* =========================
   CLEAR HISTORY
========================= */

document
  .getElementById(
    "clearHistory"
  )
  .addEventListener(
    "click",
    () => {

      history = [];

      saveData();

      updateDisplay();

    }
  );



/* =========================
   DARK MODE
========================= */

const themeBtn =
  document.getElementById(
    "themeBtn"
  );


if (
  localStorage.getItem(
    "calculatorTheme"
  ) === "dark"
) {

  document.body.classList.add(
    "dark"
  );

  themeBtn.textContent = "☀️";

}


themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );


    const dark =
      document.body.classList.contains(
        "dark"
      );


    localStorage.setItem(
      "calculatorTheme",
      dark ? "dark" : "light"
    );


    themeBtn.textContent =
      dark ? "☀️" : "🌙";

  }
);



/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener(
  "keydown",
  event => {

    const key =
      event.key;


    /* NUMBERS */

    if (
      /[0-9.]/.test(key)
    ) {

      event.preventDefault();

      insertValue(key);

    }


    /* OPERATORS */

    else if (
      [
        "+",
        "-",
        "*",
        "/",
        "%",
        "(",
        ")",
        "!"
      ].includes(key)
    ) {

      event.preventDefault();


      let value = key;


      if (
        key === "*"
      )

        value = "×";


      if (
        key === "/"
      )

        value = "÷";


      if (
        key === "-"
      )

        value = "−";


      insertValue(value);

    }


    /* ENTER */

    else if (
      key === "Enter" ||
      key === "="
    ) {

      event.preventDefault();

      calculate();

    }


    /* BACKSPACE */

    else if (
      key === "Backspace"
    ) {

      event.preventDefault();

      expression =
        expression.slice(
          0,
          -1
        );

      updateDisplay();

    }


    /* ESC */

    else if (
      key === "Escape"
    ) {

      expression = "";

      updateDisplay();

    }

  }
);



/* INITIAL DISPLAY */

updateDisplay();