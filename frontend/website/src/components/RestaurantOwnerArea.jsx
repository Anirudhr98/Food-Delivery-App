import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function RestaurantOwnerArea() {
  const restaurant_details = useSelector(
    (state) => state.restaurant_management.restaurant_details
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Side navigation for desktop */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="flex items-center gap-2 font-semibold">
              <span className="">Management Area</span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                Your Profile
              </Link>
              <div className="mt-2 text-muted-foreground px-3">
                Manage your Restaurants
              </div>
              {restaurant_details.length > 0 ? (
                restaurant_details.map((restaurant) => (
                  <Link
                    key={restaurant._id}
                    to={`/restaurant_management_area/${restaurant._id}`}
                    className="mt-2 text-muted-foreground px-6 transition-all hover:text-primary"
                  >
                    <span className="mr-2 text-2xl leading-none transition-colors duration-200 ease-in-out hover:text-primary">
                      &#8226;
                    </span>
                    {restaurant.restaurant_name}
                  </Link>
                ))
              ) : (
                <div className="mt-6 text-muted-foreground px-3">
                  Create a new restaurant
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile header with sheet */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-lg font-medium">
                  Management Dashboard
                </span>
              </div>
              <nav className="grid gap-2 text-lg font-medium mt-4">
                <Link
                  to="profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  Your Profile
                </Link>
                <div className="mt-2 text-muted-foreground px-3">
                  Manage your Restaurants
                </div>
                {restaurant_details.length > 0 ? (
                  restaurant_details.map((restaurant) => (
                    <Link
                      key={restaurant._id}
                      to={`/restaurant_management_area/${restaurant._id}`}
                      className="mt-2 text-muted-foreground px-6 transition-all hover:text-primary"
                    >
                      <span className="mr-2 text-2xl leading-none transition-colors duration-200 ease-in-out hover:text-primary">
                        &#8226;
                      </span>
                      {restaurant.restaurant_name}
                    </Link>
                  ))
                ) : (
                  <div className="mt-6 text-muted-foreground px-3">
                    Create a new restaurant
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
