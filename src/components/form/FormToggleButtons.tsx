import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface FormToggleButtonsProps {
  options: { label: string; value: string | number; color: string }[];
  value: string;
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | number | null
  ) => void;
}

export default function FormToggleButtons({
  options,
  value,
  onChange,
}: FormToggleButtonsProps) {
  return (
    <ToggleButtonGroup value={value} exclusive onChange={onChange}>
      {options.map(({ label, value, color }) => (
        <ToggleButton color={color} value={value}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
