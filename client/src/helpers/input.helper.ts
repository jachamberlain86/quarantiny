import { Howl } from 'howler';
import { store } from '../app/store';
import {
  selectLeftFired,
  selectRightFired,
  selectUpFired,
  selectDownFired,
  toggleLeftFired,
  toggleRightFired,
  toggleUpFired,
  toggleDownFired,
  setMoveIntId,
  selectMoveIntId,
  setMoveDir,
  selectMoveDir,
  selectCurPos,
  changeMovePos,
  updateLastInput,
} from '../features/character/characterSlice';
import {
  changeInteraction,
  selectCurrentInteraction,
  updateObjectsNearBy,
} from '../features/sprite/spriteSlice';
import { handleInteraction } from './sprite.helper';
import {
  cuteWalkOne,
  shuffleWalkOne,
  shuffleWalkShort,
  collisionOne,
  collisionTwo,
  howlCollisionsObj,
  collisionArray,
} from '../audioControllers/playerSounds';
import { playObjectSound } from '../audioControllers/houseObjectsSounds';
import game from '../data/gameMap.data';

function calcNewPos(key: string): { x: number; y: number } {
  const curPos = selectCurPos(store.getState());
  const curPosCopy = { ...curPos };
  if (key === 's') curPosCopy.y += 1;
  if (key === 'w') curPosCopy.y -= 1;
  if (key === 'a') curPosCopy.x -= 1;
  if (key === 'd') curPosCopy.x += 1;
  return curPosCopy;
}

export function checkIndex(x: number, y: number): number {
  const { cols } = game;
  return y * cols + x;
}

export function checkCanMove(newPos: { x: number; y: number }): boolean {
  const { layers } = game;
  const mapIndex = checkIndex(newPos.x, newPos.y);
  const nearByObjects = layers[1][mapIndex].intPos;
  store.dispatch(updateObjectsNearBy(nearByObjects));
  console.log('nearByObjects -> ', nearByObjects);
  const result = layers[0][mapIndex].walk;
  return result;
}

function handleMove(key: string): void {
  store.dispatch(changeInteraction('walking'));
  const timer = window.setInterval(() => {
    const newPos = calcNewPos(key);
    if (checkCanMove(newPos)) {
      shuffleWalkShort.play();
      store.dispatch(changeMovePos());
    } else {
      const randomCollisionSound =
        collisionArray[Math.floor(Math.random() * collisionArray.length)];
      howlCollisionsObj[randomCollisionSound].play();
    }
  }, 200);
  store.dispatch(setMoveIntId(timer));
}

function handleStop(): void {
  const timer = selectMoveIntId(store.getState());
  if (timer) {
    window.clearInterval(timer);
    store.dispatch(changeInteraction('idle'));
    store.dispatch(setMoveIntId(null));
    store.dispatch(setMoveDir(null));
  }
}

export function cancelCurrentInteraction(): void {
  store.dispatch(changeInteraction('cancel'));
}
const runInteractionAnimations = (interaction: string): void => {
  const { currentInteraction } = store.getState().sprite;
  if (currentInteraction === 'idle') {
    store.dispatch(changeInteraction(interaction));
    playObjectSound(interaction);
    handleInteraction(interaction);
  }
};

export function downHandler(event: KeyboardEvent): void {
  const currentInteraction = selectCurrentInteraction(store.getState());
  if (currentInteraction !== 'walking') {
    cancelCurrentInteraction();
  }
  const moveDir = selectMoveDir(store.getState());
  const leftFired = selectLeftFired(store.getState());
  const rightFired = selectRightFired(store.getState());
  const upFired = selectUpFired(store.getState());
  const downFired = selectDownFired(store.getState());
  if (event.key === 'a' && !leftFired) {
    if (moveDir === null) {
      store.dispatch(toggleLeftFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    } else {
      handleStop();
      store.dispatch(toggleLeftFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    }
  }
  if (event.key === 'd' && !rightFired) {
    if (moveDir === null) {
      store.dispatch(toggleRightFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    } else {
      handleStop();
      store.dispatch(toggleRightFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    }
  }
  if (event.key === 'w' && !upFired) {
    if (moveDir === null) {
      store.dispatch(toggleUpFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    } else {
      handleStop();
      store.dispatch(toggleUpFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    }
  }
  if (event.key === 's' && !downFired) {
    if (moveDir === null) {
      store.dispatch(toggleDownFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    } else {
      handleStop();
      store.dispatch(toggleDownFired());
      store.dispatch(setMoveDir(event.key));
      handleMove(event.key);
    }
  }
}

export function upHandler(event: KeyboardEvent): void {
  const moveDir = selectMoveDir(store.getState());
  const leftFired = selectLeftFired(store.getState());
  const rightFired = selectRightFired(store.getState());
  const upFired = selectUpFired(store.getState());
  const downFired = selectDownFired(store.getState());
  store.dispatch(updateLastInput);

  if (event.key === 'a') {
    if (leftFired) {
      store.dispatch(toggleLeftFired());
    }
    if (moveDir === event.key) {
      handleStop();
    }
  }
  if (event.key === 'd') {
    if (rightFired) {
      store.dispatch(toggleRightFired());
    }
    if (moveDir === event.key) {
      handleStop();
    }
  }
  if (event.key === 'w') {
    if (upFired) {
      store.dispatch(toggleUpFired());
    }
    if (moveDir === event.key) {
      handleStop();
    }
  }
  if (event.key === 's') {
    if (downFired) {
      store.dispatch(toggleDownFired());
    }
    if (moveDir === event.key) {
      handleStop();
    }
  }
  if (event.key === 'k') {
    const interactionOne = store.getState().sprite.objectsNearBy[0];
    if (typeof interactionOne === 'string')
      runInteractionAnimations(interactionOne);
  }
  if (event.key === 'l') {
    const interactionTwo = store.getState().sprite.objectsNearBy[1];
    if (typeof interactionTwo === 'string')
      runInteractionAnimations(interactionTwo);
  }
}
