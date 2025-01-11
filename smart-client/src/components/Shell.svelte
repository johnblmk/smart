<script>
    let isSidebarOpen = true;

    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
    };
</script>

<style>
    .shell {
        display: flex;
        height: 100vh;
    }

    .sidebar {
        width: 250px;
        background-color: #f8f9fa;
        padding: 15px;
        border-right: 1px solid #ddd;
        transition: transform 0.3s ease-in-out;
    }

    .sidebar.closed {
        transform: translateX(-100%);
    }

    .main-content {
        flex-grow: 1;
        padding: 20px;
        background-color: #fff;
    }

    .navbar {
        background-color: #007bff;
        color: white;
        padding: 10px;
    }

    .toggle-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
    }
</style>

<div class="shell">
    <!-- Sidebar -->
    <div class="sidebar {isSidebarOpen ? '' : 'closed'}">
        <h3>Sidebar</h3>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </div>

    <!-- Main content -->
    <div class="main-content">
        <!-- Navbar -->
        <div class="navbar">
            <button class="toggle-btn" on:click={toggleSidebar}>
                {isSidebarOpen ? 'Hide' : 'Show'} Sidebar
            </button>
            <span>My App</span>
        </div>

        <!-- Main slot for content -->
        <slot />
    </div>
</div>
