<?php
require_once __DIR__ . '/../helpers/auth.php';
startAdminSession();
session_destroy();
header('Location: index.php');
exit();
