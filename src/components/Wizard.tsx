import { ReactNode, useState } from 'react';

type Props = {
  children: (actions: { nextStep: () => void, previousStep: () => void }) => ReactNode[]
};

export function Wizard({ children }: Props) {
  const [step, setStep] = useState(0);

  const steps = children({
    nextStep: () => step < steps.length && setStep(step + 1),
    previousStep: () => step && setStep(step - 1)
  });

  return (
    <>
      {steps[step]}
    </>
  );
}
