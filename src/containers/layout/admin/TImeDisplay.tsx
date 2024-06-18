import { useEffect, useState } from 'react';

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const dateString = time.toLocaleDateString();
  const timeString = time.toLocaleTimeString();

  return (
    <div className='group-datetime'>
      <span className='date'>{dateString}</span>
      <span className='time'>{timeString}</span>
    </div>
  );
};

export default TimeDisplay;