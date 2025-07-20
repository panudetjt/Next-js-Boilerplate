import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type ISignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignUpPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignUpPage(props: ISignUpPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign Up
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Authentication placeholder - implement your preferred auth solution
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              disabled
              className="w-full rounded-md bg-gray-400 px-4 py-2 text-white font-medium cursor-not-allowed"
            >
              Sign Up (Mock)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
