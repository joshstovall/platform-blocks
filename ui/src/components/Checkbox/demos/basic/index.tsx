import React, { useState } from 'react';
import { Checkbox } from '../..';

export default function BasicCheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox 
      label="Accept terms and conditions"
      checked={checked}
      onChange={setChecked}
    />
  );
}
