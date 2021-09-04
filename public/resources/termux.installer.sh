echo ---- WIIUMC INSTALLER FOR MOBILE DEVICES ----
echo -- INSTALLING DEPS --

apt update
apt install git node.js

echo Starting download from Internet...
git clone https://github.com/CarlosNunezMX/WiiUMC-beta-server /storage/downloads/WiiUMC

echo INSTALLING IN YOUR DEVICE
cd /storage/downloads/WIIUMC
npm install

echo Starting application
echo You can put your videos on /downloads/WiiUMC/public/videos
npm start