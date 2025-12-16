import { Button, Card } from '@brandplan/ui';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen p-brand-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-brand-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-brand-lg font-bold text-brand-text-primary">
              BrandPlan × Next.js
            </h1>
            <p className="text-brand-sm text-brand-text-secondary">
              End-to-end integration example
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Buttons Section */}
        <section>
          <Card padding="lg" radius="md">
            <div className="flex flex-col gap-brand-4">
              <h2 className="text-brand-md font-bold">Button Variants</h2>

              {/* Solid Buttons */}
              <div className="flex flex-col gap-brand-2">
                <h3 className="text-brand-sm font-medium text-brand-text-secondary">
                  Solid
                </h3>
                <div className="flex flex-wrap gap-brand-2">
                  <Button variant="solid" tone="primary" size="sm">
                    Small Primary
                  </Button>
                  <Button variant="solid" tone="primary" size="md">
                    Medium Primary
                  </Button>
                  <Button variant="solid" tone="primary" size="lg">
                    Large Primary
                  </Button>
                  <Button variant="solid" tone="accent" size="md">
                    Accent
                  </Button>
                </div>
              </div>

              {/* Outline Buttons */}
              <div className="flex flex-col gap-brand-2">
                <h3 className="text-brand-sm font-medium text-brand-text-secondary">
                  Outline
                </h3>
                <div className="flex flex-wrap gap-brand-2">
                  <Button variant="outline" tone="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="outline" tone="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="outline" tone="accent" size="md">
                    Accent
                  </Button>
                </div>
              </div>

              {/* Ghost Buttons */}
              <div className="flex flex-col gap-brand-2">
                <h3 className="text-brand-sm font-medium text-brand-text-secondary">
                  Ghost
                </h3>
                <div className="flex flex-wrap gap-brand-2">
                  <Button variant="ghost" tone="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="ghost" tone="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="ghost" tone="accent" size="md">
                    Accent
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <div className="flex flex-col gap-brand-4">
            <h2 className="text-brand-md font-bold">Card Examples</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-brand-4">
              {/* Default Card */}
              <Card tone="default" padding="md" radius="md">
                <div className="flex flex-col gap-brand-4">
                  <div className="flex flex-col gap-brand-2">
                    <h3 className="text-brand-sm font-bold">Default Card</h3>
                    <p className="text-brand-sm text-brand-text-secondary">
                      Uses surface-1 background with medium padding and radius.
                    </p>
                  </div>
                  <Button variant="solid" tone="primary" size="sm">
                    Action
                  </Button>
                </div>
              </Card>

              {/* Muted Card */}
              <Card tone="muted" padding="md" radius="md">
                <div className="flex flex-col gap-brand-4">
                  <div className="flex flex-col gap-brand-2">
                    <h3 className="text-brand-sm font-bold">Muted Card</h3>
                    <p className="text-brand-sm text-brand-text-secondary">
                      Uses surface-0 background for a subtle look.
                    </p>
                  </div>
                  <Button variant="outline" tone="accent" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="pt-brand-6 border-brand-surface-1" style={{ borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <div className="flex justify-center">
              <p className="text-brand-sm text-brand-text-secondary">
                All styling uses <strong>brand-*</strong> utilities only.
                <br />
                No arbitrary Tailwind values, no visual drift.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
