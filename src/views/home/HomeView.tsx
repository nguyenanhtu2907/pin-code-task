import { fill } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { isValidNumber } from "../../common/utils/detect";
import { notify } from "../../common/utils/notify";
import "./HomeView.scss";
import PinBox from "./PinBox";

const DEFAULT_BOX_NUMBER = 6;

const Home: React.FC = () => {
  const [values, setValues] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalInput, setTotalInput] = useState(DEFAULT_BOX_NUMBER);
  const [isSecret, setIsSecret] = useState(false);
  const [rule, setRule] = useState<RegExp | null>(null);

  const totalBoxRef = useRef<HTMLInputElement | null>(null);
  const ruleRef = useRef<HTMLInputElement | null>(null);

  const onPaste = (value: string) => {
    const newValues: string[] = [];
    for (let i = 0; i < value.length; i++) {
      if (!isValidNumber(value.charAt(i))) {
        break;
      }
      newValues.push(value.charAt(i));
    }

    setValues([
      ...values.map((old, index) =>
        index < currentIndex || index >= currentIndex + newValues.length
          ? old
          : newValues[index - currentIndex]
      ),
    ]);
  };

  useEffect(() => {
    setValues(fill(Array(totalInput), ""));
  }, [totalInput, rule]);

  const onSubmit = () => {
    console.log(values.join(""));
  };

  return (
    <div className="home">
      <h3 className="home__title">
        Please enter the pin code{" "}
        <button onClick={() => setIsSecret(!isSecret)}>
          {isSecret ? "Show code" : "Hide code"}
        </button>
      </h3>

      <p>Rule of input: {`${rule || "Number only"}`}</p>

      <div className="home__codes">
        {values.map((v, index) => {
          return (
            <PinBox
              key={index}
              currentIndex={currentIndex}
              index={index}
              value={v}
              isSecret={isSecret}
              onChange={(value) => {
                const newValues = [...values];
                newValues[index] = value;
                setValues(newValues);
              }}
              setCurrentIndex={(next) =>
                next >= 0 && next < totalInput
                  ? setCurrentIndex(next)
                  : undefined
              }
              onPaste={onPaste}
              rule={rule}
            />
          );
        })}
      </div>

      <div className="home__settings">
        <span>Enter the number of pin boxes:</span>
        <input
          ref={totalBoxRef}
          defaultValue={totalInput}
          onChange={(e) => {
            const incomingValue = e.target.value;
            if (
              totalBoxRef.current &&
              (!incomingValue || isValidNumber(incomingValue))
            ) {
              totalBoxRef.current.value = incomingValue;
            }
          }}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            setTotalInput(
              totalBoxRef.current &&
                totalBoxRef.current.value &&
                isValidNumber(totalBoxRef.current.value)
                ? Number(totalBoxRef.current.value)
                : DEFAULT_BOX_NUMBER
            )
          }
        />
      </div>
      <div className="home__settings">
        <span>Enter the rule of pin code:</span>
        <input
          ref={ruleRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && ruleRef.current) {
              try {
                if (ruleRef.current.value) {
                  const regex = new RegExp(ruleRef.current.value);

                  setRule(regex);
                } else {
                  setRule(null);
                }
              } catch (error) {
                notify.error("Invalid Regular Expression");
                setRule(null);
              }
              ruleRef.current.blur();
            }
          }}
        />
      </div>

      <div className="home__actions">
        <button onClick={() => setValues(fill(Array(totalInput), ""))}>
          Reset
        </button>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Home;
