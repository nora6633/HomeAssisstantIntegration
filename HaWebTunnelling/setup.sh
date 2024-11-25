ssh -fNR localhost:8122:localhost:8122 krixi@163.22.17.116
apk add nodejs npm
pip3 install plugp100
npm install pm2 -g
pm2 start npm -- start
