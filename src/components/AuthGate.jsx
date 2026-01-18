import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";

export default function AuthGate() {
  const { isInitialized, vin } = useStore(vehicleStore);

  // 1. Loading State (Not initialized yet)
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-[9999]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/logo.png"
              className="w-8 h-8 object-contain opacity-50"
              alt="Logo"
            />
          </div>
        </div>
        <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State (Initialized but no VIN)
  if (!vin) {
    // Keep covering screen while waiting for redirect or user action
    // Ideally, the store/api triggers a redirect to /login
    return <div className="fixed inset-0 bg-gray-50 z-[9999]"></div>;
  }

  // 3. Authenticated: Render nothing (unblock the view)
  return null;
}
