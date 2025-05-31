import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-green-100 to-green-300">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Transform Your Life with Positive Habits
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-8">
          Discover how small daily actions can dramatically improve your mental, physical, and emotional well-being.
        </p>
        <Image
          src="/habit-illustration.jpg" 
          alt="Positive habits illustration"
          width={600}
          height={450}
        />
        <div className="mt-8 flex gap-4">
          <a
            href="/login"
            className="px-6 py-3 rounded-full bg-white text-green-700 font-semibold hover:bg-gray-100 transition"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="px-6 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition"
          >
            Sign up
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-8">Why Build Positive Habits?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 rounded-lg shadow-md bg-green-50">
            <Image src="/energy.svg" alt="Energy icon" width={48} height={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Boosted Energy</h3>
            <p>Healthy routines help you stay active and energized throughout the day.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-green-50">
            <Image src="/mind.svg" alt="Mind icon" width={48} height={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mental Clarity</h3>
            <p>Positive habits reduce stress and sharpen your focus.</p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-green-50">
            <Image src="/growth.svg" alt="Growth icon" width={48} height={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personal Growth</h3>
            <p>They foster continuous learning and self-development.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600 text-white text-center py-16 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Start Building a Better You Today</h2>
        {/*no bottons*/}
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-green-100">
        © 2025 Positive Habits. All rights reserved.
      </footer>
    </div>
  );
}
