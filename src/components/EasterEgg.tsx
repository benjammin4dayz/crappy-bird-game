import React, { useEffect, useState } from 'react';
import '../App.css';

function getSongData() {
  return fetch('https://corsproxy.io/?https://soundboard.com/track/1026118')
    .then((r) => r.json())
    .then((d) => d[0])
    .then(({ success, data }) => {
      if (success) {
        return data;
      }
    });
}

const EasterEgg: React.FC = () => {
  const [songData, setSongData] = useState<string | null>(null);
  useEffect(() => {
    const audioPlayer = new Audio();
    audioPlayer.volume = 0.5;

    if (!audioPlayer.src && !songData) {
      getSongData().then((b64) => setSongData(b64));
    } else {
      console.log('Using cached song data');
    }

    if (songData) {
      audioPlayer.src = `data:audio/mp3;base64,${songData}`;
      audioPlayer.play();
    }

    return () => {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    };
  }, [songData]);

  return (
    <div
      className="void"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        backgroundColor: 'black',
        animation: 'void-animation 15s infinite linear',
      }}
    >
      <img
        src={process.env.PUBLIC_URL + '/crappy-bird-50px.png'}
        alt="Bird"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          animation: 'spin 3s infinite linear',
        }}
      />
      {Array(25)
        .fill(null)
        .map((_, index) => (
          <span
            key={index}
            style={{
              position: 'absolute',
              color: 'white',
              animation: 'star-animation 5s infinite linear',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          >
            {String.fromCharCode(9733)}
          </span>
        ))}
    </div>
  );
};

export default EasterEgg;
