import { SiGithub } from '@icons-pack/react-simple-icons';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            © {new Date().getFullYear()} Ry2X. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-6">
            <a
              href="https://github.com/ry2x/haku-web-wr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <SiGithub className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
