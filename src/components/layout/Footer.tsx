export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-sm">
            © {new Date().getFullYear()} Wild Rift Stats. All rights reserved.
          </div>

          {/* Links */}
          <div className="mt-4 md:mt-0 space-x-6">
            <a
              href="https://wildrift.leagueoflegends.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Wild Rift Official
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
