import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addNewMenuItem } from "@/redux/restaurantManagementSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Assuming an Input component
import { Checkbox } from "@/components/ui/checkbox"; // Assuming a Checkbox component

export default function MenuManagementArea() {
  const dispatch = useDispatch();
  const [menuItems, setMenuItems] = useState([
    {
      id: "1",
      item_name: "Chicken Manchurian",
      item_image_url:
        "https://media.istockphoto.com/id/1272381807/photo/chicken-manchurian.jpg",
      item_description: "Tangy and spicy chicken in a soy-based sauce.",
      item_price: 260,
      cuisine_type: "Chinese",
      is_veg: false,
    },
    {
      id: "2",
      item_name: "Paneer Tikka",
      item_image_url:
        "https://media.istockphoto.com/id/1189024217/photo/paneer-tikka.jpg",
      item_description: "Chargrilled paneer cubes marinated with spices.",
      item_price: 300,
      cuisine_type: "Indian",
      is_veg: true,
    },
  ]);

  const [newItem, setNewItem] = useState({
    item_name: "",
    item_image_url: "",
    item_description: "",
    item_price: "",
    cuisine_type: "",
    is_veg: false,
  });

  const handleAddItemSubmit = () => {
    const itemWithId = { ...newItem, id: `${Date.now()}` };
    dispatch(addNewMenuItem(itemWithId)); // Dispatch to Redux
    setMenuItems([...menuItems, itemWithId]); // Update local state
    setNewItem({
      item_name: "",
      item_image_url: "",
      item_description: "",
      item_price: "",
      cuisine_type: "",
      is_veg: false,
    });
  };

  const handleUpdateItem = (id) => {
    console.log("Update item with ID:", id);
    // Implement Update Item functionality here
  };

  const handleDeleteItem = (id) => {
    console.log("Delete item with ID:", id);
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <Card>
      <div className="mt-4 ml-4">
        <div className="text-2xl font-semibold">Menu Details</div>
        <Dialog>
          <DialogTrigger>
            <Button className="my-2">Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new menu item.
              </DialogDescription>
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
                onChange={(e) =>
                  setNewItem({ ...newItem, item_name: e.target.value })
                }
                required
              />
              <Input
                type="url"
                placeholder="Image URL"
                value={newItem.item_image_url}
                onChange={(e) =>
                  setNewItem({ ...newItem, item_image_url: e.target.value })
                }
                required
              />
              <Input
                type="text"
                placeholder="Description"
                value={newItem.item_description}
                onChange={(e) =>
                  setNewItem({ ...newItem, item_description: e.target.value })
                }
                required
              />
              <Input
                type="number"
                placeholder="Price (₹)"
                value={newItem.item_price}
                onChange={(e) =>
                  setNewItem({ ...newItem, item_price: e.target.value })
                }
                required
              />
              <Input
                type="text"
                placeholder="Cuisine Type"
                value={newItem.cuisine_type}
                onChange={(e) =>
                  setNewItem({ ...newItem, cuisine_type: e.target.value })
                }
                required
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newItem.is_veg}
                  onCheckedChange={(checked) =>
                    setNewItem({ ...newItem, is_veg: checked })
                  }
                />
                <label className="text-sm">Is Vegetarian?</label>
              </div>
              <Button type="submit">Add Item</Button>
            </form>
          </DialogContent>
        </Dialog>
        <CardContent>
          {menuItems.length === 0 ? (
            <div className="mt-4 text-gray-500 text-center">
              No items present, please add a new item.
            </div>
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
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="border px-4 py-2">
                        <img
                          src={item.item_image_url}
                          alt={item.item_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">{item.item_name}</td>
                      <td className="border px-4 py-2">
                        {item.item_description}
                      </td>
                      <td className="border px-4 py-2">₹{item.item_price}</td>
                      <td className="border px-4 py-2">{item.cuisine_type}</td>
                      <td className="border px-4 py-2">
                        {item.is_veg ? "Veg" : "Non-Veg"}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateItem(item.id)}
                          >
                            <FiEdit className="mr-1" />
                            Update
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <FiTrash className="mr-1" />
                            Delete
                          </Button>
                        </div>
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
