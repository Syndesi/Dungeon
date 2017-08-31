<?php

parseFile($argv[1], $argv[2]);


function parseFile($path, $path2){
  $name = pathinfo(__DIR__.'/'.$path, PATHINFO_FILENAME);
  $file = file_get_contents($path);
  $file = str_replace('((float)Math.PI / 2F)', '1.570796327F', $file);
  $ids = getBoxes($file);
  $res  = '<Techne Version="2.2"><Author>ZeuX</Author><DateCreated></DateCreated><Description></Description>';
  $res .= '<Models><Model texture="tmp.png"><BaseClass>ModelBase</BaseClass><Geometry>';
  foreach($ids as $id){
    $tmp = findData($file, $id);
    $res .= getShape($id, $tmp);
  }
  $res .= '</Geometry><GlScale>1,1,1</GlScale><Name>'.$name.'</Name><TextureSize>64,32</TextureSize>';
  $res .= '</Model></Models><Name>'.$name.'</Name><PreviewImage></PreviewImage>';
  $res .= '<ProjectName>'.$name.'</ProjectName><ProjectType>Minecraft</ProjectType></Techne>';
  //print_r($res);
  //$data = findData($file, 'Mane');
  //print_r(getShape('Mane', $data));
  file_put_contents(__DIR__.'/'.$path2.'.tmp', $res);
  $zip = new ZipArchive;
  $zip->open(__DIR__.'/demo.zip');
  $zip->addFile(__DIR__.'/'.$path2.'.tmp', 'model.xml');
  $zip->close();
  unlink(__DIR__.'/'.$path2.'.tmp');
}

function getBoxes($string){
  $list = [];
  $res = [];
  preg_match_all("/(ModelRenderer )\w+(;)/", $string, $list);
  foreach($list[0] as $entry){
    $entry = str_replace('ModelRenderer', '',$entry);
    $entry = str_replace(' ', '',$entry);
    $entry = str_replace(';', '',$entry);
    $res[] = $entry;
  }
  return $res;
}

function findData($string, $id){
  $box           = null;
  $rotationPoint = null;
  $rotation      = null;

  preg_match("/(".$id.".addBox\().+(;)/", $string, $box);
  preg_match("/(".$id.".setRotationPoint\().+(;)/", $string, $rotationPoint);
  preg_match("/(setRotation\(".$id.").+(;)/", $string, $rotation);
  $box = str_replace($id.'.addBox(', '', $box[0]);
  $box = str_replace(');', '', $box);
  $box = str_replace('F', '', $box);
  $box = str_replace(' ', '', $box);
  $box = explode(',', $box);
  $rotationPoint = str_replace($id.'.setRotationPoint(', '', $rotationPoint[0]);
  $rotationPoint = str_replace(');', '', $rotationPoint);
  $rotationPoint = str_replace('F', '', $rotationPoint);
  $rotationPoint = str_replace(' ', '', $rotationPoint);
  $rotationPoint = explode(',', $rotationPoint);
  $rotation = str_replace('setRotation('.$id.',', '', $rotation[0]);
  $rotation = str_replace(');', '', $rotation);
  $rotation = str_replace('F', '', $rotation);
  $rotation = str_replace(' ', '', $rotation);
  $rotation = explode(',', $rotation);
  foreach($rotation as $i => $r){
    $rotation[$i] = round($r / (2 * M_PI) * 360, 2);
  }
  $res = [
    'box'           => $box,
    'rotationPoint' => $rotationPoint,
    'rotation'      => $rotation
  ];
  return $res;
}

function getShape($id, $data){
  $res  = '<Shape type="d9e621f7-957f-4b77-b1ae-20dcd0da7751" name="'.strtolower($id).'">';
  $res .= '<Animation><AnimationAngles>,0,0</AnimationAngles><AnimationDuration>0,0,0</AnimationDuration><AnimationType>0,0,0</AnimationType></Animation>';
  $res .= '<IsDecorative>False</IsDecorative><IsFixed>False</IsFixed><IsMirrored>False</IsMirrored>';
  $res .= '<Offset>'.$data['box'][0].','.$data['box'][1].','.$data['box'][2].'</Offset>';
  $res .= '<Position>'.$data['rotationPoint'][0].','.$data['rotationPoint'][1].','.$data['rotationPoint'][2].'</Position>';
  $res .= '<Rotation>'.$data['rotation'][0].','.$data['rotation'][1].','.$data['rotation'][2].'</Rotation>';
  $res .= '<Size>'.$data['box'][3].','.$data['box'][4].','.$data['box'][5].'</Size>';
  $res .= '<TextureOffset>0,0</TextureOffset></Shape>';
  return $res;
}


?>