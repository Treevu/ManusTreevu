
import React from 'react';
export const CameraView = ({ onCapture, onClose }: any) => (
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
    <div className="text-white text-center">
      <p>Camera Simulator</p>
      <button onClick={() => onCapture('base64')} className="mt-4 bg-emerald-500 px-4 py-2 rounded">Capture</button>
      <button onClick={onClose} className="mt-4 ml-2 bg-gray-500 px-4 py-2 rounded">Close</button>
    </div>
  </div>
);
