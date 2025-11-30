import React, { createContext, useContext, useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  type Breakpoint,
} from "@mui/material";
import CustomDialog from "./Dialog";

type Option = string | { label: string; value: any };

type ConfirmSelectOptions = {
  title?: string;
  label?: string;
  size?: Breakpoint;
};

type ConfirmSelectContextType = (
  options: Option[],
  config?: ConfirmSelectOptions
) => Promise<any>;

const ConfirmSelectContext = createContext<ConfirmSelectContextType | null>(
  null
);

export const ConfirmSelectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [config, setConfig] = useState<ConfirmSelectOptions>({});
  const [value, setValue] = useState<any>("");

  const [resolver, setResolver] = useState<(value: any) => void>(() => {});

  const confirmSelect: ConfirmSelectContextType = (opts, cfg) => {
    setOptions(opts);
    setConfig(cfg || {});
    setValue(""); // reset selection
    setOpen(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    setOpen(false);
    resolver(value);
  };

  const handleCancel = () => {
    setOpen(false);
    resolver(null);
  };

  return (
    <ConfirmSelectContext.Provider value={confirmSelect}>
      {children}
      <CustomDialog
        hideFullScreenButton
        open={open}
        setOpen={setOpen}
        onCancel={handleCancel}
        title={config.title || "Select an option"}
        actions={[
          {
            label: "Confirm",
            onClick: handleConfirm,
            disabled: !value,
          },
        ]}
        size={config.size || "xs"}
      >
        <FormControl fullWidth size="small">
          <InputLabel>{config.label || "Option"}</InputLabel>

          <Select
            value={value}
            label={config.label || "Option"}
            slotProps={{ input: { size: 1 } }}
            onChange={(e) => setValue(e.target.value)}
          >
            {options.map((opt, idx) => {
              const label = typeof opt === "string" ? opt : opt.label;
              const val = typeof opt === "string" ? opt : opt.value;
              return (
                <MenuItem key={idx} value={val}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </CustomDialog>
    </ConfirmSelectContext.Provider>
  );
};

export const useConfirmSelect = () => {
  const ctx = useContext(ConfirmSelectContext);
  if (!ctx)
    throw new Error(
      "useConfirmSelect must be used inside ConfirmSelectProvider"
    );
  return ctx;
};
