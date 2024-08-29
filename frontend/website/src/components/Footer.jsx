const Footer = () => {

  const navigationItems = [
    {
      title: "Partner With Us",
      items: [
      {title: "Register Your Restaurant",href:'/register_restaurant'},
      {title: "Owners Area",href:'/restaurt_owner_login'},
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us"},
        { title: "Fundraising"},
        { title: "Investors"},
        { title: "Contact Us"},
      ],
    },
  ];

  return (
    <footer className="w-full mt-10 py-20 bg-foreground text-background sticky bottom">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
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
                <p className="hover:underline">
                  Terms of Service
                </p>
                <p className="hover:underline">
                  Privacy Policy
                </p>
              </div>
            </address>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {navigationItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 items-start">
                {item.href ? (
                  <a href={item.href} className="text-xl hover:underline">
                    {item.title}
                  </a>
                ) : (
                  <p className="text-xl">{item.title}</p>
                )}
                {item.items &&
                  item.items.map((subItem) => (
                    <a
                      key={subItem.title}
                      href={subItem.href}
                      className="text-background/75 hover:text-background hover:underline"
                    >
                      {subItem.title}
                    </a>
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
