import { Link } from 'react-router-dom';

const Footer = () => {
  const navigationItems = [
    {
      title: "Partner With Us",
      items: [
        { title: "Register Your Restaurant", to: '/register_restaurant' },
        { title: "Owners Area", to: '/login' },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", to: '/about-us' },
        { title: "Fundraising", to: '/fundraising' },
        { title: "Investors", to: '/investors' },
        { title: "Contact Us", to: '/contact-us' },
      ],
    },
  ];

  return (
    <footer className="w-full mt-10 py-20 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left section */}
          <div className="flex flex-col gap-8 items-start">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl tracking-tighter font-regular text-left">
                AR7 Food Delivery
              </h2>
              <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                © AR7 Pvt. Ltd
              </p>
            </div>

            <address className="flex gap-20 not-italic">
              <div className="flex flex-col text-sm leading-relaxed tracking-tight text-background/75 text-left">
                <p>1 Tailwind Way</p>
                <p>Menlo Park, CA 94025</p>
              </div>
              <div className="flex flex-col text-sm leading-relaxed tracking-tight text-background/75 text-left">
                <Link to="/terms-of-service" className="hover:underline">
                  Terms of Service
                </Link>
                <Link to="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </address>
          </div>

          {/* Right section - navigation */}
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {navigationItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 items-start">
                <p className="text-xl">{item.title}</p>
                {item.items &&
                  item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      to={subItem.to}
                      className="text-background/75 hover:text-background hover:underline"
                    >
                      {subItem.title}
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
