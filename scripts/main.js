const executionQueue = [];

document.querySelector('#calculator')
  .addEventListener('click', clickHandler);



function clickHandler(event) {
  event.stopPropagation();

  const target = event.target;
  
  if (target.classList.contains('key')) {
    const value = target.textContent;

    clearErrorQueue(executionQueue);

    if (/\d/.test(value)) {
      // console.log('digit');
      handleDigitButton(value);
    }

    if (value === '.') {
      handleDecimalPoint(value);
    }

    if (/[+\-x/]/.test(value)) {
      // console.log('operator')
      handleOperatorButton(value);
    }

    if (/[()]/.test(value)) {
      handleParenthesis(value);
    }
    
    if (value === 'AC') {
      clearDisplay();
    }
    
    if (value === '<') {
      undoLastInput();
    }
    
    
    if(value === '=') {
      evaluateQueue(executionQueue);
    }

    updateDisplay();

    return;
  }

  if (target.classList.contains('display')) {
    //
    return;
  }
}


function isNumber(value) {
  return /[\d\.]/.test(value);
}

function clearErrorQueue(queue) {
  if (queue.length === 1) {
    if (queue[0].includes('ERROR')) queue.pop();
  }
}

function handleDigitButton(digit) {
  let lastIndex = executionQueue.length - 1;

  if (isNumber(executionQueue[lastIndex])) {
    
    if (executionQueue[lastIndex] === '0') {
      executionQueue[lastIndex] = digit;
      return;
    }

    if (executionQueue[lastIndex].length < 11) {
      executionQueue[lastIndex] += digit;
      return;
    }


  } else {
    executionQueue.push(digit);
  }
}

function handleDecimalPoint(decimalPoint) {
  let lastIndex = executionQueue.length - 1;

  if (isNumber(executionQueue[lastIndex])) {
    if (executionQueue[lastIndex].includes(decimalPoint)) return;
    executionQueue[lastIndex] += decimalPoint;

  }

}

function handleOperatorButton(operator) {
  let lastIndex = executionQueue.length - 1;

  if (isNumber(executionQueue[lastIndex])) {
    executionQueue.push(operator);
  }
}

function handleParenthesis(parenthesis) {
  //
}

function clearDisplay() {
  executionQueue.splice(0);
}

function undoLastInput() {
  let lastIndex = executionQueue.length - 1;

  if (executionQueue.length < 1) return;

  if (executionQueue[lastIndex].length > 1) {
    executionQueue[lastIndex] = executionQueue[lastIndex].slice(0, -1);
  } else {
    executionQueue.pop();
  }
}


function evaluateQueue(queue) {
  while (queue.length > 1) {

    if(queue.includes('/')) {
      calculate('/', divide, queue);
      continue;
    }

    if(queue.includes('x')) {
      calculate('x', multiply, queue);
      continue;
    }

    if(queue.includes('-')) {
      calculate('-', substrac, queue);
      continue;
    }

    if(queue.includes('+')) {
      calculate('+', add, queue);
      continue;
    }

  }
  if (queue[0] === 'Infinity') queue[0] = 'DIV/0 ERROR'
}

function calculate(operator, operatorFunction, queue) {
  let index = queue.indexOf(operator);
  queue.splice(index - 1, 3, String(
      operate(operatorFunction, Number(queue[index - 1]), Number(queue[index + 1])))
      );
}



function updateDisplay() {

  const displayQueue = executionQueue.map(element => {
    if (executionQueue.length > 1 && element.length > 5) {
      return element.slice(0, 5) + '...';
    }

    return element;
  })

  document.querySelector('#display')
    .textContent = displayQueue.join(' ');
}


function add(a, b) {
  return a + b;
}

function substrac(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operation, a, b) {
  return operation(a, b);
}


//keyboard support

addKeydownEvent();

function addKeydownEvent() {
  window.addEventListener('keydown', handleKeyPress)
}

function handleKeyPress(event) {
  const key = event.key;
  if (!isValidKey(key)) return;

  event.preventDefault();

  const adaptedKey = adaptKey(key);
  document.querySelector(`#key-${adaptedKey}`).click();
}

function isValidKey(key) {
  return key === 'Enter' || 
         key === 'Backspace' || 
         key === 'Escape' ||
         /^[\d\.+\-x*/()=]$/.test(key);
}

function adaptKey(key) {
  if (/[\d()]/.test(key)) return key;

  const specialKeysMap = {
    'Enter': 'calculate',
    '=': 'calculate',
    'Escape': 'clear',
    'Backspace': 'back',
    '.': 'dot',
    '/': 'divide',
    'x': 'multiply',
    '*': 'multiply',
    '+': 'add',
    '-': 'substract',
  }
  return specialKeysMap[key];
}