/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { isValidNumber } from "../../common/utils/detect";

interface PinBoxProps {
  currentIndex: number;
  index: number;
  value: string;
  onChange: (value: string) => void;
  setCurrentIndex: (num: number) => void;
  onPaste: (value: string) => void;
  isSecret: boolean;
  rule: RegExp | null;
}

const PinBox: React.FC<PinBoxProps> = ({
  currentIndex,
  index,
  value,
  onChange,
  setCurrentIndex,
  onPaste,
  isSecret,
  rule,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value && isValidNumber(value)) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [value]);

  useEffect(() => {
    if (currentIndex === index) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [currentIndex]);

  const handleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const incomingValue = e.key;

    if (incomingValue === "Backspace") {
      setCurrentIndex(currentIndex - 1);
      onChange("");
    }

    const isValidValue =
      !incomingValue ||
      (rule ? rule.test(incomingValue) : isValidNumber(incomingValue));

    if (inputRef.current && incomingValue.length <= 1 && isValidValue) {
      onChange(incomingValue);
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="pin-box">
      <input
        className="pin-box__input"
        ref={inputRef}
        value={value}
        onFocus={() => setCurrentIndex(index)}
        onKeyDown={handleChange}
        onPaste={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onPaste(e.clipboardData.getData("text") || "");
        }}
        type={isSecret ? "password" : "text"}
      />
    </div>
  );
};

export default PinBox;
