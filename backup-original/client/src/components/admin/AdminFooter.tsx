
import { APP_VERSION, RELEASE_LINK } from '@/constants/version';

const AdminFooter = () => {
  return (
    <footer className="w-full py-6 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6">
          <span>Ko Lake Villa Admin Console <strong className="text-[#8B5E3C]">{APP_VERSION}</strong></span>
          <span className="hidden md:inline">•</span>
          <a
            href={RELEASE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF914D] hover:underline transition-colors"
          >
            📋 View Release Notes
          </a>
          <span className="hidden md:inline">•</span>
          <span className="text-xs opacity-75">
            &copy; {new Date().getFullYear()} Ko Lake House
          </span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
