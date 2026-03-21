import React from 'react';

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h1 className="text-3xl font-bold">Payments</h1>
      </div>

      {/* Wallet */}
      <div className="p-5 border-b flex justify-between">
        <span className="text-lg">Elder Wallet</span>
        <span className="font-bold">₹0</span>
      </div>

      {/* UPI */}
      <div className="p-5 border-b">UPI Payment</div>
      <div className="p-5 border-b">QR Pay</div>
      <div className="p-5 border-b">Cash</div>
    </div>
  );
}
