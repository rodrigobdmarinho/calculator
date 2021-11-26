import { ACTIONS } from "../../App";

function OperationButton(props) {
  return (
    <button
      onClick={() =>
        props.dispatch({
          type: ACTIONS.CHOSE_OPERATION,
          payload: { operation: props.operation },
        })
      }
    >
      {props.operation}
    </button>
  );
}

export default OperationButton;
