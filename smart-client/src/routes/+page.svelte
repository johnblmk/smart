<!-- src/routes/GamePage.svelte -->
<script lang="ts">
    import GamePiece from '../components/GamePiece.svelte';

    // Import everything from our game store and logic
    import {
        unPlayedPieces,
        playedPieces,
        boardLocations,
        currentPlayer,
        action,
        showModal,
        showChooseNewGameModal,
        choosePlayer,
        chooseToStartNewGame,
        handleSelecting,
        playPiece,
        showWinModal,
        startNewGameFromWin,
        winner,
        me,
        initGame
    } from '../stores/gameStore';

    let localMe: 'John' | 'Sophie' | null = null;

    // The game starts once we pick a player and choose new or existing game
    // so no immediate call to initGame() until after user chooses

    $: if (localMe !== null) {
        // If you wanted to do something with localMe, do it here
        // But in this example, we're using choosePlayer() directly
    }



</script>

<style lang="scss">
  /*
    ----------------------------------------------------
      GENERAL LAYOUT + THEME
    ----------------------------------------------------
  */

  .shell {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #d9c2a4 0%, #f7efe5 40%, #e2c391 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }

  /*
    ----------------------------------------------------
      SIDEBAR
    ----------------------------------------------------
  */
  .sidebar {
    width: 300px;
    background: #4b2e18; /* Dark wood shade */
    padding: 20px;
    border-right: 2px solid #3f210f;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);

    h3 {
      font-weight: 600;
      color: #f7f0e7;
      margin-bottom: 0.5rem;
    }

    span {
      color: #e4ddd5;
      font-size: 1rem;
    }

    &.closed {
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
    }
  }

  /*
    ----------------------------------------------------
      MAIN CONTENT
    ----------------------------------------------------
  */
  .main-content {
    flex-grow: 1;
    padding: 30px;
    position: relative;
  }

  /*
    ----------------------------------------------------
      MODALS
    ----------------------------------------------------
  */
  .mozal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(34, 34, 34, 0.5);
    z-index: 9;
  }

  .mozal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background: #fffef9;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    min-width: 300px;
    max-width: 420px;
    text-align: center;

    h2 {
      font-size: 1.4rem;
      margin-bottom: 15px;
      color: #4b2e18;
    }

    button {
      margin: 5px;
      padding: 12px 24px;
      border: none;
      background-color: #764d26;
      color: #fef9f2;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      box-shadow: 0 3px 5px rgba(0,0,0,0.2);
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #5c3b1e;
      }
    }
  }

  /**
     ----------------------------------------------------
       GAME PIECES
        ----------------------------------------------------
   */
    .unselected-spot {
      margin-bottom: 1.5rem;
    }

  /*
    ----------------------------------------------------
      BOARD AREA
    ----------------------------------------------------
  */
  .left-border {
    border-left: 3px solid #4b2e18;
    padding-left: 20px;
  }

  .board-location {
    border: 2px solid #8b5e3c;
    height: 120px;
    text-align: center;
    background: #e4d1b7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 0;
    box-shadow: inset 0 0 2px rgba(0,0,0,0.2);

    &.has-piece {
      background-color: #f0e7d9;
      cursor: not-allowed;
    }

    &:hover:not(.has-piece) {
      background-color: #e9dcbf;
      cursor: pointer;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
      transition: background-color 0.2s ease;
    }
  }

  .navbar {
    background-color: #4b2e18;
    color: #fff;
    padding: 10px;

    .toggle-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }
  }
</style>

<div class="shell">
    <!-- Sidebar -->
    <div class="sidebar">
        {#if !($showModal || $showChooseNewGameModal)}
            <h3>{$currentPlayer}'s Turn!</h3>
            <span>{$action}</span>
        {/if}
    </div>

    <!-- Main content -->
    <div class="main-content">
        <!-- Modal: choose player -->
        {#if $showModal}
            <div class="mozal-overlay"></div>
            <div class="mozal">
                <h2>Choose Your Player</h2>
                <button on:click={() => choosePlayer('John')}>John</button>
                <button on:click={() => choosePlayer('Sophie')}>Sophie</button>
            </div>
        {/if}

        {#if $showWinModal}
            <div class="mozal-overlay"></div>
            <div class="mozal">
                <h2>{$winner} wins!</h2>
                <button on:click={startNewGameFromWin}>Start New Game</button>
            </div>
        {/if}


        <!-- Modal: new or existing game? -->
        {#if $showChooseNewGameModal}
            <div class="mozal-overlay"></div>
            <div class="mozal">
                <h2>Do you want to start a new game?</h2>
                <button on:click={() => chooseToStartNewGame(true)}>Yes</button>
                <button on:click={() => chooseToStartNewGame(false)}>No</button>
            </div>
        {/if}

        <!-- Game Board -->
        {#if !($showModal || $showChooseNewGameModal)}
            <div class="row">
                <div class="col-1"></div>
                <div class="col-6">
                    <div class="row">
                        {#each $boardLocations as location (location.name)}
                            <div
                                    class="col-md-3 board-location {location.piece ? 'has-piece' : ''}"
                                    on:click={() => playPiece(location.name)}
                            >
                                {#if location.piece}
                                    {#each $playedPieces as piece (piece.name)}
                                        {#if piece.name === location.piece}
                                            <GamePiece
                                                    color={piece.color}
                                                    outline={piece.outline}
                                                    size={piece.size}
                                                    shape={piece.shape}
                                                    name={piece.name}
                                                    selected={piece.selected}
                                                    placed={piece.placed}
                                                    clicker={() => {}}
                                            />
                                        {/if}
                                    {/each}
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="col-4 left-border">
                    <div class="row">
                        {#each $unPlayedPieces as piece (piece.name)}
                            <div class="col-md-3 unselected-spot">
                                <GamePiece
                                        color={piece.color}
                                        outline={piece.outline}
                                        size={piece.size}
                                        shape={piece.shape}
                                        name={piece.name}
                                        selected={piece.selected}
                                        placed={piece.placed}
                                        clicker={handleSelecting}
                                />
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<!-- Initialize the game whenever this component mounts -->
<svelte:window on:load={initGame} />
