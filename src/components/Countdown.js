import { useEffect, useState } from 'react';

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count > 1) setCount(count - 1);
      else onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return <div className="countdown"><p>Chuẩn bị!</p><strong>{count}</strong></div>;
};

export default Countdown;
