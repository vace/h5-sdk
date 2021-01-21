echo 'make.sh'

# create libs
npm run web
# npm run node
# npm run mini
npm run dts

# publish sdk
cd dist/web-sdk
nrm use npm
npm publish

# reset taobao
nrm use taobao
