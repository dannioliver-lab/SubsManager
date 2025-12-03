import React, { useState } from 'react';
import { CreditCard, Calendar, Trash2, Plus, DollarSign, X } from 'lucide-react';

// Initial mock data
const initialSubscriptions = [
  {
    id: 1,
    name: 'Netflix',
    cost: 15.99,
    billingCycle: 'Monthly',
    nextPayment: '2024-01-15',
    paymentMethod: 'Visa ending in 1234',
  },
  {
    id: 2,
    name: 'Spotify',
    cost: 9.99,
    billingCycle: 'Monthly',
    nextPayment: '2024-01-10',
    paymentMethod: 'PayPal',
  },
  {
    id: 3,
    name: 'HBO Max',
    cost: 14.99,
    billingCycle: 'Monthly',
    nextPayment: '2024-01-20',
    paymentMethod: 'Mastercard ending in 5678',
  },
  {
    id: 4,
    name: 'Adobe Creative Cloud',
    cost: 54.99,
    billingCycle: 'Monthly',
    nextPayment: '2024-01-05',
    paymentMethod: 'Visa ending in 9012',
  },
];

function App() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    billingCycle: 'Monthly',
    nextPayment: '',
    paymentMethod: '',
  });

  // Calculate total monthly cost
  const totalMonthlyCost = subscriptions.reduce((total, sub) => {
    const monthlyCost = sub.billingCycle === 'Yearly' ? sub.cost / 12 : sub.cost;
    return total + monthlyCost;
  }, 0);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new subscription
  const handleAddSubscription = (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!formData.name || !formData.cost || !formData.nextPayment || !formData.paymentMethod) {
      alert('Please fill in all fields');
      return;
    }

    const newSubscription = {
      id: Date.now(),
      name: formData.name,
      cost: parseFloat(formData.cost),
      billingCycle: formData.billingCycle,
      nextPayment: formData.nextPayment,
      paymentMethod: formData.paymentMethod,
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setFormData({
      name: '',
      cost: '',
      billingCycle: 'Monthly',
      nextPayment: '',
      paymentMethod: '',
    });
    setShowAddForm(false);
  };

  // Delete subscription
  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Subscription Tracker</h1>
          <p className="text-gray-400">Manage your recurring subscriptions</p>
        </div>

        {/* Total Monthly Cost Card */}
        <div className="bg-zinc-800 rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Monthly Cost</p>
              <h2 className="text-5xl font-bold text-pink-500">
                {formatCurrency(totalMonthlyCost)}
              </h2>
            </div>
            <div className="bg-pink-500/10 p-4 rounded-xl">
              <DollarSign className="w-12 h-12 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Add New Subscription Button */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-2xl font-semibold">Your Subscriptions</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Subscription
          </button>
        </div>

        {/* Add Subscription Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Add New Subscription</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddSubscription} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="e.g., Netflix"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full bg-zinc-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Next Payment Date
                  </label>
                  <input
                    type="date"
                    name="nextPayment"
                    value={formData.nextPayment}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="e.g., Visa ending in 1234"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-zinc-800 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold mb-1">{subscription.name}</h4>
                  <p className="text-pink-500 text-2xl font-bold">
                    {formatCurrency(subscription.cost)}
                    <span className="text-gray-400 text-sm font-normal ml-2">
                      / {subscription.billingCycle}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteSubscription(subscription.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-xs text-gray-400">Next Payment</p>
                    <p className="text-sm">{formatDate(subscription.nextPayment)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <CreditCard className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-xs text-gray-400">Payment Method</p>
                    <p className="text-sm">{subscription.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-zinc-800 rounded-xl p-12 border border-gray-800 inline-block">
              <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No subscriptions yet
              </h3>
              <p className="text-gray-500">
                Add your first subscription to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
