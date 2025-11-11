import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0E27',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1f3a 0%, #0A0E27 100%)',
        }}
      >
        {/* Thunder Icon */}
        <div style={{ 
          fontSize: 120, 
          marginBottom: 40,
          filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))'
        }}>
          ⚡
        </div>
        
        {/* Title */}
        <div style={{ 
          fontSize: 80, 
          fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',  // ✅ Dodaj to dla Safari
          color: 'transparent',
          marginBottom: 20,
        }}>
          Thunder Casino
        </div>
        
        {/* Subtitle */}
        <div style={{ 
          fontSize: 32, 
          color: '#CBD5E0', 
          textAlign: 'center',
          maxWidth: 900,
          lineHeight: 1.4,
        }}>
          God of Thunder Games
        </div>
        
        {/* Description */}
        <div style={{ 
          fontSize: 24, 
          color: '#9CA3AF', 
          marginTop: 30,
          textAlign: 'center',
        }}>
          Play • Compete • Win
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,  // ✅ ZMIENIONE z 630 na 800
    }
  );
}
