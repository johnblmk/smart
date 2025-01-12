<!-- src/components/GamePiece.svelte -->
<script lang="ts">
    import type { GamePieceOption } from '../interfaces';

    export let color: GamePieceOption['color'];
    export let outline: GamePieceOption['outline'];
    export let size: GamePieceOption['size'];
    export let shape: GamePieceOption['shape'];
    export let name: GamePieceOption['name'];
    export let selected: boolean = false;
    export let placed: boolean = false;
    export let clicker: (pieceName: string) => void;

    function handleClick() {
        // If the piece is placed already, do nothing
        if (placed) return;
        clicker(name);
    }
</script>

<style lang="scss">
  .game-piece {
    width: 100px;
    margin: 0 auto;
    cursor: pointer;
    position: relative;
    border: 5px solid transparent;
    border-radius: 14px;
    transform-style: preserve-3d;
    transition: transform 0.25s, box-shadow 0.25s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    /*
      We'll use background gradients to hint at a 3D or carved vibe.
    */
    background: radial-gradient(circle at 50% 30%, #fff, #ccc 80%);

    &.bump {
      border-top: none;
        &::before {

            content: "";
            position: absolute;
            /* Adjust these values as you like for shape/size */
            width: 60%;
            height: 24px;
              border-top-left-radius: 60%;
              border-top-right-radius: 60%;
            background: inherit; /* Same color as the piece */
            top: -4px;
            left: 20%;
            transform: translateY(-50%);
        }

      &.shape-square {
        &::before {
          top: -8px;
          height: 25px;
        }
      }

        &.size-tall.shape-circular {
            &::before {
                top: 0;
            }
        }

    }
    &.no-bump {
        &::before {
        content: none;
        }
    }

    &.placed {
      cursor: not-allowed;
      opacity: 0.85;
    }

    /*
      For the "selected" state, let's add a more dramatic glow
      plus a bigger scale effect.
    */
    &.selected {
      transform: translateY(-5px) scale(1.12);
      box-shadow:
              0 0 30px 10px rgba(255, 223, 0, 0.5),  /* gold-ish glow */
              0 16px 24px rgba(0, 0, 0, 0.4);
    }

    &:hover:not(.placed) {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
      &.selected {
        transform: translateY(-5px) scale(1.12);
        box-shadow:
                0 0 30px 10px rgba(255, 223, 0, 0.5),  /* gold-ish glow */
                0 16px 24px rgba(0, 0, 0, 0.4);
      }

    }

    /*
      Color variants for background:
    */
    &.color-black {
      background: radial-gradient(circle at 50% 30%, #424242, #1a1a1a 70%);
    }
    &.color-brown {
      background: radial-gradient(circle at 50% 30%, #a26b41, #7b4f2e 70%);
    }

    /*
      Height/size variants:
    */
    &.size-short {
      height: 90px;
    }
    &.size-tall {
      height: 145px;
    }

    /*
      Shape variants:
      - shape-square: corners remain (slightly) squared
      - shape-circular: top corners heavily rounded
    */
    &.shape-square {
      border-radius: 6px;
    }
    &.shape-circular {
      border-top-left-radius: 60%;
      border-top-right-radius: 60%;
      border-bottom-left-radius: 10%;
      border-bottom-right-radius: 10%;
    }


  }
</style>

<div
        on:click={handleClick}
        class="game-piece
    {color == 1 ? 'color-brown' : 'color-black'}
    {outline === 1 ? 'bump' : 'no-bump'}
    {size === 1 ? 'size-tall' : 'size-short'}
    {shape === 1 ? 'shape-circular' : 'shape-square'}
    {selected ? 'selected' : ''}
    {placed ? 'placed' : ''}"
></div>
