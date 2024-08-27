import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" border-t border-gray-700 mt-auto">
      <div className="container mx-auto">
        <div className="p-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center">
            <h3 className="text-xl font-grand-hotel text-yellow-300">
              PostWave
            </h3>
            <p className="text-sm font-extralight">Where words create waves</p>
            <div className="flex space-x-4 mt-2 justify-center">
              <Link href="#" className="hover:text-yellow-300">
              <i className="fa-brands fa-instagram"></i>
              </Link>
              <Link href="#" className="hover:text-yellow-300">
                <i className="fab fa-facebook"></i>
              </Link>
              <Link href="#" className="hover:text-yellow-300">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link to="https://github.com/Dev-AshishKumar" className="hover:text-yellow-300">
                <i className="fab fa-github"></i>
              </Link>
            </div>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul>
                <li>
                  <Link href="#" className="hover:text-yellow-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to={"/"} className="hover:text-yellow-300">
                    Posts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-yellow-300">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul>
                <li>
                  <Link href="#" className="hover:text-yellow-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-yellow-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-yellow-300">
                    Follow Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pb-4">
          <div className="mx-4 flex justify-between pt-4 items-center  text-sm text-center">
            <p>&copy; 2024 PostWave. All rights reserved.</p>
            <div>
              <Link href="#" className="hover:text-yellow-300">
                Terms of service
              </Link>
              <span className="mx-2 ">|</span>
              <Link href="#" className="hover:text-yellow-300">
                Privacy Policy
              </Link>
              <span className="mx-2 ">|</span>
              <Link href="#" className="hover:text-yellow-300">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
