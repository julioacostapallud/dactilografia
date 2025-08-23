export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-700 via-green-600 to-orange-600 text-white py-4">
      <div className="flex justify-between items-center px-6">
        <div className="text-sm text-white">
          © {new Date().getFullYear()} Julio Acosta - julioacostapallud@gmail.com
        </div>
        <div className="flex items-center gap-4 text-sm text-white">
          <span>Donaciones:</span>
          <button 
            onClick={() => window.open('https://buymeacoffee.com/julioacosta', '_blank')}
            className="hover:scale-110 transition-transform cursor-pointer bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg text-white font-medium"
          >
            ☕ Invítame un café
          </button>
        </div>
      </div>
    </footer>
  );
}
