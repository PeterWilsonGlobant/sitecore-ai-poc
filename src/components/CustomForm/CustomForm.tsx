import React, { useMemo, useState } from 'react';

interface UserInformationFormProps {
  rendering?: {
    uid?: string;
    params?: Record<string, string>;
    dataSource?: string;
  };
}

type FormValues = {
  name: string;
  accountNumber: string;
  companyName: string;
  emirate: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const defaultVariantName = 'Variant';

export const UserInformationForm = (props: UserInformationFormProps) => {
  const { rendering } = props ?? {};
  const params = rendering?.params ?? {};
  const variantName = params.Variant || defaultVariantName;

  const companyOptions = useMemo(
    () => [
      'Select company',
      'Acme Holdings',
      'Blue Dunes Trading',
      'Crescent Logistics',
      'Desert Star Industries',
      'Emirates Horizon Group',
    ],
    []
  );

  const emirateOptions = useMemo(
    () => [
      'Select emirate',
      'Abu Dhabi',
      'Dubai',
      'Sharjah',
      'Ajman',
      'Umm Al Quwain',
      'Ras Al Khaimah',
      'Fujairah',
    ],
    []
  );

  const [values, setValues] = useState<FormValues>({
    name: '',
    accountNumber: '',
    companyName: '',
    emirate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (nextValues: FormValues) => {
    const nextErrors: FormErrors = {};

    if (!nextValues.name.trim()) {
      nextErrors.name = 'Name is required.';
    } else if (!/^[A-Za-z ]+$/.test(nextValues.name.trim())) {
      nextErrors.name = 'Name must contain alphabetic characters only.';
    }

    if (!nextValues.accountNumber.trim()) {
      nextErrors.accountNumber = 'Account Number is required.';
    } else if (!/^[A-Za-z0-9]+$/.test(nextValues.accountNumber.trim())) {
      nextErrors.accountNumber = 'Account Number must be alphanumeric only.';
    }

    if (!nextValues.companyName) {
      nextErrors.companyName = 'Please select a Company Name.';
    }

    if (!nextValues.emirate) {
      nextErrors.emirate = 'Please select an Emirate.';
    }

    return nextErrors;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const nextValues = {
      ...values,
      [name]: value,
    } as FormValues;

    setValues(nextValues);

    if (isSubmitted) {
      setErrors(validate(nextValues));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted:', values);
    setIsSubmitted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      try {
        await fetch('/api/user-information', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
      } catch (error) {
        console.error('Failed to submit form:', error);
      }

      setValues({
        name: '',
        accountNumber: '',
        companyName: '',
        emirate: '',
      });
      setIsSubmitted(false);
    }
  };

  // Material-style outlined fields: floating label that sits on the border
  const fieldBorderClasses = (hasError: boolean) =>
    hasError
      ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
      : 'border-slate-400 hover:border-slate-900 focus:border-indigo-600 focus:ring-indigo-600';
  const fieldBaseClasses =
    'peer block w-full rounded-md border bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-100';
  const floatingLabelBase =
    'pointer-events-none absolute left-3 z-10 origin-left bg-white px-1 transition-all';
  const labelColor = (hasError: boolean) =>
    hasError ? 'text-red-600' : 'text-slate-600 peer-focus:text-indigo-600';
  // Text inputs: label rests inside the field until focused or filled
  const inputLabelClasses = (hasError: boolean) =>
    `${floatingLabelBase} top-0 -translate-y-1/2 text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs ${labelColor(hasError)}`;
  // Selects always show a value, so the label stays floated
  const selectLabelClasses = (hasError: boolean) =>
    `${floatingLabelBase} top-0 -translate-y-1/2 text-xs ${labelColor(hasError)}`;
  const helperClasses = 'mt-1 px-4 text-xs text-slate-500';
  const errorClasses = 'mt-1 px-4 text-xs font-medium text-red-600';

  const nameInputClasses = `${fieldBaseClasses} ${fieldBorderClasses(!!errors.name)}`;
  const accountInputClasses = `${fieldBaseClasses} ${fieldBorderClasses(!!errors.accountNumber)}`;
  const companySelectClasses = `${fieldBaseClasses} appearance-none pr-10 ${fieldBorderClasses(!!errors.companyName)}`;
  const emirateSelectClasses = `${fieldBaseClasses} appearance-none pr-10 ${fieldBorderClasses(!!errors.emirate)}`;

  const chevron = (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600"
    >
      <path d="M5.25 7.5 10 12.25 14.75 7.5z" />
    </svg>
  );

  const renderHint = (id: string, help: string, error?: string) =>
    error ? (
      <p id={`${id}-error`} role="alert" className={errorClasses}>
        {error}
      </p>
    ) : (
      <p id={`${id}-help`} className={helperClasses}>
        {help}
      </p>
    );

  const companyOptionElements = companyOptions.map((option, index) => {
    const optionValue = index === 0 ? '' : option;
    return (
      <option key={`company-${option}`} value={optionValue}>
        {option}
      </option>
    );
  });

  const emirateOptionElements = emirateOptions.map((option, index) => {
    const optionValue = index === 0 ? '' : option;
    return (
      <option key={`emirate-${option}`} value={optionValue}>
        {option}
      </option>
    );
  });

  return (
    <section
      id={rendering?.uid}
      data-variant={variantName}
      data-rendering-id={rendering?.uid}
      data-datasource={rendering?.dataSource}
      className="w-full bg-slate-50 py-8 sm:py-10 lg:py-12"
      aria-labelledby="user-information-form-heading"
    >
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <h2
              id="user-information-form-heading"
              className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
            >
              User Information Form
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Provide your details below. The form includes built-in validation for alphabetic and alphanumeric input and is designed to work smoothly across mobile, tablet, and desktop screens.
            </p>
          </header>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="px-6 py-6 sm:px-8 sm:py-8"
            aria-describedby="user-information-form-description"
          >
            <p id="user-information-form-description" className="sr-only">
              Complete all required fields before submitting the form.
            </p>

            <section className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <div>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    inputMode="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    className={nameInputClasses}
                    placeholder=" "
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : 'name-help'}
                    required
                    pattern="[A-Za-z ]+"
                  />
                  <label htmlFor="name" className={inputLabelClasses(!!errors.name)}>
                    Name
                  </label>
                </div>
                {renderHint('name', 'Alphabetic characters and spaces only.', errors.name)}
              </div>

              <div>
                <div className="relative">
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    value={values.accountNumber}
                    onChange={handleChange}
                    className={accountInputClasses}
                    placeholder=" "
                    aria-invalid={errors.accountNumber ? 'true' : 'false'}
                    aria-describedby={errors.accountNumber ? 'accountNumber-error' : 'accountNumber-help'}
                    required
                    pattern="[A-Za-z0-9]+"
                  />
                  <label htmlFor="accountNumber" className={inputLabelClasses(!!errors.accountNumber)}>
                    Account Number
                  </label>
                </div>
                {renderHint(
                  'accountNumber',
                  'Letters and numbers only, with no spaces or symbols.',
                  errors.accountNumber
                )}
              </div>

              <div>
                <div className="relative">
                  <select
                    id="companyName"
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                    className={companySelectClasses}
                    aria-invalid={errors.companyName ? 'true' : 'false'}
                    aria-describedby={errors.companyName ? 'companyName-error' : 'companyName-help'}
                    required
                  >
                    {companyOptionElements}
                  </select>
                  {chevron}
                  <label htmlFor="companyName" className={selectLabelClasses(!!errors.companyName)}>
                    Company Name
                  </label>
                </div>
                {renderHint(
                  'companyName',
                  'Choose the company associated with your account.',
                  errors.companyName
                )}
              </div>

              <div>
                <div className="relative">
                  <select
                    id="emirate"
                    name="emirate"
                    value={values.emirate}
                    onChange={handleChange}
                    className={emirateSelectClasses}
                    aria-invalid={errors.emirate ? 'true' : 'false'}
                    aria-describedby={errors.emirate ? 'emirate-error' : 'emirate-help'}
                    required
                  >
                    {emirateOptionElements}
                  </select>
                  {chevron}
                  <label htmlFor="emirate" className={selectLabelClasses(!!errors.emirate)}>
                    Emirate
                  </label>
                </div>
                {renderHint(
                  'emirate',
                  'Select the emirate relevant to your company or account.',
                  errors.emirate
                )}
              </div>
            </section>

            <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">All fields are required.</p>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 active:bg-indigo-800"
                aria-label="Submit user information form"
              >
                Submit
              </button>
            </footer>
          </form>
        </article>
      </main>
    </section>
  );
};
   export const Default = UserInformationForm;