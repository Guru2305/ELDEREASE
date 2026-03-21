import React, { useState } from "react";

interface ServiceItem {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface ServiceListProps {
  title: string;
  items: ServiceItem[];
}

export default function ServiceList({ title, items }: ServiceListProps) {
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        {title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white p-6 rounded-3xl shadow-lg cursor-pointer hover:scale-105 transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-xl text-gray-600">{item.price}</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full relative">

            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-red-500 text-2xl"
            >
              ✖
            </button>

            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-72 object-cover rounded-2xl mb-6"
            />

            <h2 className="text-3xl font-bold mb-2">
              {selectedItem.name}
            </h2>

            <p className="text-2xl text-gray-600">
              {selectedItem.price}
            </p>

            <button className="w-full mt-6 py-4 bg-emerald-600 text-white text-xl rounded-2xl font-bold">
              Confirm
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
