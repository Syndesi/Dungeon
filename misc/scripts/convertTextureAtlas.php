<?php
// converts pxyel-tilemaps to TexturePacker's format

$res = convert($argv[1]);
//file_put_contents(__DIR__.'/'.$argv[2], json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
file_put_contents(__DIR__.'/'.$argv[2], json_encode($res));

function convert($path){
  $o = json_decode(file_get_contents(__DIR__.'/'.$path), true);
  $width   = $o['tilewidth'];
  $height  = $o['tileheight'];
  $rows    = $o['tileshigh'];
  $columns = $o['tileswide'];
  $res = ['frames' => []];
  for($y = 0;$y < $rows;$y++){
    for($x = 0;$x < $columns;$x++){
      $res['frames']['tile-'.$x.'-'.$y] = [
        'frame' => [
          'x' => $x * $width,
          'y' => $y * $height,
          'w' => $width,
          'h' => $height
        ],
        'rotated' => false,
        'trimmed' => false,
        'spriteSourceSize' => [
          'x' => 0,
          'y' => 0,
          'w' => $width,
          'h' => $height
        ],
        'sourceSize' => [
          'w' => $width,
          'h' => $height
        ]
      ];
    }
  }
  $res['meta'] = [
    'image' => pathinfo(__DIR__.'/'.$path, PATHINFO_FILENAME).'.png',
    'format' => 'RGBA8888',
    'size' => [
      'w' => $width*$columns + 1,
      'h' => $height*$rows + 1
    ],
    'scale' => 1
  ];
  return $res;
}


?>