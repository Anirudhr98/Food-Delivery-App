import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addNewMenuItem, updateRestaurantDetails } from "@/redux/restaurantManagementSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import api from "@/api/axios";

export default function MenuManagementArea() {
  const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;
  const restaurant_details = useSelector((state) => state.restaurant_management.restaurant_details?.[0] || {});
  const dispatch = useDispatch();
  const restaurant_id = restaurant_details._id;

  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    item_name: "",
    item_image_url: "",
    item_description: "",
    item_price: "",
    cuisine_type: "",
    is_veg: false,
  });
  const [editItem, setEditItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (restaurant_details?.restaurant_items) {
      setMenuItems(restaurant_details.restaurant_items);
    }
  }, [restaurant_details]);

  const handleAddItemSubmit = async () => {
    try {
      const response = await api.post(
        `${backend_base_url}/restaurant_owner/add_new_item/${restaurant_id}`,
        newItem
      );
      if (response.status === 201) {
        dispatch(addNewMenuItem(response.data.newItem)); // Dispatch to Redux
        setMenuItems([...menuItems, response.data.newItem]); // Update local state
        setNewItem({
          item_name: "",
          item_image_url: "",
          item_description: "",
          item_price: "",
          cuisine_type: "",
          is_veg: false,
        });
        toast.success("New menu item added!", { autoClose: 1500 });
      } else {
        throw new Error("Failed to add menu item");
      }
    } catch (error) {
      console.error("Error adding new item:", error.response || error);
      toast.error("Error adding new menu item", { autoClose: 1500 });
    }
  };

  const handleUpdateItem = async () => {
    try {
      const response = await api.put(
        `${backend_base_url}/restaurant_owner/update_menu_item/${restaurant_id}/${editItem._id}`,
        editItem
      );

      if (response.status === 200) {
        const updatedMenuItems = menuItems.map((item) =>
          item._id === editItem._id ? { ...item, ...editItem } : item
        );
        setMenuItems(updatedMenuItems);
        dispatch(updateRestaurantDetails(response.data.updatedRestaurant));
        toast.success("Item updated successfully!", { autoClose: 1500 });
        setIsEditDialogOpen(false); // Close the dialog after saving changes
        window.location.reload(); // Reload the page to reflect changes
      } else {
        throw new Error("Failed to update menu item");
      }
    } catch (error) {
      console.error("Error updating menu item:", error.response || error);
      toast.error("Error updating menu item", { autoClose: 1500 });
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await api.delete(
        `${backend_base_url}/restaurant_owner/delete_menu_item/${restaurant_id}/${id}`
      );

      if (response.status === 200) {
        setMenuItems(menuItems.filter((item) => item._id !== id));
        dispatch(updateRestaurantDetails(response.data.updatedRestaurant));
        toast.success("Item deleted successfully!", { autoClose: 1500 });
      } else {
        throw new Error("Failed to delete menu item");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error.response || error);
      toast.error("Error deleting menu item", { autoClose: 1500 });
    }
  };

  return (
    <Card>
      <div className="mt-4 ml-4">
        <div className="text-2xl font-semibold">Menu Details</div>
        {/* Add New Item Dialog */}
        <Dialog>
          <DialogTrigger>
            <Button className="my-2">Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>Fill in the details to add a new menu item.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItemSubmit();
              }}
              className="space-y-4"
            >
              <Input
                type="text"
                placeholder="Item Name"
                value={newItem.item_name}
                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                required
              />
              <Input
                type="url"
                placeholder="Image URL"
                value={newItem.item_image_url}
                onChange={(e) => setNewItem({ ...newItem, item_image_url: e.target.value })}
                required
              />
              <Input
                type="text"
                placeholder="Description"
                value={newItem.item_description}
                onChange={(e) => setNewItem({ ...newItem, item_description: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Price (₹)"
                value={newItem.item_price}
                onChange={(e) => setNewItem({ ...newItem, item_price: e.target.value })}
                required
              />
              <Input
                type="text"
                placeholder="Cuisine Type"
                value={newItem.cuisine_type}
                onChange={(e) => setNewItem({ ...newItem, cuisine_type: e.target.value })}
                required
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newItem.is_veg}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, is_veg: checked })}
                />
                <label className="text-sm">Is Vegetarian?</label>
              </div>
              <Button type="submit">Add Item</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Menu Items Table */}
        <CardContent>
          {menuItems.length === 0 ? (
            <div className="mt-4 text-gray-500 text-center">No items present, please add a new item.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full mt-4 border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Price (₹)</th>
                    <th className="px-4 py-2 text-left">Cuisine</th>
                    <th className="px-4 py-2 text-left">Veg/Non-Veg</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-all">
                      <td className="border px-4 py-2">
                        <img
                          src={item.item_image_url}
                          alt={item.item_name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="border px-4 py-2">{item.item_name}</td>
                      <td className="border px-4 py-2">{item.item_description}</td>
                      <td className="border px-4 py-2">{item.item_price}</td>
                      <td className="border px-4 py-2">{item.cuisine_type}</td>
                      <td className="border px-4 py-2">{item.is_veg ? "Veg" : "Non-Veg"}</td>
                      <td className="border px-4 py-2 flex space-x-2">
                        {/* Edit Item */}
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditItem({ ...item });
                                setIsEditDialogOpen(true);
                              }}
                              className="flex items-center space-x-1"
                            >
                              <FiEdit />
                              <span>Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Menu Item</DialogTitle>
                              <DialogDescription>
                                Update the details for this menu item.
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateItem();
                              }}
                              className="space-y-4"
                            >
                              <Input
                                type="text"
                                placeholder="Item Name"
                                value={editItem?.item_name || ""}
                                onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
                                required
                              />
                              <Input
                                type="url"
                                placeholder="Image URL"
                                value={editItem?.item_image_url || ""}
                                onChange={(e) => setEditItem({ ...editItem, item_image_url: e.target.value })}
                                required
                              />
                              <Input
                                type="text"
                                placeholder="Description"
                                value={editItem?.item_description || ""}
                                onChange={(e) =>
                                  setEditItem({ ...editItem, item_description: e.target.value })
                                }
                                required
                              />
                              <Input
                                type="number"
                                placeholder="Price (₹)"
                                value={editItem?.item_price || ""}
                                onChange={(e) => setEditItem({ ...editItem, item_price: e.target.value })}
                                required
                              />
                              <Input
                                type="text"
                                placeholder="Cuisine Type"
                                value={editItem?.cuisine_type || ""}
                                onChange={(e) =>
                                  setEditItem({ ...editItem, cuisine_type: e.target.value })
                                }
                                required
                              />
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={editItem?.is_veg || false}
                                  onCheckedChange={(checked) =>
                                    setEditItem({ ...editItem, is_veg: checked })
                                  }
                                />
                                <label className="text-sm">Is Vegetarian?</label>
                              </div>
                              <Button type="submit">Save Changes</Button>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Item */}
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteItem(item._id)}
                          className="flex items-center space-x-1"
                        >
                          <FiTrash />
                          <span>Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
