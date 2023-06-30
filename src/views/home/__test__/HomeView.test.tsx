import React from "react";
import { render, screen } from "@testing-library/react";
import HomeView from "../HomeView";

describe("Home View test", () => {
  test("should contains the title", () => {
    render(<HomeView />);
    const h3Element = screen.getByRole("h3");
    expect(h3Element).toHaveTextContent("Please enter the pin code");
  });
});
