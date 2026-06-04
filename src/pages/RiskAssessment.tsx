import { useEffect, useMemo, useState } from "react";
// @ts-expect-error - plain JS module
import { predictRisk, FORM_FIELDS, FORM_STEPS } from "@/heartRiskModel";

type FieldDef = {
  key: string;
  label: string;
  type: "number" | "select";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: number; label: string }[];
};

type RiskResult = {
  prediction: number | null;
  probability: number | null;
  risk: {
    level: "Low" | "Moderate" | "High";
    color: "green" | "yellow" | "red";
    percentage: number;
    message: string;
  } | null;
  errors: string[];
};

const fieldsByKey: Record<string, FieldDef> = (FORM_FIELDS as FieldDef[]).reduce(
  (acc, f) => ({ ...acc, [f.key]: f }),
  {}
);

const colorClasses = {
  green: { stroke: "stroke-green-500", text: "text-green-600", bg: "bg-green-50" },
  yellow: { stroke: "stroke-yellow-400", text: "text-yellow-600", bg: "bg-yellow-50" },
  red: { stroke: "stroke-red-500", text: "text-red-600", bg: "bg-red-50" },
};

const AnimatedGauge = ({ percentage, color }: { percentage: number; color: "green" | "yellow" | "red" }) => {
  const [animated, setAnimated] = useState(0);
  const size = 220;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  // Half-circle arc (semicircle gauge)
  const circumference = Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(percentage), 50);
    return () => clearTimeout(t);
  }, [percentage]);

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 40 }}>
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          className="stroke-gray-200"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          className={`${colorClasses[color].stroke} transition-all duration-1000 ease-out`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <span className={`text-5xl font-extrabold ${colorClasses[color].text}`}>
          {animated.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

const SegmentedSelect = ({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: number | undefined;
  onChange: (v: number) => void;
}) => {
  const opts = field.options || [];
  const gridCols = opts.length > 2 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
  return (
    <div className={`grid ${gridCols} gap-2`}>
      {opts.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            type="button"
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
              selected
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-foreground border-border hover:border-primary/50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

const NumberInput = ({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) => (
  <div className="flex items-stretch rounded-lg border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 bg-card">
    <input
      type="number"
      inputMode="decimal"
      min={field.min}
      max={field.max}
      step={field.step}
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? undefined : Number(v));
      }}
      className="flex-1 px-4 py-3 bg-transparent outline-none text-foreground"
      placeholder={`${field.min} – ${field.max}`}
    />
    {field.unit && (
      <span className="px-3 flex items-center text-sm text-muted-foreground bg-muted/50 border-l border-border">
        {field.unit}
      </span>
    )}
  </div>
);

const RiskAssessment = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, number | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RiskResult | null>(null);

  const totalSteps = FORM_STEPS.length;
  const currentStep = FORM_STEPS[step];
  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step, totalSteps]);

  const setValue = (key: string, value: number | undefined) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const { [key]: _omit, ...rest } = prev;
      return rest;
    });
  };

  const validateStep = () => {
    const stepErrors: Record<string, string> = {};
    for (const key of currentStep.fields) {
      const field = fieldsByKey[key];
      const val = formData[key];
      if (val === undefined || val === null || (typeof val === "number" && Number.isNaN(val))) {
        stepErrors[key] = "This field is required";
        continue;
      }
      if (field.type === "number") {
        if (field.min !== undefined && val < field.min) stepErrors[key] = `Must be ≥ ${field.min}`;
        else if (field.max !== undefined && val > field.max) stepErrors[key] = `Must be ≤ ${field.max}`;
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < totalSteps - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const res = predictRisk(formData) as RiskResult;
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setFormData({});
    setErrors({});
    setResult(null);
  };

  if (result && result.risk) {
    const c = colorClasses[result.risk.color];
    return (
      <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-medium text-muted-foreground mb-2">Your Estimated Risk</span>
          <AnimatedGauge percentage={result.risk.percentage} color={result.risk.color} />
          <div className={`mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}>
            {result.risk.level} Risk
          </div>
          <h3 className={`text-2xl md:text-3xl font-bold mt-3 ${c.text}`}>{result.risk.level}</h3>
          <p className="text-muted-foreground mt-4 max-w-md leading-relaxed">{result.risk.message}</p>

          <p className="text-xs text-muted-foreground/80 mt-8 max-w-md leading-relaxed">
            This is an AI-based assessment tool and does not replace professional medical advice. Always
            consult a qualified healthcare professional.
          </p>

          <button
            onClick={handleReset}
            className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-6 md:p-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-primary">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">{currentStep.title}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-6">{currentStep.title}</h2>

      <div className="space-y-6">
        {currentStep.fields.map((key: string) => {
          const field = fieldsByKey[key];
          if (!field) return null;
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-foreground mb-2">{field.label}</label>
              {field.type === "select" ? (
                <SegmentedSelect
                  field={field}
                  value={formData[key]}
                  onChange={(v) => setValue(key, v)}
                />
              ) : (
                <NumberInput field={field} value={formData[key]} onChange={(v) => setValue(key, v)} />
              )}
              {errors[key] && <p className="text-sm text-destructive mt-1.5">{errors[key]}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="px-5 py-3 rounded-lg font-medium text-foreground border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {step === totalSteps - 1 ? "Calculate My Risk →" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default RiskAssessment;
