import Example from "./example";
import { waitFor, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";

describe("sample test", () => {
  it("should test components", async () => {
    render(<Example />);

    await userEvent.click(screen.getByText("Toggle"));

    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
  });
});
