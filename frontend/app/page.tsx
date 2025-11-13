export default function Home() {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold glow-text animate-pulse">
          HACK THE HUNT
        </h1>
        <div className="text-green-300 text-sm">
          <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
            CYBER CHALLENGE SYSTEM
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="cyber-card">
          <h2 className="text-xl font-bold mb-4 glow-text">MISSION BRIEFING</h2>
          <p className="text-green-300 text-sm leading-relaxed">
            Welcome to HackTheHunt, elite cyber operative. Your mission is to scan QR codes
            scattered throughout the digital battlefield. Each code contains encrypted level
            data that must be processed through our secure scanning protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <a
            href="/dashboard"
            className="cyber-button inline-block text-center hover:scale-105 transition-transform"
          >
            ACCESS TEAM DASHBOARD
          </a>

          <div className="text-xs text-green-500/50">
            <div>SECURE CONNECTION ESTABLISHED</div>
            <div>SYSTEM STATUS: OPERATIONAL</div>
          </div>
        </div>
      </div>
    </div>
  )
}
