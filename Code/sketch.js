{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let song_length = 3;\
let instruments_length = 6;\
let sounds = [];\
let instrumentIndex = -1;\
var markers = []; // \uc0\u55357 \u56393  markers als globale Variable\
let activeInstruments = new Array(instruments_length).fill(false);\
\
let song = 0;\
\
var detector, canvas, context, capture, loaded;\
var last_marker_id = -1;\
\
function preload() \{\
  for (let i = 0; i < song_length; i++) \{\
    sounds[i] = [];\
    for (let j = 0; j < instruments_length; j++) \{\
      sounds[i][j] = loadSound('song_' + nf(i + 1, 2) + '_instrument_' + nf(j + 1, 2) + '.mp3');\
    \}\
  \}\
\}\
\
function setup() \{\
  pixelDensity(1);\
  //createCanvas(500, 500);\
  //print(sounds);\
  \
  canvas = createCanvas(windowWidth, windowHeight);\
  canvas.id('canvas');\
  \
  textAlign(CENTER, CENTER);\
  textSize(50);\
  \
  // webcam capture\
  capture = createCapture(VIDEO, captureLoaded);\
  //capture.hide();\
  capture.id('video');\
  \
  // aruco detector\
  detector = new AR.Detector(\{\
        dictionaryName: 'ARUCO'\
      \});\
\
  // Alle Sounds vorbereiten & muten\
  for (let i = 0; i < sounds.length; i++) \{\
    for (let j = 0; j < sounds[i].length; j++) \{\
      sounds[i][j].loop();\
      sounds[i][j].setVolume(0);\
    \}\
  \}\
\}\
\
function draw() \{\
  background(255);\
  \
\
  markers = detectMarkers(); // globale Variable verwenden\
\
  if (markers.length > 0) \{\
    let id = markers[0].id;\
\
    if (id != last_marker_id) \{\
      print("new marker: " + id);\
      last_marker_id = id;\
    \}\
\
    if (id === 0) \{\
      for (let i = 0; i < activeInstruments.length; i++) \{\
        activeInstruments[i] = false;\
      \}\
      instrumentIndex = -1;\
      set_sound_layers();\
      return;\
    \}\
\
    if (id == 10) \{\
      song = 1;\
      instrumentIndex = 0;\
    \}\
    else if (id == 20) \{\
      song = 2;\
      instrumentIndex = 0;\
    \}\
    else if (id == 30) \{\
      song = 3;\
      instrumentIndex = 0;\
    \}\
\
    // Marker 2\'965 \uc0\u8594  erweitern abh\'e4ngig vom aktivierten Song\
    else if (id >= 2 && id <= 5) \{\
      if (song == 1 && id <= 5) \{\
        instrumentIndex = id - 1;\
      \}\
      else if (song == 2 && id <= 5) \{\
        instrumentIndex = id - 1;\
      \}\
      else if (song == 3 && id <= 4) \{\
        instrumentIndex = id - 1;\
  \}\
\}\
    //..\
  \}\
  \
  set_sound_layers();\
  \
  // Aufbauende Instrumentensteuerung\
  if (instrumentIndex >= 0) \{\
    for (let i = 0; i < activeInstruments.length; i++) \{\
      activeInstruments[i] = i <= instrumentIndex;\
    \}\
  \}\
\}\
\
function keyPressed() \{\
  // Song-Auswahl mit 1\'966\
  if (key == '1') song = 1;\
  else if (key == '2') song = 2;\
  else if (key == '3') song = 3;\
  else if (key == '4') song = 4;\
  else if (key == '5') song = 5;\
  else if (key == '6') song = 6;\
\
  // Instrumenten-Logik mit a\'96f\
  instrumentIndex = -1;\
  if (key == 'a') instrumentIndex = 0;\
  else if (key == 'b') instrumentIndex = 1;\
  else if (key == 'c') instrumentIndex = 2;\
  else if (key == 'd') instrumentIndex = 3;\
  else if (key == 'e') instrumentIndex = 4;\
  else if (key == 'f') instrumentIndex = 5;\
  else if (key == 'g') instrumentIndex = 6;\
  \
\
  // Aufbauende Instrumentensteuerung\
  if (instrumentIndex >= 0) \{\
    for (let i = 0; i < activeInstruments.length; i++) \{\
      activeInstruments[i] = i <= instrumentIndex;\
    \}\
  \}\
\
  print("Song:", song, "Aktive Instrumente:", activeInstruments);\
  set_sound_layers();\
\}\
\
function set_sound_layers() \{\
  for (let i = 0; i < sounds.length; i++) \{\
    for (let j = 0; j < sounds[i].length; j++) \{\
      if (i == song - 1 && activeInstruments[j]) \{\
        sounds[i][j].setVolume(1);\
      \} else \{\
        sounds[i][j].setVolume(0);\
      \}\
    \}\
  \}\
\}\
\
\
\
function detectMarkers() \{\
  if (loaded == true) \{\
    // write current capture image of offscreen canvas\
    context.image(capture, 0, 0);\
    image(context, 0, 0);\
    // get right image format from offscreen canvas\
    imageData = context.elt.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);\
    // search markers in image\
    var markers_ = detector.detect(imageData);\
    //print(markers_);\
    return markers_;\
  \}\
  else \{\
    return [];\
  \}\
\}\
\
function captureLoaded() \{\
  loaded = true;\
  \
  print("loaded");\
  print(capture.width, capture.height);\
  \
  // offscreen canvas for cv\
  context = createGraphics(capture.width, capture.height);\
\}\
}