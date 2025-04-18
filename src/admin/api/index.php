<?php
/**
 * Cloudinary Folder API Proxy
 * 
 * This script acts as a proxy between your frontend and the Cloudinary Admin API.
 * It securely fetches images from a specific Cloudinary folder.
 * 
 * Save this file as: /admin/api/cloudinary-folder.php
 */

// Set proper headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // In production, limit this to your domain
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Method not allowed']);
    http_response_code(405);
    exit;
}

// Get the folder parameter
$folder = isset($_GET['folder']) ? $_GET['folder'] : null;

if (empty($folder)) {
    echo json_encode(['error' => 'Folder name is required']);
    http_response_code(400);
    exit;
}

// Cloudinary configuration
$cloudName = 'dc9hlg7k4'; // Your Cloudinary cloud name
$apiKey = '783782757163982'; // Your Cloudinary API key
$apiSecret = 'h7S1F7CifKvMP_STMlLbsRCrFdw'; // Your Cloudinary API secret - IMPORTANT: Fill this in!

// Format the prefix parameter - add trailing slash if not present
$prefix = rtrim($folder, '/') . '/';

// Build the authentication parameters
$timestamp = time();
$params = [
    'prefix' => $prefix,
    'max_results' => 500,
    'type' => 'upload',
    'timestamp' => $timestamp
];

// Sort parameters alphabetically by key
ksort($params);

// Build the string to sign
$signString = '';
foreach ($params as $key => $value) {
    $signString .= $key . '=' . $value . '&';
}
$signString = rtrim($signString, '&');

// Add the API secret
$signString .= $apiSecret;

// Create the signature
$signature = sha1($signString);

// Build the API URL
$url = "https://api.cloudinary.com/v1_1/{$cloudName}/resources/image";

// Add the parameters to the URL
$url .= '?' . http_build_query($params) . '&api_key=' . $apiKey . '&signature=' . $signature;

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

// Execute the request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

// Close cURL
curl_close($ch);

// Handle errors
if ($error) {
    echo json_encode(['error' => 'API request failed: ' . $error]);
    http_response_code(500);
    exit;
}

// Return the API response
http_response_code($httpCode);
echo $response;