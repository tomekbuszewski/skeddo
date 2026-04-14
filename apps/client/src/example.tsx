import { Button } from "@skeddo/ui/atoms/button";
import { useState } from "react";

export default function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button onClick={() => setVisible(!visible)}>Toggle</Button>
      {visible && <p>Hello</p>}
    </div>
  );
}
