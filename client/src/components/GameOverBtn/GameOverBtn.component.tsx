import React, { FC } from 'react';
import './GameOverBtn.styles.css';
import { useAppDispatch } from '../../app/hooks';
import {
  setGameOver,
  setIsCurrentGameActive,
} from '../../features/game/gameSlice';
// import { setIsCurrentGameActive } from '../../features/user/userSlice';

const GameOverBtn: FC = () => {
  const dispatch = useAppDispatch();

  const handleClick = (): void => {
    dispatch(setGameOver());
    dispatch(setIsCurrentGameActive());
  };
  return (
    <div>
      <button type="button" onClick={handleClick} className="game_over_button">
        Give up? Go outside...
      </button>
    </div>
  );
};

export default GameOverBtn;
