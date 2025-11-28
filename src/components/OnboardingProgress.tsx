import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    label: string;
    description?: string;
  }[];
}

export function OnboardingProgress({ currentStep, totalSteps, steps }: OnboardingProgressProps) {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-white rounded-full shadow-lg"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div
              key={index}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center">
                {/* Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? 'rgba(255, 255, 255, 1)'
                      : isCurrent
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.3)',
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isCompleted ? 'text-purple-600' : isCurrent ? 'text-purple-600' : 'text-white'}
                    ${isCurrent ? 'ring-4 ring-white/30' : ''}
                    transition-all duration-300
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <span className="text-sm">{stepNumber}</span>
                  )}
                </motion.div>

                {/* Label - only show on larger screens */}
                <div className="hidden sm:block mt-2 text-center">
                  <p
                    className={`
                      text-xs
                      ${isCurrent ? 'text-white' : 'text-white/70'}
                    `}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-white/20 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
