import React, { FC } from 'react';
import './Room.styles.css';
import Sprite from '../../entities/Sprite/Sprite.entity';
import Furniture from '../../entities/Furniture/Furniture.entity';

// interface FurnitureProps {
//   something: string;
// }
// const Room: FC = (props: FurnitureProps) => {

const Room: FC = () => {
  return (
    <div className="room-container">
      <Furniture name="Fridge" />
      <Sprite />
      <Furniture name="Bed" />
    </div>
  );
};

export default Room;
