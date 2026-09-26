import React from 'react';
import { MapPin, FileText, CreditCard, CheckCircle } from 'lucide-react';

export const CheckoutSteps = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: 'Delivery Address', icon: MapPin },
    { number: 2, label: 'Order Summary', icon: FileText },
    { number: 3, label: 'Payment', icon: CreditCard },
    { number: 4, label: 'Confirmation', icon: CheckCircle }
  ];

  return (
    <div className="max-w-3xl mx-auto mb-10 px-4">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-md'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs mt-2 font-bold tracking-tight hidden sm:block ${
                  isCurrent ? 'text-brand-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
