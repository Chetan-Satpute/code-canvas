interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: 'Shape the structure',
    description:
      'Randomize an array, insert your own values, remove one. The run happens on data you chose, not on a fixed example.',
  },
  {
    title: 'Step through the code',
    description:
      'Press Run, then take one step at a time. The current line is highlighted while the call stack and its variables update beside it.',
  },
  {
    title: 'Watch the structure move',
    description:
      'Elements shift, nodes appear, links are redrawn. The canvas animates the change rather than cutting to the result.',
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20 lg:px-10 lg:py-24">
        <h2 className="font-en-display text-foreground max-w-2xl text-2xl font-semibold sm:text-3xl lg:text-4xl">
          Three moves, and the algorithm explains itself
        </h2>

        <ol className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-border bg-card rounded-xl border p-5 sm:p-6"
            >
              <span className="font-code text-accent text-sm">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="font-en-display text-card-foreground mt-3 text-lg font-semibold">
                {step.title}
              </h3>

              <p className="font-en text-muted-foreground mt-2 text-sm leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorksSection;
