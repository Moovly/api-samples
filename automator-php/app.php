<?php

# install composer
require __DIR__ . '/vendor/autoload.php';

$clients = [
    ['name' => 'Bill Gates'],
    ['name' => 'Jeff Besos'],
    ['name' => 'Elon Musk'],
];

$projectTemplateId = 'someId';
$accessToken = 'someToken';

$httpClient = new GuzzleHttp\Client();

$response = $httpClient->post('https://api.moovly.com/generator/v1/templates', [
    'headers' => [
        'Authorization' => 'Bearer ' . $accessToken,
    ],
    'form_params' => [
        'moov_id' => $projectTemplateId
    ]
]);

$template = json_decode($response->getBody()->getContents(), true);

$templateId = $template['id'];
$variables = $template['variables'];

$requestData = [
    'template_id' => $templateId,
    'options' => [
        'quality' => '480p'
    ],
    'values' => $variables
];

$response = $httpClient->post('https://api.moovly.com/generator/v1/jobs', [
    'headers' => [
        'Authorization' => 'Bearer ' . $accessToken,
        'Content-Type'  => 'application/json'
    ],
    'json' => $requestData
]);

$jobs = json_decode($response->getBody()->getContents(), true);

$jobId = $jobs['id'];

do {
    $response = $httpClient->get('https://api.moovly.com/generator/v1/jobs/' . $jobId, [
        'headers' => [
            'Authorization' => 'Bearer ' . $accessToken
        ]
    ]);

    $jobsStates = array_map(function (array $job) {
        return $job['status'] === 'finished';
    }, $jobs['videos']);

    $finishedUrls = array_map(function (array $job) {
        return $job['url'];
    }, $jobs['videos']);
    sleep(30);
} while (in_array(false, $jobsStates, true));

echo 'Video urls ' . implode(', ', $finishedUrls);