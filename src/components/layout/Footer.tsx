export default function Footer() {
  return (
    <footer className="bg-[#172337] text-gray-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <h4 className="text-gray-200 font-semibold mb-2 uppercase text-[11px]">About</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold mb-2 uppercase text-[11px]">Help</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Payments</a></li>
            <li><a href="#" className="hover:text-white">Shipping</a></li>
            <li><a href="#" className="hover:text-white">Cancellation</a></li>
            <li><a href="#" className="hover:text-white">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold mb-2 uppercase text-[11px]">Policy</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Return Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Use</a></li>
            <li><a href="#" className="hover:text-white">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold mb-2 uppercase text-[11px]">Mail Us</h4>
          <p className="leading-5">
            EcomBuzz Internet Pvt. Ltd.<br />
            Buildings, Bengaluru,<br />
            Karnataka, India 560001
          </p>
        </div>
      </div>
      <div className="border-t border-gray-700 py-3 text-center">
        © {new Date().getFullYear()} EcomBuzz.com
      </div>
    </footer>
  )
}
