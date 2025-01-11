<script lang="ts">


    let { color, outline, size, shape, name, selected, placed, clicker } = $props()


    function handleClick() {
        clicker(name);
    }

</script>

<style lang="scss">
  .game-piece {
    display: inline-block;
    width: 50px;
    border: 2px solid transparent;
    position: relative;
    background-color: black;
    transition: transform 0.3s;

    &.color-brown {
      background-color: #81391d;
      &.selected {
        background-color: #aa543a;
      }
    }

    &:not(.selected) {
      cursor: pointer;
    }

    &.selected {
      transition: transform 0.3s;
      transform: scale(1.05);
    }



    &.no-outline {
      border-color: transparent;
    }

    &.color-black {
      background-color: black;
      &.selected {
        background-color: #464646;
      }

    }

    &.outline {
      border-color: #ff0000;
    }

    &.size-short {
      margin-top: 35px;
      height: 50px;
    }

    &.size-tall {
      margin-top: 10px;
      height: 100px;
    }

    &.shape-square {
      border-radius: 0;
    }

    &.shape-circular {
      border-top-left-radius: 45%;
      border-top-right-radius: 45%;
    }

    &:hover {
      &:not(.placed) {
        transform: scale(1.05);
      }
    }

    &.placed {
      cursor: not-allowed;
    }

  }
</style>

<div
    onclick={handleClick}
    class="game-piece
    {color == 1 ? 'color-brown' : 'color-black'}
    {outline === 1 ? 'outline' : 'no-outline'}
    {size === 1 ? 'size-tall' : 'size-short'}
    {shape === 1 ? 'shape-circular' : 'shape-square'}
    {selected === true ? 'selected' : ''}
    {placed === true ? 'placed' : '' }
  "
></div>
