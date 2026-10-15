import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  wrapperClassName?: string;
}

export default function FormInput({ label, error, registration, wrapperClassName = "", id, ...inputProps }: FormInputProps) {
  return (
    <div className={`checkout-form__field ${wrapperClassName}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} {...registration} aria-invalid={Boolean(error)} />
      {error && <p className="checkout-form__error">{error}</p>}
    </div>
  );
}
