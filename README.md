# Art Génératif (p5.js)

## :speech_balloon: Traitement d'images & Classification d'objets

Projet de stage étudiant sur le traitement d'image et la classification d'objets

La visualisation est réalisée grâce à la librairie Javascript p5.js <br>
<https://p5js.org/>

La classification des objets est réalisée grâce à la libraire Javascript ml5.js <br>
<https://ml5js.org/>

## :gear: Setup du projet
```sh
git clone https://github.com/adriens/web-generative-art-processing-pixels
cd web-generative-art-processing-pixels
docker build -t image-art .
docker run --name=image-art -d -p 80:80 image-art
docker ps
```

## :fireworks: Pour accéder aux visualisations
* <http://localhost> ou <http://127.0.0.1>
