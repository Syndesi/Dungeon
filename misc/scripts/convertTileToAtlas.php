<?php
// converts a custom tilemap-format to TexturePacker's format

$res = convert($argv[1]);
//file_put_contents(__DIR__.'/'.$argv[2], json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
file_put_contents(__DIR__.'/'.$argv[2], json_encode($res));

function convert($path){
  $lines = explode("\n", file_get_contents(__DIR__.'/'.$path));
  $metaData = explode(',', trim(array_shift($lines)));
  $res = ['frames' => []];
  foreach($lines as $line){
    $line = trim($line);
    if(strlen($line) > 0){
      // id:x,y,width,height
      $tmp = explode(":", $line);      // ['id', 'x,y,width,height']
      $tmp[1] = explode(",", $tmp[1]); // ['id', [x, y, width, height]]
      $res['frames'][$tmp[0]] = [
        'frame' => [
          'x' => $tmp[1][0],
          'y' => $tmp[1][1],
          'w' => $tmp[1][2],
          'h' => $tmp[1][3]
        ],
        'rotated' => false,
        'trimmed' => false,
        'spriteSourceSize' => [
          'x' => 0,
          'y' => 0,
          'w' => $tmp[1][2],
          'h' => $tmp[1][3]
        ],
        'sourceSize' => [
          'w' => $tmp[1][2],
          'h' => $tmp[1][3]
        ]
      ];
    }
  }
  $res['meta'] = [
    'image' => $metaData[0],
    'format' => 'RGBA8888',
    'size' => [
      'w' => $metaData[1],
      'h' => $metaData[2]
    ],
    'scale' => 1
  ];
  return $res;
}


?>