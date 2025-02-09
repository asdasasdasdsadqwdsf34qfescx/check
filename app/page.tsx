"use client";

import { useEffect, useState } from "react";
import checkIfModelIsOnline from "./request";
import {
  getData,
  updateDbOnlineStatus,
  updateDbOnlineStatusToFalse,
  VideoModel,
} from "./supaAPI/supa-api.service";

export default function Home() {
  const [onlineModels, setOnlineModels] = useState<VideoModel[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // Premium logging system
  const logStatusChange = (modelName: string, isOnline: boolean) => {
    const timestamp = new Date().toLocaleTimeString();
    const status = isOnline ? "🟢 ONLINE" : "🔴 OFFLINE";
    const message = `[${timestamp}] ${modelName} | ${status}`;
    setLogs((prev) => [message, ...prev].slice(0, 50)); // Keep last 50 entries
  };

  const fetchOnlineModels = async () => {
    try {
      const data = await getData();
      const online = data?.filter((model) => model.isOnline) || [];
      setOnlineModels(online);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const currentModels = await getData();
        if (!currentModels) return;

        await Promise.all(
          currentModels.map(async (model) => {
            const wasOnline = model.isOnline;
            const isOnline = await checkIfModelIsOnline(model.name);

            if (wasOnline !== isOnline) {
              logStatusChange(model.name, isOnline);
              if (isOnline) {
                await updateDbOnlineStatus(model.id!);
              } else {
                await updateDbOnlineStatusToFalse(model.id!);
              }
            }
          })
        );

        await fetchOnlineModels();
      } catch (error) {
        console.error("Status check failed:", error);
      }
    };

    // Initial check
    fetchOnlineModels();

    // Setup interval
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <div>
            <h1 className="text-4xl font-bold  from-blue-500 to-green-500 bg-clip-text ">
              Live Model Monitor
            </h1>

            <p className="text-gray-400 mt-2">
              {onlineModels.length} models currently online
            </p>
          </div>
        </div>
      </div>

      {/* Online Models Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {onlineModels.map((model) => (
          <div
            key={model.id}
            className="group relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-1">{model.name}</h3>
                <p className="text-sm text-cyan-400 font-mono">
                  ID: {model.id}
                </p>
              </div>
              <div className="flex items-center text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
                <span className="text-sm">Online</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 animate-gradient-x" />
          </div>
        ))}
      </div>

      {/* Status Console */}
      <div className="max-w-7xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="bg-cyan-400 w-2 h-2 rounded-full mr-2 animate-pulse" />
            Status Changes
          </h2>
        </div>
        <div className="h-48 overflow-y-auto p-4 font-mono text-sm space-y-3">
          {logs.length === 0 ? (
            <div className="text-gray-500">No status changes detected</div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className="flex items-center px-4 py-2 bg-white/5 rounded-lg"
              >
                <span className="text-cyan-400 mr-3">
                  {log.includes("🟢") ? "🟢" : "🔴"}
                </span>
                <span className="flex-1">{log.split("|")[0]}</span>
                <span
                  className={`text-sm ${
                    log.includes("🟢") ? "text-cyan-400" : "text-red-400"
                  }`}
                >
                  {log.split("|")[1]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Watermark */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500/30">
        © Model Monitoring System
      </div>
    </div>
  );
}
