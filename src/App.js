import { useReducer } from "react";
import "./style.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

const INITIAL_STATE = {
  overwrite: false,
  currentOperand: "",
  previousOperand: "",
  operation: "",
};

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOSE_OPERATION: "chose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite === true) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        };
      }

      if (action.payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      if (action.payload.digit === ".") {
        if (state.currentOperand === "") {
          return {
            ...state,
            currentOperand: "0.",
          };
        } else if (state.currentOperand.includes(".")) {
          return state;
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand}${action.payload.digit}`,
      };
    case ACTIONS.CLEAR:
      return INITIAL_STATE;
    case ACTIONS.CHOSE_OPERATION:
      if (state.currentOperand === "" && state.previousOperand === "") {
        return state;
      }

      if (state.currentOperand === "") {
        return {
          ...state,
          operation: action.payload.operation,
        };
      }

      if (state.previousOperand === "") {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: "",
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: "",
      };
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand === "" ||
        state.previousOperand === "" ||
        state.operation === ""
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: "",
        operation: "",
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: "",
          overwrite: false,
        };
      }
      if (state.currentOperand === "") {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: "",
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    default:
      return state;
  }
}

function evaluate(state) {
  const previous = parseFloat(state.previousOperand);
  const current = parseFloat(state.currentOperand);
  if (isNaN(previous) || isNaN(current)) {
    return "";
  }

  let result = "";
  switch (state.operation) {
    case "+":
      result = previous + current;
      break;
    case "-":
      result = previous - current;
      break;
    case "*":
      result = previous * current;
      break;
    case "÷":
      result = previous / current;
      break;
    default:
      return "";
  }

  return result.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand === "") return;

  const [integer, decimal] = operand.split(".");
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(state.previousOperand)} {state.operation}
        </div>
        <div className="current-operand">
          {formatOperand(state.currentOperand)}
        </div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
