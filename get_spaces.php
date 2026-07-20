<?php
$client = new \Google\Client();
$client->setAuthConfig(config('google-chat.service_account_credentials'));
$client->addScope('https://www.googleapis.com/auth/chat.bot');
$service = new \Google\Service\HangoutsChat($client);
$response = $service->spaces->listSpaces();
$foundSpaces = [];
foreach($response->getSpaces() as $space) {
    $foundSpaces[] = [
        'name' => $space->getName(),
        'displayName' => $space->getDisplayName(),
        'type' => $space->getType()
    ];
}
echo json_encode($foundSpaces, JSON_PRETTY_PRINT);
