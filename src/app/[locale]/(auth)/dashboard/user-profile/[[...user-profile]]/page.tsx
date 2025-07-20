import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type IUserProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IUserProfilePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function UserProfilePage(props: IUserProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Profile Management Placeholder
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This is a mock user profile page. Implement your preferred authentication solution to enable real user profile management.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  disabled
                  value="John Doe (Mock)"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="email-profile" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email-profile"
                  type="email"
                  disabled
                  value="john.doe@example.com (Mock)"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button
                  type="button"
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm cursor-not-allowed"
                >
                  Enable (Mock)
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-500">Update your password regularly</p>
                </div>
                <button
                  type="button"
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm cursor-not-allowed"
                >
                  Change (Mock)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
